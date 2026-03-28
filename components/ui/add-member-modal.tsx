"use client"

import { useState } from "react"
import { X, User } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (member: { name: string; color: string }) => void
}

export function AddMemberModal({ isOpen, onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")

  const colors = [
    { value: "#3b82f6", label: "Xanh dương" },
    { value: "#8b5cf6", label: "Tím" },
    { value: "#ec4899", label: "Hồng" },
    { value: "#f59e0b", label: "Vàng" },
    { value: "#10b981", label: "Xanh lá" },
    { value: "#ef4444", label: "Đỏ" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#f97316", label: "Cam" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAdd({
      name: name.trim(),
      color: selectedColor,
    })

    // Reset form
    setName("")
    setSelectedColor("#3b82f6")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-101 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 sm:max-w-lg"
          >
            <GlassCard variant="strong" className="p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                  Thêm thành viên
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-slate-200 active:scale-95 dark:hover:bg-slate-700"
                >
                  <X size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="member-name" className="mb-1.5 block text-sm font-medium dark:text-slate-300">
                    Tên thành viên
                  </Label>
                  <Input
                    id="member-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên..."
                    className="h-11 rounded-xl border-slate-300/60 bg-white/75 text-base dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium dark:text-slate-300">
                    Chọn màu đại diện
                  </Label>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                          selectedColor === color.value
                            ? "border-slate-400 bg-white shadow-md ring-2 ring-slate-300/50 dark:border-slate-500 dark:bg-slate-800 dark:ring-slate-500/50"
                            : "border-slate-300/50 bg-white/70 hover:bg-white dark:border-slate-600/50 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                        )}
                      >
                        <div
                          className="flex size-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: color.value }}
                        >
                          <User size={20} weight="bold" className="text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-300/60 bg-white/78 px-4 py-3 text-sm font-semibold text-slate-700 transition-transform active:scale-95 dark:border-slate-600/60 dark:bg-slate-800/78 dark:text-slate-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-transform active:scale-95 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
