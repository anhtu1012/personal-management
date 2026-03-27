"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, Calendar, User } from "@phosphor-icons/react"
import { motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: House, label: "Home" },
    { href: "/calendar", icon: Calendar, label: "Lịch" },
    { href: "/profile", icon: User, label: "Cá nhân" },
  ]

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 overflow-x-clip px-2 sm:px-0">
      <div className="mx-auto w-full max-w-xl">
        <div className="mx-auto mb-3 w-full rounded-[1.9rem] border border-slate-300/60 bg-white/70 p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.18)] backdrop-blur-3xl sm:mb-4 sm:w-[calc(100%-1.5rem)]">
          <div className="grid grid-cols-3 items-center gap-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-colors sm:min-h-[3.6rem] sm:px-6"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl border border-slate-300/70 bg-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_22px_rgba(59,130,246,0.2)]"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <Icon
                    size={22}
                    weight={isActive ? "fill" : "regular"}
                    className={`relative z-10 ${isActive ? "text-slate-800" : "text-slate-500"}`}
                  />
                  <span
                    className={`relative z-10 text-[11px] font-semibold sm:text-xs ${isActive ? "text-slate-800" : "text-slate-500"}`}
                  >
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
