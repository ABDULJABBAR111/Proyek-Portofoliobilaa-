import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const font = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata = {
  title: 'Portofolio Finance Staff – Simulasi Excel',
  description: 'Simulasi data penjualan dan pembuatan invoice ala Microsoft Excel.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={font.className}>{children}</body>
    </html>
  );
}
