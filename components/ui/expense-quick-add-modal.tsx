"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "@phosphor-icons/react"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import type { Member } from "@/types"
import { cn } from "@/lib/utils"

interface ExpenseQuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  members: Member[]
  ownerId: string // ID của người dùng app (owner)
  onAdd: (expense: {
    description: string
    amount: number
    paidBy: string
    splitBetween: string[]
    category?: 'food' | 'transport' | 'entertainment' | 'shopping' | 'other'
  }) => void
}

export function ExpenseQuickAddModal({
  isOpen,
  onClose,
  members,
  ownerId,
  onAdd,
}: ExpenseQuickAddModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [category, setCategory] = useState<'food' | 'transport' | 'entertainment' | 'shopping' | 'other'>('other')

  const quickAmounts = [10, 20, 30, 50, 100, 200, 500]

  const handleAmountChange = (value: string) => {
    // Chỉ cho phép số
    const numValue = value.replace(/[^0-9]/g, '')
    setAmount(numValue)
  }

  const handleQuickAmount = (value: number) => {
    setAmount((value * 1000).toString())
  }

  const getFinalAmount = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0
    // Nếu số nhỏ hơn 1000, nhân với 1000
    return numAmount < 1000 ? numAmount * 1000 : numAmount
  }

  const categories = [
    { value: "food", label: "Ăn uống", color: "bg-orange-500" },
    { value: "transport", label: "Di chuyển", color: "bg-blue-500" },
    { value: "entertainment", label: "Giải trí", color: "bg-purple-500" },
    { value: "shopping", label: "Mua sắm", color: "bg-pink-500" },
    { value: "other", label: "Khác", color: "bg-slate-500" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !amount || splitBetween.length === 0) return

    onAdd({
      description,
      amount: getFinalAmount(),
      paidBy: ownerId, // Mặc định người trả là owner
      splitBetween,
      category,
    })

    // Reset form
    setDescription("")
    setAmount("")
    setSplitBetween([])
    setCategory("other")
    onClose()
  }

  const toggleMember = (memberId: string) => {
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
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
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 z-50 max-h-[85vh] -translate-y-1/2 overflow-y-auto sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2"
          >
            <GlassCard className="p-4 sm:p-6" variant="strong">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                  Thêm chi tiêu
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                >
                  <X size={20} weight="bold" className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Ăn trưa, Xem phim..."
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="mb-1.5 block text-sm font-medium">
                    Số tiền
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Nhập số (VD: 25 = 25.000đ)"
                    className="h-10 rounded-xl"
                    required
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleQuickAmount(value)}
                        className="rounded-lg border border-slate-300/60 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-white hover:shadow-sm dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                      >
                        {value}k
                      </button>
                    ))}
                  </div>
                  {amount && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                      = {getFinalAmount().toLocaleString('vi-VN')}đ
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Danh mục</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value as 'food' | 'transport' | 'entertainment' | 'shopping' | 'other')}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                          category === cat.value
                            ? "border-slate-400 bg-white shadow-sm ring-2 ring-slate-300/50 dark:bg-slate-800"
                            : "border-slate-300/50 bg-white/70 hover:bg-white dark:border-slate-600/50 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                        )}
                      >
                        <span className={cn("size-2 rounded-full", cat.color)} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium">
                    Chia cho ({splitBetween.length} người)
                  </Label>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl border p-2.5 transition-all",
                          splitBetween.includes(member.id)
                            ? "border-slate-400 bg-white shadow-sm ring-2 ring-slate-300/50 dark:bg-slate-800"
                            : "border-slate-300/50 bg-white/70 hover:bg-white dark:border-slate-600/50 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                        )}
                      >
                        <div
                          className="size-8 shrink-0 rounded-lg"
                          style={{ backgroundColor: member.color }}
                        />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {member.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-white dark:border-slate-600/70 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus size={18} weight="bold" />
                  Thêm chi tiêu
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
