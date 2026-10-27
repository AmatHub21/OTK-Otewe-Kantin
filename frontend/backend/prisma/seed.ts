import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const products = [
 {id:'p1',name:'Nasi Ayam Sambal Matah',category:'Makanan Berat',price:18000,description:'Ayam gurih dengan sambal matah segar dan nasi hangat.',image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',stock:18,active:true},
 {id:'p2',name:'Rice Bowl Teriyaki',category:'Makanan Berat',price:22000,description:'Ayam teriyaki manis gurih, nasi hangat, dan sayuran.',image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85',stock:14,active:true},
 {id:'p3',name:'Mie Goreng Spesial',category:'Makanan Berat',price:15000,description:'Mie goreng dengan telur dan sayuran pilihan.',image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',stock:20,active:true},
 {id:'p4',name:'Roti Panggang Cokelat',category:'Camilan',price:10000,description:'Roti panggang renyah dengan cokelat lumer.',image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',stock:12,active:true},
 {id:'p5',name:'Es Kopi Susu OTK',category:'Minuman',price:12000,description:'Kopi susu creamy yang pas untuk menemani aktivitas.',image:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85',stock:24,active:true}
];
for (const p of products) await prisma.product.upsert({where:{id:p.id},update:p,create:p});
console.log('Seed products complete');
await prisma.$disconnect();