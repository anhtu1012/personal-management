"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Wallet, Plus, CaretLeft, CaretRight, Printer } from "@phosphor-icons/react"
import { GlassCard } from "@/components/ui/glass-card"
import { PersonalExpenseAddModal } from "@/components/ui/personal-expense-add-modal"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addPersonalExpense, deletePersonalExpense } from "@/store/slices/moneySlice"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { vi } from "date-fns/locale"
import type { PersonalExpense } from "@/types"
import { formatMoney } from "@/lib/utils"

export default function PersonalExpensePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const personalExpenses = useAppSelector((state) => state.money.personalExpenses)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Lọc expenses theo tháng hiện tại
  const monthExpenses = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    
    return personalExpenses.filter((expense: PersonalExpense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= start && expenseDate <= end
    }).sort((a: PersonalExpense, b: PersonalExpense) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [personalExpenses, currentDate])

  // Tổng chi tiêu tháng
  const monthTotal = useMemo(() => {
    return monthExpenses.reduce((sum: number, e: PersonalExpense) => sum + e.amount, 0)
  }, [monthExpenses])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleSelectMonth = (month: number) => {
    setCurrentDate(new Date(selectedYear, month))
    setShowMonthPicker(false)
  }

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1)
  }

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1)
  }

  const handleDeleteExpense = (id: string) => {
    if (confirm("Xóa chi tiêu này?")) {
      dispatch(deletePersonalExpense(id))
    }
  }

  const handleAddExpense = (expense: {
    description: string
    amount: number
    date: string
    category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'other'
    note?: string
  }) => {
    dispatch(addPersonalExpense(expense))
  }

  const handlePrintMonth = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Vui lòng cho phép popup để in')
      return
    }

    const content = renderMonthPDF(currentDate, monthExpenses, monthTotal)
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Chi tiêu ${format(currentDate, "MM-yyyy")}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; color: #1e293b; padding: 20px; }
            @media print { body { padding: 0; } }
            @page { margin: 1cm; size: A4; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 250);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Vui lòng cho phép popup để in')
      return
    }

    // Nhóm expenses theo tháng
    const expensesByMonth: Record<string, typeof personalExpenses> = {}
    personalExpenses.forEach((expense: PersonalExpense) => {
      const monthKey = format(new Date(expense.date), "yyyy-MM")
      if (!expensesByMonth[monthKey]) {
        expensesByMonth[monthKey] = []
      }
      expensesByMonth[monthKey].push(expense)
    })

    // Sắp xếp theo tháng mới nhất
    const sortedMonths = Object.keys(expensesByMonth).sort().reverse()

    let allContent = ''
    sortedMonths.forEach((monthKey, index) => {
      const monthDate = new Date(monthKey + '-01')
      const expenses = expensesByMonth[monthKey]
      const total = expenses.reduce((sum: number, e: PersonalExpense) => sum + e.amount, 0)
      
      allContent += `
        <div style="page-break-after: ${index < sortedMonths.length - 1 ? 'always' : 'auto'};">
          ${renderMonthPDF(monthDate, expenses, total)}
        </div>
      `
    })

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Tất cả chi tiêu</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; color: #1e293b; }
            @media print { body { padding: 0; } }
            @page { margin: 1cm; size: A4; }
          </style>
        </head>
        <body>
          ${allContent}
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 250);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const renderMonthPDF = (date: Date, expenses: typeof monthExpenses, total: number) => {
    const categoryMap = {
      food: { label: "Ăn uống", color: "#f97316" },
      transport: { label: "Di chuyển", color: "#3b82f6" },
      entertainment: { label: "Giải trí", color: "#8b5cf6" },
      shopping: { label: "Mua sắm", color: "#ec4899" },
      bills: { label: "Hóa đơn", color: "#eab308" },
      health: { label: "Sức khỏe", color: "#22c55e" },
      other: { label: "Khác", color: "#64748b" },
    }

    return `
      <div style="padding: 20px; min-height: 100vh;">
        <div style="border-bottom: 3px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1e293b;">
            Chi tiêu cá nhân
          </h1>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 16px;">
            ${format(date, "MMMM yyyy", { locale: vi })}
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
            Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
          </p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">Tổng chi tiêu</p>
          <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: bold; color: #ef4444;">
            ${formatMoney(total)}đ
          </p>
        </div>

        ${expenses.length > 0 ? `
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1e293b;">
            Chi tiết (${expenses.length} giao dịch)
          </h2>
          <div style="display: grid; gap: 10px;">
            ${expenses.map((expense: PersonalExpense) => {
              const cat = categoryMap[expense.category]
              return `
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: white;">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${cat.color}; display: inline-block;"></span>
                        <span style="font-size: 14px; font-weight: 600; color: #1e293b;">${expense.description}</span>
                      </div>
                      <p style="margin: 0; font-size: 12px; color: #64748b;">
                        ${format(new Date(expense.date), "dd/MM/yyyy", { locale: vi })} • ${cat.label}
                      </p>
                      ${expense.note ? `
                        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-style: italic;">
                          ${expense.note}
                        </p>
                      ` : ''}
                    </div>
                    <div style="text-align: right;">
                      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #ef4444;">
                        ${formatMoney(expense.amount)}đ
                      </p>
                    </div>
                  </div>
                </div>
              `
            }).join('')}
          </div>
        ` : `
          <p style="text-align: center; color: #64748b; padding: 40px 0;">
            Chưa có chi tiêu nào trong tháng này
          </p>
        `}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Báo cáo được tạo tự động từ hệ thống quản lý tiền cá nhân</p>
        </div>
      </div>
    `
  }

  const categories = {
    food: { label: "Ăn uống", color: "bg-orange-500" },
    transport: { label: "Di chuyển", color: "bg-blue-500" },
    entertainment: { label: "Giải trí", color: "bg-purple-500" },
    shopping: { label: "Mua sắm", color: "bg-pink-500" },
    bills: { label: "Hóa đơn", color: "bg-yellow-500" },
    health: { label: "Sức khỏe", color: "bg-green-500" },
    other: { label: "Khác", color: "bg-slate-500" },
  }

  return (
    <div className="liquid-page pb-24">
      <span className="liquid-orb liquid-orb-sky -top-20 -left-10 h-44 w-44 sm:h-56 sm:w-56" />
      <span className="liquid-orb liquid-orb-indigo top-22 -right-10 h-40 w-40 sm:h-52 sm:w-52" />

      <div className="liquid-container relative z-10 w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="liquid-panel mt-0.5 rounded-xl p-2 transition-transform duration-200 active:scale-95 sm:mt-1 sm:p-2.5"
            >
              <ArrowLeft size={18} weight="bold" className="text-slate-700 dark:text-slate-300 sm:hidden" />
              <ArrowLeft size={20} weight="bold" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
                  <Wallet size={18} className="text-slate-700 dark:text-slate-300 sm:hidden" weight="fill" />
                  <Wallet size={24} className="hidden text-slate-700 dark:text-slate-300 sm:block" weight="fill" />
                </div>
                <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-4xl">
                  Quản lý tiền cá nhân
                </h1>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:mt-1 sm:text-sm md:text-base">
                {format(currentDate, "MMMM yyyy", { locale: vi })}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handlePrintAll}
              className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
              title="In tất cả tháng"
            >
              <Printer size={16} weight="bold" className="sm:hidden" />
              <Printer size={18} weight="bold" className="hidden sm:block" />
              <span>In tất cả</span>
            </button>
            <button
              onClick={handlePrintMonth}
              className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
              title="In tháng này"
            >
              <Printer size={16} weight="bold" className="sm:hidden" />
              <Printer size={18} weight="bold" className="hidden sm:block" />
              <span>In tháng</span>
            </button>
          </div>
        </motion.header>

        {/* List chi tiêu */}
        <section className="w-full space-y-3 sm:space-y-4">
          {monthExpenses.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-6 text-center sm:p-8 md:p-12">
                <Wallet size={32} className="mx-auto text-slate-500 dark:text-slate-400 sm:hidden" weight="duotone" />
                <Wallet size={42} className="mx-auto hidden text-slate-500 dark:text-slate-400 sm:block" weight="duotone" />
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 sm:mt-3 sm:text-base md:text-lg">
                  Chưa có chi tiêu nào trong tháng này
                </p>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence>
                {monthExpenses.map((expense: PersonalExpense) => {
                  const category = categories[expense.category]
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <GlassCard className="p-3 sm:p-4" glow="none">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${category.color} sm:size-12`}>
                              <span className="text-lg font-bold text-white sm:text-xl">
                                {category.label.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base">
                                {expense.description}
                              </h3>
                              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                {format(new Date(expense.date), "dd/MM/yyyy", { locale: vi })} • {category.label}
                              </p>
                              {expense.note && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  {expense.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="text-base font-bold text-rose-600 dark:text-rose-400 sm:text-lg">
                              {formatMoney(expense.amount)}đ
                            </span>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Float - Month Selector */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
      >
        <GlassCard className="p-3 sm:p-4" variant="strong">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevMonth}
              className="flex size-10 items-center justify-center rounded-xl bg-slate-200/50 transition-colors hover:bg-slate-300/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50"
            >
              <CaretLeft size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
            </button>

            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex-1 text-center transition-transform active:scale-95"
            >
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {format(currentDate, "MMMM yyyy", { locale: vi })}
              </p>
              <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
                {formatMoney(monthTotal)}đ
              </p>
            </button>

            <button
              onClick={handleNextMonth}
              className="flex size-10 items-center justify-center rounded-xl bg-slate-200/50 transition-colors hover:bg-slate-300/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50"
            >
              <CaretRight size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </GlassCard>

        {/* Month Picker Dropdown */}
        <AnimatePresence>
          {showMonthPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 right-0 mb-2"
            >
              <GlassCard className="p-3" variant="strong">
                {/* Year Selector */}
                <div className="mb-2 flex items-center justify-between">
                  <button
                    onClick={handlePrevYear}
                    className="flex size-8 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-slate-300/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50"
                  >
                    <CaretLeft size={16} weight="bold" className="text-slate-700 dark:text-slate-300" />
                  </button>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {selectedYear}
                  </span>
                  <button
                    onClick={handleNextYear}
                    className="flex size-8 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-slate-300/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50"
                  >
                    <CaretRight size={16} weight="bold" className="text-slate-700 dark:text-slate-300" />
                  </button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
                    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
                  ].map((label, index) => {
                    const isSelected = 
                      index === currentDate.getMonth() && 
                      selectedYear === currentDate.getFullYear()

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectMonth(index)}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-slate-200/50 text-slate-700 hover:bg-slate-300/50 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-600/50"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 z-40 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30 transition-shadow hover:shadow-xl hover:shadow-sky-500/40 sm:bottom-28 sm:right-6 sm:size-16"
      >
        <Plus size={24} weight="bold" className="text-white sm:hidden" />
        <Plus size={28} weight="bold" className="hidden text-white sm:block" />
      </motion.button>

      {/* Add Expense Modal */}
      <PersonalExpenseAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddExpense}
      />
    </div>
  )
}
