import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { restaurantName: string } },
): Promise<Metadata> {
  const restaurantName = decodeURIComponent(params.restaurantName || "");
  return {
    title: `Welcome to ${restaurantName}`,
    description: `This is the menu of ${restaurantName}`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}