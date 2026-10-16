'use client';
import { FileSpreadsheet, Printer } from 'lucide-react';

export default function ExportBar({ onExcel }) {
  // Cetak hanya bagian (section) tempat tombol ini berada
  const cetak = (e) => {
    const sec = e.currentTarget.closest('.page');
    document.querySelectorAll('.page').forEach((x) => x.classList.remove('print-target'));
    if (sec) sec.classList.add('print-target');
    document.body.classList.add('printing');
    const selesai = () => {
      document.body.classList.remove('printing');
      window.removeEventListener('afterprint', selesai);
    };
    window.addEventListener('afterprint', selesai);
    window.print();
  };

  return (
    <div className="exportbar no-print">
      <button onClick={onExcel}><FileSpreadsheet size={16} /> Unduh Excel (.xlsx)</button>
      <button onClick={cetak}><Printer size={16} /> Cetak / Simpan PDF</button>
    </div>
  );
}