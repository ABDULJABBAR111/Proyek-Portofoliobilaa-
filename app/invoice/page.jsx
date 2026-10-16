'use client';
import { useState } from 'react';
import { Calculator, Database, FileText, Trash2 } from 'lucide-react';
import Hero from '@/components/Hero';
import ExportBar from '@/components/ExportBar';
import { useTable } from '@/lib/useTable';
import { rp, terbilang } from '@/lib/format';
import { exportInvoice } from '@/lib/exportXlsx';

const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export default function Invoice() {
  const lines = useTable('invoice_lines'); // = TABEL INVOICE di Excel
  const [no, setNo] = useState(null);
  const [tgl, setTgl] = useState(today());
  const [nama, setNama] = useState('');
  const [f, setF] = useState({ no_inv: '', nama: '', qty: '', harga: '' });

  const nos = [...new Set(lines.rows.map((r) => r.no_inv))].sort((a, b) => a - b);
  const cur = nos.includes(no) ? no : nos[0];
  // Setara VLOOKUP berdasarkan No. INV
  const items = lines.rows.filter((r) => r.no_inv === cur);
  const subtotal = items.reduce((s, r) => s + r.qty * r.harga, 0);
  const pajak = Math.round(subtotal * 0.11);
  const total = subtotal + pajak;

  const add = async (e) => {
    e.preventDefault();
    if (!f.no_inv || !f.nama || !f.qty || !f.harga) return;
    await lines.add({ no_inv: +f.no_inv, nama: f.nama, qty: +f.qty, harga: +f.harga });
    setF({ no_inv: f.no_inv, nama: '', qty: '', harga: '' });
  };

  return (
    <section id="invoice" className="page">
      <div className="layout">
        <Hero
          lines={[{ t: 'Simulasi Pembuatan' }, { t: 'Invoice di' }, { t: 'Microsoft Excel', accent: true }]}
          desc="Membuat invoice penjualan menggunakan Microsoft Excel dengan bantuan tabel data barang (master data) dan rumus untuk menghitung jumlah, subtotal, pajak, dan total bayar secara otomatis."
          features={[
            { icon: <Calculator size={22} />, title: 'Perhitungan Otomatis', text: '' },
            { icon: <Database size={22} />, title: 'Pengolahan Data', text: '' },
            { icon: <FileText size={22} />, title: 'Format Dokumen Keuangan', text: '' },
          ]}
          outcome="Invoice tersusun rapi dengan perhitungan subtotal, pajak, dan total bayar otomatis."
        />

        <div className="stack">
          <ExportBar onExcel={() => exportInvoice({ no: cur, tgl, nama, items, all: lines.rows })} />
          {lines.err && <p className="alert">{lines.err}</p>}
          <section className="card invoice">
            <header className="inv-head">
              <h2>INVOICE</h2>
              <dl>
                <dt>No. INV</dt>
                <dd>: <select value={cur ?? ''} onChange={(e) => setNo(+e.target.value)} aria-label="Nomor invoice">
                  {nos.map((x) => <option key={x} value={x}>{x}</option>)}
                </select></dd>
                <dt>Tanggal</dt>
                <dd>: <input value={tgl} onChange={(e) => setTgl(e.target.value)} aria-label="Tanggal" /></dd>
              </dl>
            </header>

            <div className="scroll">
              <table>
                <thead><tr><th>No.</th><th>Nama Barang</th><th>Qty</th><th>Harga Satuan</th><th>Total</th></tr></thead>
                <tbody>
                  {items.map((r, i) => (
                    <tr key={r.id}>
                      <td className="c">{i + 1}</td><td>{r.nama}</td><td className="c">{r.qty}</td>
                      <td className="r">{rp(r.harga)}</td><td className="r">{rp(r.qty * r.harga)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <table className="sum">
              <tbody>
                <tr><td>Subtotal</td><td className="r">{rp(subtotal)}</td></tr>
                <tr><td>Pajak 11%</td><td className="r">{rp(pajak)}</td></tr>
                <tr className="tot"><td>Total Bayar</td><td className="r">{rp(total)}</td></tr>
              </tbody>
            </table>

            <div className="terbilang"><i>Terbilang :</i><i>{terbilang(total)}</i></div>
            <div className="sign">
              <span>Hormat Kami,</span>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" aria-label="Nama penandatangan" />
            </div>
          </section>

          <section className="card master no-print">
            <h3 className="bar-title sm">Tabel Invoice / Data Penunjang</h3>
            <div className="scroll">
              <table>
                <thead><tr><th>No. INV</th><th>Nama Barang</th><th>Qty</th><th>Harga Satuan</th><th>Total</th><th /></tr></thead>
                <tbody>
                  {lines.rows.map((r) => (
                    <tr key={r.id}>
                      <td className="c">{r.no_inv}</td><td>{r.nama}</td><td className="c">{r.qty}</td>
                      <td className="r">{rp(r.harga)}</td><td className="r">{rp(r.qty * r.harga)}</td>
                      <td className="c"><button className="icon" aria-label={`Hapus ${r.nama}`} onClick={() => lines.del(r.id)}><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form className="addrow" onSubmit={add}>
              <input type="number" placeholder="No. INV" value={f.no_inv} onChange={(e) => setF({ ...f, no_inv: e.target.value })} />
              <input placeholder="Nama barang" value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} />
              <input type="number" placeholder="Qty" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} />
              <input type="number" placeholder="Harga satuan" value={f.harga} onChange={(e) => setF({ ...f, harga: e.target.value })} />
              <button>Tambah baris</button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}