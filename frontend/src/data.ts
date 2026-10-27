export type Product = { id:string; name:string; category:string; price:number; description:string; image:string; stock:number; active:boolean; popular?:boolean };
export const initialProducts: Product[] = [
 {id:'p1',name:'Nasi Ayam Sambal Matah',category:'Makanan Berat',price:18000,description:'Ayam gurih dengan sambal matah segar dan nasi hangat.',image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',stock:18,active:true,popular:true},
 {id:'p2',name:'Rice Bowl Teriyaki',category:'Makanan Berat',price:22000,description:'Ayam teriyaki manis gurih, nasi hangat, dan sayuran.',image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85',stock:14,active:true,popular:true},
 {id:'p3',name:'Mie Goreng Spesial',category:'Makanan Berat',price:15000,description:'Mie goreng dengan telur dan sayuran pilihan.',image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',stock:20,active:true},
 {id:'p4',name:'Roti Panggang Cokelat',category:'Camilan',price:10000,description:'Roti panggang renyah dengan cokelat lumer.',image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',stock:12,active:true},
 {id:'p5',name:'Es Kopi Susu OTK',category:'Minuman',price:12000,description:'Kopi susu creamy yang pas untuk menemani aktivitas.',image:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85',stock:24,active:true,popular:true},
 {id:'p6',name:'Matcha Latte',category:'Minuman',price:16000,description:'Matcha dengan susu lembut dan rasa yang seimbang.',image:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85',stock:10,active:true},
 {id:'p7',name:'Kentang Goreng',category:'Camilan',price:12000,description:'Kentang goreng keemasan, renyah di luar dan lembut di dalam.',image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',stock:0,active:true},
 {id:'p8',name:'Salad Buah Segar',category:'Camilan',price:14000,description:'Potongan buah segar dengan saus creamy.',image:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=85',stock:9,active:true}
];
export const rupiah = (n:number) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
export type CartItem = { productId:string; quantity:number; note?:string };
export type Order = { id:string; customer:string; phone:string; fulfillment:string; address:string; items:{name:string;quantity:number;price:number}[]; total:number; status:string; paymentStatus:string; paymentMethod?:string; createdAt:string };
