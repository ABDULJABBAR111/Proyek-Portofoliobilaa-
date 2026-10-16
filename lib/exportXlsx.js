import { terbilang } from './format';

const RP = '"Rp"#,##0';
const RP2 = '"Rp"#,##0.00';
const n = (v, f, z = RP) => ({ t: 'n', v, z, ...(f ? { f } : {}) });
const s = (v, f) => ({ t: 's', v, ...(f ? { f } : {}) });
const vl = (v, f, z) => (typeof v === 'number' ? n(v, f, z) : s(v, f));
const tglId = (iso) => iso.split('-').reverse().join('/');

async function save(name, sheets) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  sheets.forEach(([title, aoa, widths]) => {
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = widths.map((wch) => ({ wch }));
    XLSX.utils.book_append_sheet(wb, ws, title);
  });
  XLSX.writeFile(wb, name);
}

export function exportArusKas(rows, saldoAwal) {
  const aoa = [
    ['SIMULASI DATA TRANSAKSI KEUANGAN'], ['PT. MAJU BERSAMA'], ['Periode 1-10 September 2026'],
    ['Saldo Kas Perusahaan Pada Awal Periode', '', '', '', n(saldoAwal, null, RP2)], [],
    ['Tanggal', 'Keterangan', 'Kategori', 'Arus Kas', 'Nominal'],
    ...rows.map((r) => [tglId(r.tanggal), r.keterangan, r.kategori, r.arus, n(r.nominal, null, RP2)]),
  ];
  const last = aoa.length; // baris Excel terakhir data
  const sum = (k) => rows.filter((r) => r.arus === k).reduce((x, r) => x + r.nominal, 0);
  const masuk = sum('Masuk'), keluar = sum('Keluar');
  aoa.push([], ['Rumus: SUMIF'], ['Laporan Arus Kas']);
  const b = aoa.length + 1; // baris Saldo Awal
  aoa.push(
    ['Saldo Awal', '', '', '', n(saldoAwal, 'E4', RP2)],
    ['Kas Masuk', '', '', '', n(masuk, `SUMIF(D7:D${last},"Masuk",E7:E${last})`, RP2)],
    ['Kas Keluar', '', '', '', n(keluar, `SUMIF(D7:D${last},"Keluar",E7:E${last})`, RP2)],
    ['Saldo Akhir', '', '', '', n(saldoAwal + masuk - keluar, `E${b}+E${b + 1}-E${b + 2}`, RP2)]
  );
  return save('Laporan-Arus-Kas.xlsx', [['Laporan Arus Kas', aoa, [14, 34, 18, 12, 20]]]);
}

export function exportPenjualan(barang, trx) {
  const NF = 'Kode Tidak Ditemukan';
  const rng = `'Data Barang'!$A$2:$D$${barang.length + 1}`;
  const vlk = (x, c) => `IFERROR(VLOOKUP(A${x},${rng},${c},FALSE),"${NF}")`;
  const b = [['Kode Barang', 'Nama Barang', 'Harga Satuan', 'Stok'],
    ...barang.map((r) => [r.kode, r.nama, n(r.harga, null, RP2), r.stok])];
  const total = trx.reduce((x, r) => x + (r.total || 0), 0);
  const t = [['Kode Barang', 'Jumlah', 'Nama Barang', 'Harga Satuan', 'Total Penjualan'],
    ...trx.map((r, i) => {
      const x = i + 2;
      return [r.kode, r.jumlah, vl(r.m ? r.m.nama : NF, vlk(x, 2)),
        vl(r.m ? r.m.harga : NF, vlk(x, 3), RP2),
        vl(r.m ? r.total : NF, `IFERROR(B${x}*D${x},"${NF}")`, RP2)];
    }),
    [], ['Total Penjualan', '', '', '', n(total, `SUM(E2:E${trx.length + 1})`, RP2)]];
  return save('Simulasi-Data-Penjualan.xlsx', [
    ['Data Barang', b, [14, 24, 18, 8]], ['Data Transaksi', t, [14, 10, 24, 18, 24]]]);
}

export function exportInvoice({ no, tgl, nama, items, all }) {
  const sub = items.reduce((x, r) => x + r.qty * r.harga, 0);
  const pajak = Math.round(sub * 0.11);
  const total = sub + pajak;
  const aoa = [['INVOICE'], [], ['No. INV', no], ['Tanggal', tgl], [],
    ['No.', 'Nama Barang', 'Qty', 'Harga Satuan', 'Total'],
    ...items.map((r, i) => [i + 1, r.nama, r.qty, n(r.harga), n(r.qty * r.harga, `C${7 + i}*D${7 + i}`)])];
  const last = aoa.length;
  aoa.push([]);
  const r0 = aoa.length + 1; // baris Subtotal
  aoa.push(
    ['', '', '', 'Subtotal', n(sub, `SUM(E7:E${last})`)],
    ['', '', '', 'Pajak 11%', n(pajak, `ROUND(E${r0}*0.11,0)`)],
    ['', '', '', 'Total Bayar', n(total, `E${r0}+E${r0 + 1}`)],
    [], ['Terbilang :'], [terbilang(total)], [], ['Hormat Kami,'], [], [nama || 'Nama']);
  const tabel = [['No. INV', 'Nama Barang', 'Qty', 'Harga Satuan', 'Total'],
    ...all.map((r, i) => [r.no_inv, r.nama, r.qty, n(r.harga), n(r.qty * r.harga, `C${i + 2}*D${i + 2}`)])];
  return save(`Invoice-${no}.xlsx`, [
    ['INVOICE', aoa, [10, 26, 8, 16, 16]], ['TABEL INVOICE', tabel, [10, 26, 8, 16, 16]]]);
}
