import type { Metadata } from 'next';
import { SmoothScroll } from '@/components/smooth-scroll/smooth-scroll';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Floresta Viva — Uma experiência digital sobre a Amazônia',
  description:
    'Uma travessia cinematográfica por água, mata, onça e arara no coração do bioma Amazônia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
