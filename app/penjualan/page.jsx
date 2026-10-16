'use client';
import { useState } from 'react';
import { Search, ShieldCheck, Calculator, Trash2 } from 'lucide-react';
import Hero from '@/components/Hero';
import ExportBar from '@/components/ExportBar';
import { exportPenjualan } from '@/lib/exportXlsx';
import { useTable } from '@/lib/useTable';
import { rp } from '@/lib/format';

const NF = 'Kode Tidak Ditemukan';

export default function Penjualan() {
  const barang = useTable('barang');
  const trx = useTable('transaksi');
  const [b, setB] = useState({ kode: '', nama: '', harga: '', stok: '' });
  const [t, setT] = useState({ kode: '', jumlah: '' });

  // Setara VLOOKUP + IFERROR
  const lookup = (kode) => barang.rows.find((r) => r.kode.toUpperCase() === kode.trim().toUpperCase());
  const rows = trx.rows.map((r) => {
    const m = lookup(r.kode);
    return { ...r, m, total: m ? m.harga * r.jumlah : null };
  });
  const grand = rows.reduce((s, r) => s + (r.total || 0), 0);

  const addBarang = async (e) => {
    e.preventDefault();
    if (!b.kode || !b.nama) return;
    await barang.add({ kode: b.kode.trim().toUpperCase(), nama: b.nama, harga: +b.harga || 0, stok: +b.stok || 0 });
    setB({ kode: '', nama: '', harga: '', stok: '' });
  };
  const addTrx = async (e) => {
    e.preventDefault();
    if (!t.kode || !t.jumlah) return;
    await trx.add({ kode: t.kode.trim().toUpperCase(), jumlah: +t.jumlah });
    setT({ kode: '', jumlah: '' });
  };

  return (
    <section id="penjualan" className="page">
      <div className="layout">
        <Hero
          lines={[{ t: 'Simulasi Data Penjualan' }, { t: 'Perusahaan' }, { t: 'di Microsoft Excel', accent: true }]}
          desc="Mengolah data transaksi penjualan dengan menghubungkan kode barang ke tabel master untuk menampilkan nama barang, harga satuan, dan total penjualan secara otomatis."
          features={[
            { icon: <Search size={22} />, title: 'VLOOKUP', text: 'Mengambil data dari tabel master.' },
            { icon: <ShieldCheck size={22} />, title: 'IFERROR', text: 'Menangani kode yang tidak ditemukan.' },
            { icon: <Calculator size={22} />, title: 'Perhitungan Total Penjualan', text: 'Menghitung otomatis per transaksi.' },
          ]}
          outcome="Data transaksi tersusun rapi, informasi barang terisi otomatis, dan kode yang tidak ditemukan ditandai dengan pesan yang jelas."
        />

        <div>
        <ExportBar onExcel={() => exportPenjualan(barang.rows, rows)} />
        <section className="card">
          {(barang.err || trx.err) && <p className="alert">{barang.err || trx.err}</p>}

          <h2 className="bar-title">Data Barang</h2>
          <div className="scroll">
            <table>
              <thead><tr><th>Kode Barang</th><th>Nama Barang</th><th>Harga Satuan</th><th>Stok</th><th className="no-print" /></tr></thead>
              <tbody>
                {barang.rows.map((r) => (
                  <tr key={r.kode}>
                    <td className="c">{r.kode}</td><td>{r.nama}</td>
                    <td className="r">{rp(r.harga, 2)}</td><td className="c">{r.stok}</td>
                    <td className="c"><button className="icon" aria-label={`Hapus ${r.kode}`} onClick={() => barang.del(r.kode)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form className="addrow" onSubmit={addBarang}>
            <input placeholder="Kode" value={b.kode} onChange={(e) => setB({ ...b, kode: e.target.value })} />
            <input placeholder="Nama barang" value={b.nama} onChange={(e) => setB({ ...b, nama: e.target.value })} />
            <input placeholder="Harga" type="number" value={b.harga} onChange={(e) => setB({ ...b, harga: e.target.value })} />
            <input placeholder="Stok" type="number" value={b.stok} onChange={(e) => setB({ ...b, stok: e.target.value })} />
            <button>Tambah barang</button>
          </form>

          <h2 className="bar-title">Data Transaksi</h2>
          <div className="scroll">
            <table>
              <thead><tr><th>Kode Barang</th><th>Jumlah</th><th>Nama Barang</th><th>Harga Satuan</th><th>Total Penjualan</th><th className="no-print" /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={r.m ? '' : 'miss'}>
                    <td className="c">{r.kode}</td><td className="c">{r.jumlah}</td>
                    <td>{r.m ? r.m.nama : NF}</td>
                    <td className="r">{r.m ? rp(r.m.harga, 2) : NF}</td>
                    <td className="r">{r.m ? rp(r.total, 2) : NF}</td>
                    <td className="c"><button className="icon" aria-label="Hapus transaksi" onClick={() => trx.del(r.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form className="addrow" onSubmit={addTrx}>
            <input placeholder="Kode barang" value={t.kode} onChange={(e) => setT({ ...t, kode: e.target.value })} />
            <input placeholder="Jumlah" type="number" value={t.jumlah} onChange={(e) => setT({ ...t, jumlah: e.target.value })} />
            <button>Tambah transaksi</button>
          </form>

          <div className="grand"><span>Total Penjualan</span><b>{rp(grand, 2)}</b></div>
        </section>
        </div>
      </div>
    </section>
  );
}