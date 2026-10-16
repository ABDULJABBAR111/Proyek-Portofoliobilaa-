import ArusKas from './arus-kas/page';
import Penjualan from './penjualan/page';
import Invoice from './invoice/page';

export default function Home() {
  return (
    <main>
      <ArusKas />
      <Penjualan />
      <Invoice />
    </main>
  );
}