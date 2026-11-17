import type { Metadata, Viewport } from "next";
import { Inter, Jost } from "next/font/google";
import { siteConfig } from "@/config/site";
import { AnalyticsBootstrap } from "@/components/analytics/AnalyticsBootstrap";
import { CookieNotice } from "@/components/layout/CookieNotice";
import "./globals.css";

const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

const title = "Contabilidade para Médicos | Fechou Tributo";
const description =
  "Tenha uma contabilidade especializada para médicos. Planejamento tributário, abertura de CNPJ e assessoria contábil estratégica.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  applicationName: siteConfig.name,
  keywords: [
    "contabilidade para médicos",
    "contador para médicos",
    "abrir CNPJ médico",
    "planejamento tributário para médicos",
    "redução de impostos para médicos",
    "contabilidade especializada na saúde",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#001635",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${inter.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-ink"
        >
          Pular para o conteúdo
        </a>
        {children}
        <CookieNotice />
        <AnalyticsBootstrap />
      </body>
    </html>
  );
}
