'use client';
import { useCallback, useEffect, useState } from 'react';
import { list, insert, remove } from './store';

export function useTable(t) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const load = useCallback(async () => {
    try { setRows(await list(t)); setErr(''); } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [t]);
  useEffect(() => { load(); }, [load]);
  const add = async (r) => { try { await insert(t, r); await load(); } catch (e) { setErr(e.message); } };
  const del = async (k) => { try { await remove(t, k); await load(); } catch (e) { setErr(e.message); } };
  return { rows, loading, err, add, del };
}
