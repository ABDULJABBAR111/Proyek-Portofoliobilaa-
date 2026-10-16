import { createClient } from '@supabase/supabase-js';
import seed from './seed.json';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const sb = url && key ? createClient(url, key) : null;
export const mode = sb ? 'supabase' : 'lokal (localStorage)';

const PK = { barang: 'kode', transaksi: 'id', invoice_lines: 'id', arus_kas: 'id' };
const SEEDS = Object.fromEntries(
  Object.entries(seed).map(([t, rows]) => [t, PK[t] === 'id' ? rows.map((r, i) => ({ id: i + 1, ...r })) : rows])
);

const readLocal = (t) => {
  const raw = localStorage.getItem('db2_' + t);
  if (raw) return JSON.parse(raw);
  localStorage.setItem('db2_' + t, JSON.stringify(SEEDS[t]));
  return SEEDS[t];
};
const writeLocal = (t, rows) => localStorage.setItem('db2_' + t, JSON.stringify(rows));

export async function list(t) {
  if (sb) {
    const { data, error } = await sb.from(t).select('*').order(PK[t]);
    if (error) throw error;
    return data;
  }
  return readLocal(t);
}
export async function insert(t, row) {
  if (sb) {
    const { error } = await sb.from(t).insert(row);
    if (error) throw error;
    return;
  }
  const rows = readLocal(t);
  writeLocal(t, [...rows, PK[t] === 'id' ? { id: Date.now(), ...row } : row]);
}
export async function remove(t, k) {
  if (sb) {
    const { error } = await sb.from(t).delete().eq(PK[t], k);
    if (error) throw error;
    return;
  }
  writeLocal(t, readLocal(t).filter((r) => r[PK[t]] !== k));
}
