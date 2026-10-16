export const rp = (n, d = 0) =>
  'Rp' + Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

const sat = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
const rest = (n) => (n ? ' ' + say(n) : '');
function say(n) {
  if (n < 12) return sat[n];
  if (n < 20) return say(n - 10) + ' belas';
  if (n < 100) return say(Math.floor(n / 10)) + ' puluh' + rest(n % 10);
  if (n < 200) return 'seratus' + rest(n - 100);
  if (n < 1000) return say(Math.floor(n / 100)) + ' ratus' + rest(n % 100);
  if (n < 2000) return 'seribu' + rest(n - 1000);
  if (n < 1e6) return say(Math.floor(n / 1e3)) + ' ribu' + rest(n % 1e3);
  if (n < 1e9) return say(Math.floor(n / 1e6)) + ' juta' + rest(n % 1e6);
  if (n < 1e12) return say(Math.floor(n / 1e9)) + ' miliar' + rest(n % 1e9);
  return say(Math.floor(n / 1e12)) + ' triliun' + rest(n % 1e12);
}
export function terbilang(n) {
  n = Math.floor(n);
  const s = n === 0 ? 'nol' : say(n);
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
export const tglId = (iso) => iso.split('-').reverse().join('/');
