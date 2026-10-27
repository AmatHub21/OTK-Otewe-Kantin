import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'node:crypto';

const app=express();
const prisma=new PrismaClient();
const port=Number(process.env.PORT||4000);
app.use(helmet());
const allowedOrigins=(process.env.FRONTEND_URL||'http://localhost:5173').split(',').map(v=>v.trim()).filter(Boolean);
app.use(cors({origin:(origin,callback)=>{if(!origin||allowedOrigins.includes('*')||allowedOrigins.includes(origin))return callback(null,true);return callback(new Error('Origin tidak diizinkan oleh konfigurasi CORS.'));}}));
app.use(express.json({limit:'1mb'}));

// Minimal API-key guard for development admin endpoints. Replace with real user sessions/RBAC before public launch.
const requireAdmin=(req: express.Request,res: express.Response,next: express.NextFunction)=>{
  const expected=process.env.ADMIN_API_KEY;
  if(!expected || req.header('x-admin-key')!==expected) return res.status(401).json({error:'Unauthorized'});
  next();
};
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'otk-api',paymentMode:'manual-selection-only'}));
app.post('/api/admin/login',(req,res)=>{
 const email=String(req.body?.email||'');
 const password=String(req.body?.password||'');
 const expectedEmail=process.env.ADMIN_EMAIL||'admin@otk.local';
 const expectedPassword=process.env.ADMIN_PASSWORD;
 const adminKey=process.env.ADMIN_API_KEY;
 if(!expectedPassword||!adminKey) return res.status(503).json({error:'Konfigurasi ADMIN_PASSWORD dan ADMIN_API_KEY belum diisi di backend/.env.'});
 if(email!==expectedEmail||password!==expectedPassword) return res.status(401).json({error:'Email atau password admin salah.'});
 return res.json({ok:true,adminKey});
});
app.get('/api/products',async(_req,res)=>{try{res.json(await prisma.product.findMany({where:{active:true},orderBy:{createdAt:'desc'}}));}catch{res.status(500).json({error:'Gagal mengambil katalog'});}});
app.get('/api/admin/products',requireAdmin,async(_req,res)=>{try{res.json(await prisma.product.findMany({orderBy:{createdAt:'desc'}}));}catch{res.status(500).json({error:'Gagal mengambil katalog'});}});
app.get('/api/admin/orders',requireAdmin,async(_req,res)=>{try{res.json(await prisma.order.findMany({include:{items:true},orderBy:{createdAt:'desc'}}));}catch(err){console.error('Get orders error',err);res.status(500).json({error:'Gagal mengambil daftar pesanan'});}});
app.put('/api/admin/orders/:orderNumber/status',requireAdmin,async(req,res)=>{const status=String(req.body?.status||'');const allowed=['Menunggu konfirmasi','Diproses','Siap Diambil','Dalam Pengantaran','Selesai','Dibatalkan','MENUNGGU_KONFIRMASI'];if(!allowed.includes(status))return res.status(400).json({error:'Status pesanan tidak valid.'});try{const order=await prisma.order.update({where:{orderNumber:req.params.orderNumber},data:{status}});res.json(order);}catch{res.status(404).json({error:'Pesanan tidak ditemukan.'});}});

// IMPORTANT: Add production authentication + role middleware before exposing admin routes publicly.
const productSchema=z.object({name:z.string().min(2),category:z.string().min(2),price:z.number().int().positive(),description:z.string().min(2),image:z.string().url(),stock:z.number().int().min(0),active:z.boolean().optional()});
app.post('/api/admin/products',requireAdmin,async(req,res)=>{const parsed=productSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Data produk tidak valid'});try{const p=await prisma.product.create({data:parsed.data});res.status(201).json(p);}catch{res.status(500).json({error:'Gagal menyimpan produk'});}});
app.put('/api/admin/products/:id',requireAdmin,async(req,res)=>{const parsed=productSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Data produk tidak valid'});try{res.json(await prisma.product.update({where:{id:req.params.id},data:parsed.data}));}catch{res.status(404).json({error:'Produk tidak ditemukan'});}});
app.delete('/api/admin/products/:id',requireAdmin,async(req,res)=>{try{await prisma.product.delete({where:{id:req.params.id}});res.status(204).end();}catch{res.status(404).json({error:'Produk tidak ditemukan'});}});

const checkoutSchema=z.object({
 customer:z.object({name:z.string().min(2),phone:z.string().min(8),email:z.string().email().optional().or(z.literal('')),fulfillment:z.string(),address:z.string().optional(),note:z.string().optional()}),
 items:z.array(z.object({productId:z.string(),quantity:z.number().int().min(1).max(50)})).min(1),
 paymentMethod:z.enum(['Tunai','Transfer Bank','QRIS','DANA','GoPay','OVO','ShopeePay'])
});
// Order checkout records the selected payment method only. It does not call a payment gateway.
app.post('/api/orders/create',async(req,res)=>{
 const parsed=checkoutSchema.safeParse(req.body);
 if(!parsed.success)return res.status(400).json({error:'Data checkout tidak valid. Periksa data pelanggan, produk, dan metode pembayaran.'});
 const {customer,items,paymentMethod}=parsed.data;
 if(customer.fulfillment==='Diantar'&&!customer.address?.trim())return res.status(400).json({error:'Alamat pengantaran wajib diisi.'});
 try{
  const ids=[...new Set(items.map(i=>i.productId))];
  const products=await prisma.product.findMany({where:{id:{in:ids},active:true}});
  const byId=new Map(products.map(p=>[p.id,p]));
  let total=0;const orderItems=[];
  for(const item of items){const p=byId.get(item.productId);if(!p)return res.status(400).json({error:'Ada produk yang tidak tersedia.'});if(p.stock<item.quantity)return res.status(400).json({error:`Stok ${p.name} tidak mencukupi.`});total+=p.price*item.quantity;orderItems.push({productId:p.id,name:p.name,price:p.price,quantity:item.quantity});}
  const orderNumber=`OTK-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const order=await prisma.order.create({data:{orderNumber,customerName:customer.name,customerPhone:customer.phone,customerEmail:customer.email||null,fulfillment:customer.fulfillment,address:customer.address||null,note:customer.note||null,total,status:'MENUNGGU_KONFIRMASI',paymentStatus:'BELUM_DIBAYAR',paymentMethod,items:{create:orderItems}},include:{items:true}});
  res.status(201).json(order);
 }catch(err){console.error('Create order error',err);res.status(500).json({error:'Gagal menyimpan pesanan ke database. Periksa backend dan skema MySQL.'});}
});

app.get('/api/orders/:orderNumber',async(req,res)=>{try{const order=await prisma.order.findUnique({where:{orderNumber:req.params.orderNumber},include:{items:true}});if(!order)return res.status(404).json({error:'Pesanan tidak ditemukan'});res.json(order);}catch{res.status(500).json({error:'Gagal mengambil pesanan'});}});

app.get('/',(_req,res)=>res.json({service:'OTK API',health:'/api/health'}));
app.listen(port,'0.0.0.0',()=>console.log(`OTK API listening on ${port}`));