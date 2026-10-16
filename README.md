# Portofolio Finance Staff – Simulasi Excel (Next.js + Supabase + Vercel)

Halaman: `/arus-kas` (SUMIF), `/penjualan` (VLOOKUP + IFERROR), `/invoice` (subtotal, pajak 11%, total, terbilang).
Setiap halaman punya tombol **Unduh Excel (.xlsx)** (berisi rumus asli) dan **Cetak / Simpan PDF**.

## A. Database Supabase
1. Daftar/login di https://supabase.com → **New project** (isi nama, password database, region Singapore) → tunggu selesai.
2. Menu **SQL Editor → New query** → tempel isi `supabase/schema.sql` → **Run**. (Membuat 4 tabel.)
3. Isi data, pilih SALAH SATU:
   - **Cara cepat:** SQL Editor → tempel isi `supabase/seed.sql` → Run.
   - **Cara import CSV:** **Table Editor** → pilih tabel → **Insert → Import data from CSV** → pilih file dengan nama yang sama di `supabase/csv/` (barang.csv, transaksi.csv, invoice_lines.csv, arus_kas.csv) → Import. Kolom `id` jangan diisi, otomatis.
4. Ambil kunci: **Project Settings → API** → salin **Project URL** dan **anon public key**.

## B. Jalankan di Visual Studio Code
1. Install Node.js LTS (https://nodejs.org) dan VS Code.
2. Ekstrak zip, di VS Code: **File → Open Folder** → pilih folder `portofolio-excel`.
3. Buka terminal (**Terminal → New Terminal**), jalankan `npm install`.
4. Salin `.env.example` menjadi `.env.local`, isi dua nilai dari langkah A4.
5. Jalankan `npm run dev` → buka http://localhost:3000.
   (Tanpa `.env.local`, aplikasi tetap jalan memakai data di browser.)

## C. Hosting di Vercel
1. Buat akun di https://github.com, buat repository baru (mis. `portofolio-excel`).
2. Di terminal VS Code: `git init`, `git add .`, `git commit -m "first commit"`, `git branch -M main`,
   `git remote add origin https://github.com/USERNAME/portofolio-excel.git`, `git push -u origin main`.
3. Buka https://vercel.com → login dengan GitHub → **Add New → Project** → Import repository tadi.
4. Di **Environment Variables** tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nilai sama seperti `.env.local`).
5. Klik **Deploy**. Hasilnya link `https://nama-project.vercel.app` untuk dicantumkan di portofolio.
