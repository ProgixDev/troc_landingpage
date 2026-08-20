import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import SmoothScroll from "@/components/SmoothScroll";
import SplashScreen from "@/components/SplashScreen";

// next/font self-hosts both faces at build time: no render-blocking request to
// Google, and no FOUT. They're exposed as the CSS vars the tokens reference.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://troctravail.fr"),
  title: {
    default: "Troc Travail — Échangez vos compétences, objets et services",
    template: "%s · Troc Travail",
  },
  description:
    "Troc Travail est l'application de troc entre particuliers et professionnels : échangez une prestation, un objet ou une compensation, près de chez vous.",
  keywords: [
    "troc",
    "échange de services",
    "troc de compétences",
    "barter",
    "entraide",
    "application mobile",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Troc Travail",
    title: "Troc Travail — Échangez ce que vous savez faire",
    description:
      "Prestations, objets ou compensation : publiez ce que vous proposez et trouvez la contrepartie qui vous manque.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troc Travail",
    description: "Le troc de compétences, d'objets et de services.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${display.variable} ${body.variable}`}>
      <body>
        <LocaleProvider>
          <SplashScreen />
          <SmoothScroll />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
