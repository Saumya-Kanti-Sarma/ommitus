import CustomerNavbar from "@/components/UI/Customer/Navbar.customer.component";
import { Metadata } from "next";

export async function generateMetadata(
): Promise<Metadata> {
  return {
    title: `Welcome to our digital menu`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <CustomerNavbar />
      {children}
    </>
  );
}
