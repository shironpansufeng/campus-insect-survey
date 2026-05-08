import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "校园昆虫调查",
  description: "学生上传校园昆虫观察记录，老师审核后公开展示。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main className="site-main">
            <div className="container">{children}</div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
