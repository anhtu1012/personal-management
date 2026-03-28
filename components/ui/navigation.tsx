"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, Calendar, User, Plus, Gear } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { useState } from "react"
import { QuickAddModal } from "./quick-add-modal"

export function Navigation() {
  const pathname = usePathname()
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const links = [
    { href: "/", icon: House, label: "Home", type: "link" },
    { href: "/calendar", icon: Calendar, label: "Lịch", type: "link" },
    { href: "#", icon: Plus, label: "Thêm", type: "button" },
    { href: "/profile", icon: User, label: "Cá nhân", type: "link" },
    { href: "/settings", icon: Gear, label: "Cài đặt", type: "link" },
  ]

  return (
    <>
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 overflow-x-clip px-2 sm:px-0">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto mb-3 w-full rounded-[1.9rem] border border-slate-300/60 bg-white/70 p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.18)] backdrop-blur-3xl dark:border-slate-600/60 dark:bg-slate-800/80 dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] sm:mb-4 sm:w-[calc(100%-1.5rem)]">
            <div className="grid grid-cols-5 items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href && link.type === "link"
                const Icon = link.icon

                if (link.type === "button") {
                  return (
                    <motion.button
                      key={link.label}
                      onClick={() => setShowQuickAdd(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 transition-colors sm:min-h-[3.6rem] sm:gap-1 sm:px-4"
                    >
                      <div className="absolute inset-0 rounded-2xl border border-sky-400/50 bg-gradient-to-br from-white/90 via-sky-50/60 to-cyan-50/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_22px_rgba(56,189,248,0.2)] backdrop-blur-xl dark:border-sky-500/40 dark:from-slate-700/80 dark:via-sky-900/40 dark:to-cyan-900/30 dark:shadow-[inset_0_1px_0_rgba(148,163,184,0.15),0_8px_22px_rgba(56,189,248,0.25)]" />
                      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg dark:from-sky-600 dark:to-cyan-600 sm:h-9 sm:w-9">
                        <Icon
                          size={20}
                          weight="bold"
                          className="text-white sm:hidden"
                        />
                        <Icon
                          size={22}
                          weight="bold"
                          className="hidden text-white sm:block"
                        />
                      </div>
                      <span className="relative z-10 text-[10px] font-bold text-sky-700 dark:text-sky-300 sm:text-xs">
                        {link.label}
                      </span>
                    </motion.button>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 transition-colors sm:min-h-[3.6rem] sm:gap-1 sm:px-4"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-2xl border border-slate-300/70 bg-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_22px_rgba(59,130,246,0.2)] dark:border-slate-600/70 dark:bg-slate-700/90 dark:shadow-[inset_0_1px_0_rgba(148,163,184,0.15),0_8px_22px_rgba(59,130,246,0.3)]"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <Icon
                      size={20}
                      weight={isActive ? "fill" : "regular"}
                      className={`relative z-10 sm:hidden ${isActive ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                    />
                    <Icon
                      size={22}
                      weight={isActive ? "fill" : "regular"}
                      className={`relative z-10 hidden sm:block ${isActive ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                    />
                    <span
                      className={`relative z-10 text-[10px] font-semibold sm:text-xs ${isActive ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
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

      <QuickAddModal 
        isOpen={showQuickAdd} 
        onClose={() => setShowQuickAdd(false)}
      />
    </>
  )
}
