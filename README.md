# OTK — Otewe Kantin (Vercel + LocalStorage)

Versi frontend-only untuk tugas/penggunaan satu browser. Tidak membutuhkan backend, API, MySQL, Prisma, atau database eksternal. Katalog, keranjang, pesanan, stok, dan status pesanan disimpan di `localStorage` browser.

## Deploy ke Vercel
1. Push folder proyek ini ke GitHub.
2. Import repository di Vercel.
3. Atur **Root Directory** menjadi `frontend`.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. (Opsional) set `VITE_ADMIN_EMAIL` dan `VITE_ADMIN_PASSWORD` di Environment Variables sebelum build. Jika tidak disetel, kredensial bawaan adalah `admin@otk.local` / `otkadmin123`.
8. Deploy. Route `/admin` sudah diatur agar dapat dibuka langsung.

## Jalankan lokal
```bash
cd frontend
npm install
npm run dev
```

## Data dan batasan penting
- Data tersimpan di browser/perangkat yang menggunakannya dan tetap ada saat refresh atau browser ditutup, selama data situs tidak dihapus.
- **LocalStorage bukan penyimpanan bersama.** Pesanan dari perangkat pelanggan tidak akan otomatis muncul di dashboard admin pada perangkat lain. Untuk pesanan lintas perangkat, diperlukan backend dan penyimpanan bersama; hal ini tidak dapat dipenuhi oleh localStorage saja.
- Backup/restore JSON tersedia di dashboard admin. Unduh backup secara berkala.
- Login admin di versi tanpa backend hanya pemeriksaan sisi browser, bukan autentikasi aman. Jangan gunakan untuk informasi sensitif atau layanan publik yang membutuhkan akses admin terlindungi.
- Metode pembayaran hanya dicatat; pembayaran dan verifikasi dilakukan manual.

## Checklist sebelum digunakan
- Uji tambah produk, keranjang, checkout, status pesanan, dan backup/restore setelah deploy.
- Ganti kredensial bawaan melalui Environment Variables sebelum build (tetap bukan keamanan server-side).
