"use client"

import { motion } from "framer-motion"
import { User, Trash } from "@phosphor-icons/react"
import { GlassCard } from "./glass-card"
import type { Member, Balance } from "@/types"
import { cn, formatMoney } from "@/lib/utils"

interface MemberCardProps {
  member: Member
  balance: Balance
  onClick: () => void
  onDelete: () => void
}

export function MemberCard({ member, balance, onClick, onDelete }: MemberCardProps) {
  const isPositive = balance.balance >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <GlassCard
        className="relative overflow-hidden p-3 transition-all duration-200 active:scale-[0.98] sm:p-4"
        glow="none"
      >
        <button
          onClick={onClick}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl"
                style={{ backgroundColor: member.color }}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="size-full rounded-xl object-cover sm:rounded-2xl"
                  />
                ) : (
                  <User size={20} weight="bold" className="text-white sm:hidden" />
                )}
                {member.avatar ? null : (
                  <User size={24} weight="bold" className="hidden text-white sm:block" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base">
                    {member.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    className="shrink-0 rounded-lg bg-rose-500/10 p-1 text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-400"
                  >
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  Đã trả: {formatMoney(balance.totalPaid)}đ
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  "text-base font-bold sm:text-lg",
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {isPositive ? "+" : ""}
                {formatMoney(Math.abs(balance.balance))}đ
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                {isPositive ? "Được nợ" : "Đang nợ"}
              </span>
            </div>
          </div>
        </button>
      </GlassCard>
    </motion.div>
  )
}
