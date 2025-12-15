import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My To-Do List - Windows XP | Organize Your Tasks with Nostalgic Style",
  description: "A nostalgic Windows XP-styled todo list application. Stay organized, get things done, and relive the classic Windows experience. Your tasks, your way - with that familiar XP charm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
