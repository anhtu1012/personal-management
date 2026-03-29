"use client"

import { useState } from "react"
import { X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { format } from "date-fns"

interface PersonalExpenseAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (expense: {
    description: string
    amount: number
    date: string
    category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'other'
    note?: string
  }) => void
}

export function PersonalExpenseAddModal({
  isOpen,
  onClose,
  onAdd,
}: PersonalExpenseAddModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [category, setCategory] = useState<'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'other'>('food')
  const [note, setNote] = useState("")

  const categories = [
    { value: 'food', label: 'Ăn uống', color: 'bg-orange-500' },
    { value: 'transport', label: 'Di chuyển', color: 'bg-blue-500' },
    { value: 'entertainment', label: 'Giải trí', color: 'bg-purple-500' },
    { value: 'shopping', label: 'Mua sắm', color: 'bg-pink-500' },
    { value: 'bills', label: 'Hóa đơn', color: 'bg-yellow-500' },
    { value: 'health', label: 'Sức khỏe', color: 'bg-green-500' },
    { value: 'other', label: 'Khác', color: 'bg-slate-500' },
  ] as const

  const quickAmounts = [10, 20, 50, 100, 200, 500]

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '')
    setAmount(numValue)
  }

  const getFinalAmount = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0
    return numAmount < 1000 ? numAmount * 1000 : numAmount
  }

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("Vui lòng nhập mô tả")
      return
    }

    const finalAmount = getFinalAmount()
    if (finalAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ")
      return
    }

    onAdd({
      description: description.trim(),
      amount: finalAmount,
      date,
      category,
      note: note.trim() || undefined,
    })

    // Reset form
    setDescription("")
    setAmount("")
    setDate(format(new Date(), "yyyy-MM-dd"))
    setCategory('food')
    setNote("")
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
            className="fixed left-1/2 top-1/2 z-101 max-h-[85vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
          >
            <GlassCard variant="strong" className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                  Thêm chi tiêu
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-slate-200 active:scale-95 dark:hover:bg-slate-700"
                >
                  <X size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Mô tả */}
                <div>
                  <Label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Ăn trưa"
                    className="h-10 rounded-xl text-base"
                  />
                </div>

                {/* Số tiền */}
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
                    className="h-10 rounded-xl text-base"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount((value * 1000).toString())}
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

                {/* Ngày */}
                <div>
                  <Label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                    Ngày
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 rounded-xl text-base"
                  />
                </div>

                {/* Danh mục */}
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">
                    Danh mục
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-sm font-medium transition-all ${
                          category === cat.value
                            ? 'border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-500 dark:bg-sky-900/30 dark:text-sky-300'
                            : 'border-slate-300/60 bg-white/70 text-slate-700 hover:border-slate-400 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <span className={`size-3 rounded-full ${cat.color}`} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <Label htmlFor="note" className="mb-1.5 block text-sm font-medium">
                    Ghi chú (tùy chọn)
                  </Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Thêm ghi chú..."
                    className="min-h-[80px] rounded-xl text-base"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-300/60 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 rounded-xl border border-sky-400/70 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-all hover:bg-sky-100 dark:border-sky-500/60 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
