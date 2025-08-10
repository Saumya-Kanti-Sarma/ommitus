import "../../app/globals.css";

export const metadata = {
  title: 'Get Started With Ommitus',
  description: 'Authentication routes od Ommitus',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
