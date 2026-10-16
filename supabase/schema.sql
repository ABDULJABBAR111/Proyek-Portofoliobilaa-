-- Jalankan di Supabase > SQL Editor (sekali saja)
create table if not exists barang (
  kode text primary key, nama text not null, harga bigint not null, stok int not null default 0);
create table if not exists transaksi (
  id bigint generated always as identity primary key, kode text not null, jumlah int not null);
create table if not exists invoice_lines (
  id bigint generated always as identity primary key,
  no_inv int not null, nama text not null, qty int not null, harga bigint not null);
create table if not exists arus_kas (
  id bigint generated always as identity primary key,
  tanggal date not null, keterangan text not null, kategori text not null,
  arus text not null check (arus in ('Masuk','Keluar')), nominal bigint not null);

-- Akses publik untuk demo portofolio. Untuk produksi ganti dengan policy berbasis login.
do $$
declare t text;
begin
  foreach t in array array['barang','transaksi','invoice_lines','arus_kas'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "demo_all" on %I', t);
    execute format('create policy "demo_all" on %I for all using (true) with check (true)', t);
  end loop;
end $$;
