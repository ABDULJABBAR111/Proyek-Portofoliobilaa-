-- Data contoh (jalankan SETELAH schema.sql). Alternatif: import CSV di supabase/csv/

insert into barang (kode, nama, harga, stok) values
('BR001', 'Meja Kantor', 850000, 12),
('BR002', 'Kursi Kantor', 450000, 25),
('BR003', 'Printer', 1750000, 8),
('BR004', 'Kalkulator', 125000, 13),
('BR005', 'Mouse', 87000, 6),
('BR006', 'Mesin', 975000, 10),
('BR007', 'Printer Label', 1650000, 15),
('BR008', 'Timbangan Digital', 3250000, 9),
('BR009', 'Lemari Arsip', 2100000, 5),
('BR010', 'Buku Tulis', 9000, 25);

insert into transaksi (kode, jumlah) values
('BR004', 8),
('BR001', 3),
('BR006', 2),
('BR015', 2),
('BR008', 5);

insert into invoice_lines (no_inv, nama, qty, harga) values
(1, 'Cushion', 2, 82000),
(1, 'Lip Cream', 3, 53000),
(1, 'Lip Vinly', 5, 36500),
(2, 'Serum', 1, 76200),
(2, 'Hair Mask', 3, 87000),
(2, 'Clay Mask', 2, 67000),
(2, 'Eyeliner', 4, 59500),
(2, 'Lip blam', 10, 46900),
(3, 'Blush on', 9, 80000),
(3, 'Mascara', 2, 88400),
(4, 'Body Scrub', 3, 45000),
(4, 'Body serum', 7, 98000),
(4, 'Parfum', 3, 77800),
(4, 'Loose Powder', 1, 87000),
(4, 'Brush', 2, 65000);

insert into arus_kas (tanggal, keterangan, kategori, arus, nominal) values
('2026-09-01', 'Penerima Jasa', 'Pendapatan Jasa', 'Masuk', 2500000),
('2026-09-02', 'Penerima Pembayaran Pelanggan', 'Pendapatan Jasa', 'Masuk', 1500000),
('2026-09-03', 'Penerima Perlengkapan Kantor', 'Operasional', 'Keluar', 350000),
('2026-09-04', 'Penerimaan jasa proyek', 'Pendapatan Jasa', 'Masuk', 3000000),
('2026-09-05', 'Pembayaran Transportasi', 'Operasional', 'Keluar', 150000),
('2026-09-06', 'Pembayaran Gaji Staff', 'Gaji', 'Keluar', 1000000),
('2026-09-07', 'Penerimaan Pembayaran Pelanggan', 'Pendapatan Jasa', 'Masuk', 1800000),
('2026-09-08', 'Pembayaran Listrik dan internet', 'Utilitas', 'Keluar', 250000),
('2026-09-09', 'Pembelian Perlengkapan', 'Operasional', 'Keluar', 400000),
('2026-09-10', 'penerimaan jasa', 'Pendapatan Jasa', 'Masuk', 1200000);
