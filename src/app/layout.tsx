import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="fantasy" lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
