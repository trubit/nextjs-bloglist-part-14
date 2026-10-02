import type { Metadata } from "next";
import "./globals.css";
import AuthBootstrap from "./components/AuthBootstrap";
import NavBar from "./components/NavBar";
import NotificationProvider from "./components/NotificationProvider";

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
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <NotificationProvider>
          <AuthBootstrap />
          <NavBar />
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
