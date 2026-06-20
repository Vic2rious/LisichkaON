import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In Lisichka",
  description: "Sign in and mark your attendance",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
