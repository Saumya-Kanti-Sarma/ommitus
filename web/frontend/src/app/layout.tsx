import { Toaster } from "react-hot-toast";
import "./globals.css";
import "./animation.css";

const NEXT_PUBLIC_DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL;
export const metadata = {
  title: "Welcome to Ommitus",
  description:
    "We provide the best digital QR-codes for your restaurants. Increasing the customer experience to next level.",
  keywords:
    "QR codes, digital menu, restaurant QR, contactless menu, online menu, digital restaurant tools",
  authors: [{ name: "Ommitus" }],

  openGraph: {
    title: "Hi, we are Ommitus and we are one of own kind",
    description:
      "We provide the best digital QR-codes for your restaurants. Increasing the customer experience to next level.",
    url: `${NEXT_PUBLIC_DOMAIN_URL}`,
    siteName: "Ommitus",
    images: [
      {
        url: `${NEXT_PUBLIC_DOMAIN_URL}/ommitus-png.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Hi, we are Ommitus and we are one of own kind",
    description:
      "We provide the best digital QR-codes for your restaurants.",
    images: [`${NEXT_PUBLIC_DOMAIN_URL}/ommitus-png.png`],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/ommitus-png.png",
  },

  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
