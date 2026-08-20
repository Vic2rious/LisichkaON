import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Board",
  description: "Lisichka attendance admin board",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
