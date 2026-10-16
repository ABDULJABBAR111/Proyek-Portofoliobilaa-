'use client';
import { useState } from 'react';
import { Sigma, ClipboardList, Wallet, Trash2 } from 'lucide-react';
import Hero from '@/components/Hero';
import ExportBar from '@/components/ExportBar';
import { useTable } from '@/lib/useTable';
import { rp, tglId } from '@/lib/format';
import { exportArusKas } from '@/lib/exportXlsx';

const SALDO_AWAL = 5000000;

export default function ArusKas() {
  const kas = useTable('arus_kas');
  const [f, setF] = useState({ tanggal: '', keterangan: '', kategori: '', arus: 'Masuk', nominal: '' });

  // Setara SUMIF
  const sumif = (k) => kas.rows.filter((r) => r.arus === k).reduce((s, r) => s + r.nominal, 0);
  const masuk = sumif('Masuk');
  const keluar = sumif('Keluar');
  const akhir = SALDO_AWAL + masuk - keluar;

  const add = async (e) => {
    e.preventDefault();
    if (!f.tanggal || !f.keterangan || !f.nominal) return;
    await kas.add({ ...f, nominal: +f.nominal });
    setF({ ...f, keterangan: '', kategori: '', nominal: '' });
  };

  return (
    <section id="arus-kas" className="page">
      <div className="layout">
        <Hero
          lines={[{ t: 'Simulasi Data' }, { t: 'Transaksi Keuangan' }, { t: 'di Microsoft Excel', accent: true }]}
          desc="Mencatat transaksi kas PT. Maju Bersama periode 1-10 September 2026, lalu merangkum kas masuk, kas keluar, dan saldo akhir secara otomatis."
          features={[
            { icon: <Sigma size={22} />, title: 'SUMIF', text: 'Menjumlahkan nominal berdasarkan arus kas.' },
            { icon: <ClipboardList size={22} />, title: 'Pencatatan Transaksi', text: 'Tanggal, keterangan, dan kategori.' },
            { icon: <Wallet size={22} />, title: 'Laporan Arus Kas', text: 'Saldo awal sampai saldo akhir.' },
          ]}
          outcome="Laporan arus kas tersusun otomatis: saldo awal, kas masuk, kas keluar, dan saldo akhir."
        />

        <div>
          <ExportBar onExcel={() => exportArusKas(kas.rows, SALDO_AWAL)} />
          <section className="card">
            {kas.err && <p className="alert">{kas.err}</p>}
            <h2 className="bar-title wide">Simulasi Data Transaksi Keuangan</h2>
            <div className="company"><b>PT. MAJU BERSAMA</b><span>Periode 1-10 September 2026</span></div>
            <p className="saldo-awal">Saldo Kas Perusahaan Pada Awal Periode {rp(SALDO_AWAL).replace('Rp', 'Rp ')}</p>

            <div className="scroll">
              <table>
                <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Arus Kas</th><th>Nominal</th><th className="no-print" /></tr></thead>
                <tbody>
                  {kas.rows.map((r) => (
                    <tr key={r.id}>
                      <td className="c">{tglId(r.tanggal)}</td><td>{r.keterangan}</td><td>{r.kategori}</td>
                      <td className="c">{r.arus}</td><td className="r">{rp(r.nominal, 2)}</td>
                      <td className="c"><button className="icon" aria-label={`Hapus ${r.keterangan}`} onClick={() => kas.del(r.id)}><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form className="addrow" onSubmit={add}>
              <input type="date" value={f.tanggal} onChange={(e) => setF({ ...f, tanggal: e.target.value })} aria-label="Tanggal" />
              <input placeholder="Keterangan" value={f.keterangan} onChange={(e) => setF({ ...f, keterangan: e.target.value })} />
              <input placeholder="Kategori" value={f.kategori} onChange={(e) => setF({ ...f, kategori: e.target.value })} />
              <select value={f.arus} onChange={(e) => setF({ ...f, arus: e.target.value })} aria-label="Arus kas">
                <option>Masuk</option><option>Keluar</option>
              </select>
              <input type="number" placeholder="Nominal" value={f.nominal} onChange={(e) => setF({ ...f, nominal: e.target.value })} />
              <button>Tambah transaksi</button>
            </form>

            <div className="chip">Rumus: SUMIF</div>
            <h3 className="lap">Laporan Arus Kas<br />PT. MAJU BERSAMA<br />Periode 1-10 September 2026</h3>
            <table className="sum2">
              <tbody>
                <tr><td>Saldo Awal</td><td className="r">{rp(SALDO_AWAL, 2)}</td></tr>
                <tr><td>Kas Masuk</td><td className="r">{rp(masuk, 2)}</td></tr>
                <tr><td>Kas Keluar</td><td className="r">{rp(keluar, 2)}</td></tr>
                <tr className="tot"><td>Saldo Akhir</td><td className="r">{rp(akhir, 2)}</td></tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </section>
  );
}