import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { getOrganizationSchema } from '@/lib/services/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://amigosfashionstop.com'),
  title: "Amigos Fashionstop | Women's Ethnic Wear, Kurti Sets & Handcrafted Fashion",
  description: "Explore curated women's ethnic wear, kurti sets, long kurtis, and contemporary Indian styles from Amigos Fashionstop. Shop online, chat on WhatsApp, or visit our Titwala store.",
  keywords: [
    "Amigos Fashionstop",
    "Kurti Sets Titwala",
    "Women ethnic wear Maharashtra",
    "Pure Cotton Kurtis",
    "Wholesale Kurtis Titwala",
    "Designer ethnic wear",
    "Amigo's Fashion Stop"
  ],
  authors: [{ name: "Amigos Fashionstop" }],
  openGraph: {
    title: "Amigos Fashionstop | Our Passion, Your Fashion",
    description: "Women's Ethnic Wear & Kurti Sets • Design • Wholesale • Retail. Flagship store in Titwala, Maharashtra.",
    url: "https://amigosfashionstop.com",
    siteName: "Amigos Fashionstop",
    images: [
      {
        url: "/images/brand/logo.png",
        width: 800,
        height: 800,
        alt: "Amigos Fashion Stop Crest Logo"
      }
    ],
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = getOrganizationSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans bg-white text-black">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <CartDrawer />
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
