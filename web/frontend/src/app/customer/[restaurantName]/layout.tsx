import { Metadata } from "next";
import LayoutComponent from "./LayoutComponent";

export async function generateMetadata(
  { params }: { params: { restaurantName: string } },
): Promise<Metadata> {
  const restaurantName = decodeURIComponent(params.restaurantName);
  return {
    title: `Welcome to ${restaurantName}`,
    description: `This is the menu of ${restaurantName}`,
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantName: string };
}) {
  return (
    <>
      <LayoutComponent />
      {children}
    </>
  );
}
