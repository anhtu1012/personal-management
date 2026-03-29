"use client"

import { useMemo } from "react"
import { X, CaretDown, CaretRight, Check, Printer, CurrencyCircleDollar, Trash } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { MemberDetailPDF } from "./member-detail-pdf"
import type { Member, Expense } from "@/types"
import { cn, formatMoney } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useState } from "react"
import { useAppSelector } from "@/store/hooks"

interface MemberDetailModalProps {
  isOpen: boolean
  onClose: () => void
  member: Member
  expenses: Expense[]
  onToggleSettled: (expenseId: string) => void
  onSettleAll: (memberId: string, amount: number) => void
  onReset: (memberId: string) => void
}

export function MemberDetailModal({
  isOpen,
  onClose,
  member,
  expenses,
  onToggleSettled,
  onSettleAll,
  onReset,
}: MemberDetailModalProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [settlementAmount, setSettlementAmount] = useState("")
  const [showSettlement, setShowSettlement] = useState(false)
  
  // Lấy payments từ Redux
  const payments = useAppSelector((state) => state.money.payments)
  
  // Lọc payments của member này
  const memberPayments = useMemo(() => {
    return payments
      .filter((p: { memberId: string }) => p.memberId === member.id)
      .sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [payments, member.id])
  // Lọc expenses liên quan đến member này
  const memberExpenses = useMemo(() => {
    return expenses.filter(
      (e) => e.paidBy === member.id || e.splitBetween.includes(member.id)
    )
  }, [expenses, member.id])

  // Nhóm theo category
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, Expense[]> = {}
    
    memberExpenses.forEach((expense) => {
      const cat = expense.category || "other"
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push(expense)
    })

    return grouped
  }, [memberExpenses])

  const categories = [
    { value: "food", label: "Ăn uống", color: "bg-orange-500" },
    { value: "transport", label: "Di chuyển", color: "bg-blue-500" },
    { value: "entertainment", label: "Giải trí", color: "bg-purple-500" },
    { value: "shopping", label: "Mua sắm", color: "bg-pink-500" },
    { value: "other", label: "Khác", color: "bg-slate-500" },
  ]

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const calculateMemberShare = (expense: Expense) => {
    return expense.amount / expense.splitBetween.length
  }

  // Tổng tiền phải trả (phần của member trong các expenses chưa settled)
  const totalAmount = useMemo(() => {
    return memberExpenses
      .filter((e) => e.splitBetween.includes(member.id) && !e.settled)
      .reduce((sum, e) => sum + (e.amount / e.splitBetween.length), 0)
  }, [memberExpenses, member.id])

  // Tổng tiền đã thanh toán (từ payments)
  const totalPaid = useMemo(() => {
    return memberPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0)
  }, [memberPayments])

  // Số tiền còn lại phải trả
  const remaining = useMemo(() => {
    return Math.max(0, totalAmount - totalPaid)
  }, [totalAmount, totalPaid])

  console.log('=== Balance Calculation ===')
  console.log('Member:', member.name)
  console.log('Tổng (phần của member):', totalAmount)
  console.log('Đã trả (payments):', totalPaid)
  console.log('Còn lại:', remaining)

  const handleSettlementAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '')
    setSettlementAmount(numValue)
  }

  const getFinalSettlementAmount = () => {
    const numAmount = parseFloat(settlementAmount)
    if (isNaN(numAmount)) return 0
    return numAmount < 1000 ? numAmount * 1000 : numAmount
  }

  const handleSettleAll = () => {
    const amount = getFinalSettlementAmount()
    
    if (amount <= 0) {
      return
    }
    
    // Tính số nợ hiện tại
    const currentDebt = remaining
    
    if (amount > currentDebt) {
      if (!confirm(`Số tiền thanh toán (${formatMoney(amount)}đ) lớn hơn số còn lại (${formatMoney(currentDebt)}đ). Bạn có muốn tiếp tục?`)) {
        return
      }
    }
    
    onSettleAll(member.id, amount)
    
    setSettlementAmount("")
    setShowSettlement(false)
  }

  const handleReset = () => {
    if (confirm(`Xóa toàn bộ dữ liệu của ${member.name}?\n\nĐiều này sẽ xóa:\n- Tất cả chi tiêu liên quan\n- Tất cả lịch sử thanh toán\n\nHành động này không thể hoàn tác!`)) {
      onReset(member.id)
      onClose()
    }
  }

  const handlePrint = () => {
    const printContent = document.getElementById('member-detail-content')
    if (!printContent) {
      alert('Không tìm thấy nội dung để in')
      return
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Vui lòng cho phép popup để in/xuất PDF')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Chi tiết - ${member.name}</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: Arial, sans-serif; 
              background: white;
              color: #1e293b;
            }
            @media print { 
              body { 
                padding: 0; 
              }
              .no-print {
                display: none !important;
              }
            }
            @page { 
              margin: 1cm;
              size: A4;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print();
              }, 250);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const quickSettlementAmounts = [10, 20, 50, 100, 200, 500]

  return (
    <>
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
            className="fixed left-1/2 top-1/2 z-101 max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
          >
            <GlassCard variant="strong" className="p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14"
                    style={{ backgroundColor: member.color }}
                  >
                    <span className="text-lg font-bold text-white sm:text-xl">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                      {member.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Chi tiết chi tiêu
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-rose-100 active:scale-95 dark:hover:bg-rose-900/30"
                    title="Xóa toàn bộ dữ liệu"
                  >
                    <Trash size={20} weight="bold" className="text-rose-600 dark:text-rose-400" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-slate-200 active:scale-95 dark:hover:bg-slate-700"
                    title="In (Ctrl+P)"
                  >
                    <Printer size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-slate-200 active:scale-95 dark:hover:bg-slate-700"
                  >
                    <X size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-300/60 bg-white/70 p-3 dark:border-slate-600/60 dark:bg-slate-800/70">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Tổng</p>
                  <p className="mt-1 truncate text-base font-bold text-slate-800 dark:text-slate-100">
                    {formatMoney(totalAmount)}đ
                  </p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/70 p-3 dark:border-slate-600/60 dark:bg-slate-800/70">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Còn lại</p>
                  <p className="mt-1 truncate text-base font-bold text-rose-600 dark:text-rose-400">
                    {formatMoney(remaining)}đ
                  </p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/70 p-3 dark:border-slate-600/60 dark:bg-slate-800/70">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Đã trả</p>
                  <p className="mt-1 truncate text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatMoney(totalPaid)}đ
                  </p>
                </div>
              </div>

              {/* Settlement Section */}
              {remaining > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowSettlement(!showSettlement)}
                    className="w-full rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                  >
                    {showSettlement ? "Đóng thanh toán" : "Thanh toán ngay"}
                  </button>

                  <AnimatePresence>
                    {showSettlement && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 overflow-hidden rounded-xl border border-slate-300/60 bg-white/70 p-3 dark:border-slate-600/60 dark:bg-slate-800/70"
                      >
                        <Label htmlFor="settlement-amount" className="mb-1.5 block text-sm font-medium">
                          Số tiền thanh toán
                        </Label>
                        <Input
                          id="settlement-amount"
                          type="text"
                          inputMode="numeric"
                          value={settlementAmount}
                          onChange={(e) => handleSettlementAmountChange(e.target.value)}
                          placeholder="Nhập số (VD: 25 = 25.000đ)"
                          className="h-10 rounded-xl"
                        />
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {quickSettlementAmounts.map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSettlementAmount((value * 1000).toString())}
                              className="rounded-lg border border-slate-300/60 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-white hover:shadow-sm dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                            >
                              {value}k
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setSettlementAmount(remaining.toString())}
                            className="rounded-lg border border-emerald-400/70 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                          >
                            Toàn bộ
                          </button>
                        </div>
                        {settlementAmount && (
                          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                            = {getFinalSettlementAmount().toLocaleString('vi-VN')}đ
                          </p>
                        )}
                        <button
                          onClick={handleSettleAll}
                          disabled={!settlementAmount || getFinalSettlementAmount() <= 0}
                          className="mt-3 w-full rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                        >
                          Xác nhận thanh toán
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Lịch sử thanh toán */}
              {memberPayments.length > 0 && (
                <div className="mb-4">
                  <h2 className="mb-2 text-base font-semibold dark:text-slate-100 sm:text-lg md:text-xl">
                    Lịch sử thanh toán
                  </h2>
                  <div className="space-y-2">
                    {memberPayments.map((payment: { id: string; amount: number; date: string }) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 rounded-xl border border-emerald-300/60 bg-emerald-50/50 p-3 dark:border-emerald-600/60 dark:bg-emerald-900/20"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
                          <CurrencyCircleDollar size={20} weight="bold" className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            Đã thanh toán {formatMoney(payment.amount)}đ
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {format(new Date(payment.date), "dd/MM/yyyy HH:mm", { locale: vi })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expense Tree */}
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryExpenses = expensesByCategory[category.value] || []
                  if (categoryExpenses.length === 0) return null

                  const isExpanded = expandedCategories.has(category.value)
                  const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)

                  return (
                    <div key={category.value} className="overflow-hidden rounded-xl border border-slate-300/60 bg-white/70 dark:border-slate-600/60 dark:bg-slate-800/70">
                      <button
                        onClick={() => toggleCategory(category.value)}
                        className="flex w-full items-center justify-between p-3 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-2.5">
                          {isExpanded ? (
                            <CaretDown size={16} weight="bold" className="text-slate-600 dark:text-slate-400" />
                          ) : (
                            <CaretRight size={16} weight="bold" className="text-slate-600 dark:text-slate-400" />
                          )}
                          <span className={cn("size-3 rounded-full", category.color)} />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {category.label}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({categoryExpenses.length})
                          </span>
                        </div>
                        <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                          {formatMoney(categoryTotal)}đ
                        </span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 border-t border-slate-200/60 p-2 dark:border-slate-700/60">
                              {categoryExpenses.map((expense) => {
                                const share = calculateMemberShare(expense)

                                return (
                                  <div
                                    key={expense.id}
                                    className={cn(
                                      "rounded-lg border p-2.5 transition-all",
                                      expense.settled
                                        ? "border-slate-200/60 bg-slate-50/50 opacity-60 dark:border-slate-700/60 dark:bg-slate-800/50"
                                        : "border-slate-300/60 bg-white/70 dark:border-slate-600/60 dark:bg-slate-800/70"
                                    )}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                            {expense.description}
                                          </p>
                                          {expense.settled && (
                                            <Check size={14} weight="bold" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                          )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                                          {format(new Date(expense.date), "dd MMM yyyy", { locale: vi })}
                                          {" • "}
                                          {/* {isPayer ? "Bạn trả" : `${getMemberName(expense.paidBy)} trả`}
                                          {" • "} */}
                                          Chia {expense.splitBetween.length} người
                                        </p>
                                      </div>
                                      <div className="flex shrink-0 flex-col items-end gap-1">
                                        <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                                          {formatMoney(expense.amount)}đ
                                        </span>
                                        <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                                          Phần bạn: {formatMoney(share)}đ
                                        </span>
                                        <button
                                          onClick={() => onToggleSettled(expense.id)}
                                          className={cn(
                                            "mt-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                                            expense.settled
                                              ? "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                          )}
                                        >
                                          {expense.settled ? "Chưa TT" : "Đã TT"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {memberExpenses.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Chưa có chi tiêu nào
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Hidden PDF content - positioned off-screen but in DOM */}
            <div 
              style={{ 
                position: 'fixed', 
                left: '-10000px', 
                top: 0,
                width: '800px',
                backgroundColor: '#ffffff',
                zIndex: -1
              }}
            >
              <div id="member-detail-content">
                <MemberDetailPDF
                  member={member}
                  expenses={memberExpenses}
                  totalAmount={totalAmount}
                  totalPaid={totalPaid}
                  remaining={remaining}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
