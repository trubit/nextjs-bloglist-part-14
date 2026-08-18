import type { Metadata } from "next";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Bloglist",
  description: "Blog application with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ padding: "0 1rem" }}>{children}</main>
      </body>
    </html>
  );
}
