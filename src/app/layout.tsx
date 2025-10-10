import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Clínica BemViver — Agende sua consulta',
  description: 'Landing page moderna com agendamento online e confirmação por WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div id="top" />
  <Header />
  {children}
  <Footer />
      </body>
    </html>
  );
}
