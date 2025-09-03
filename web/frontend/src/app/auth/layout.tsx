import "../../app/globals.css";

export const metadata = {
  title: 'Get Started With Ommitus',
  description: 'Authentication routes of Ommitus',
  icons: "/logo/blue-logo.svg"
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
