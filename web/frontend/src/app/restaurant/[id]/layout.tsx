import Navbar from "@/components/UI/Restaurant/Navbar";

const NEXT_PUBLIC_DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL
export const metadata = {
  title: 'Ommitus Restuarant Portal',
  description: 'This is the restaurant portal used by restaurant owners to Create, Update and Delete Restaurant menu',
  openGraph: {
    images: [
      {
        url: `${NEXT_PUBLIC_DOMAIN_URL}/ommitus-png.png`,
        width: 1200,
        height: 630,
      },
    ]
  },
  icons: {
    icon: "/ommitus-png.png",
  },

}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
