import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'URU Furniture — Designer Sofas & Custom Living',
  description: 'URU Furniture — designer sofas, custom configurations and tactile fabrics. Explore the Cloud Collection, view custom projects, and connect directly on WhatsApp.',
  openGraph: {
    title: 'URU Furniture — Designer Sofas & Custom Living',
    description: 'URU Furniture — designer sofas, custom configurations and tactile fabrics. Explore the Cloud Collection, view custom projects, and connect directly on WhatsApp.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URU Furniture — Designer Sofas & Custom Living',
    description: 'URU Furniture — designer sofas, custom configurations and tactile fabrics. Explore the Cloud Collection, view custom projects, and connect directly on WhatsApp.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
