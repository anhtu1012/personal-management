import { Geist_Mono, Oxanium, Noto_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Quản Lý Lịch Trình",
  description: "Ứng dụng quản lý lịch trình cá nhân",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#f6f8fc",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lịch Trình",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable,
        notoSansHeading.variable
      )}
    >
      <head>
        <meta name="application-name" content="Quản Lý Lịch Trình" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lịch Trình" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <ThemeProvider defaultTheme="light" forcedTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
