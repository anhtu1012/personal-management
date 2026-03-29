import { Geist_Mono, Oxanium, Noto_Sans } from "next/font/google"

import "./globals.css"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"
import { RegisterSW } from "./register-sw"
import { NotificationManager } from "./notification-manager"

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = JSON.parse(localStorage.getItem('persist:theme') || '{}').theme;
                  if (theme) {
                    theme = JSON.parse(theme);
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <RegisterSW />
          <NotificationManager />
          {children}
        </Providers>
      </body>
    </html>
  )
}
