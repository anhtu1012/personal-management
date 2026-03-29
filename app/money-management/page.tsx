"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Wallet, Plus, UserPlus, Printer } from "@phosphor-icons/react"
import { GlassCard } from "@/components/ui/glass-card"
import { MemberCard } from "@/components/ui/member-card"
import { ExpenseQuickAddModal } from "@/components/ui/expense-quick-add-modal"
import { AddMemberModal } from "@/components/ui/add-member-modal"
import { MemberDetailModal } from "@/components/ui/member-detail-modal"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  addMember,
  deleteMember,
  addExpense,
  toggleExpenseSettled,
  settleAllForMember,
  resetMemberData,
  calculateBalances,
} from "@/store/slices/moneySlice"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { Member } from "@/types"
import { formatMoney } from "@/lib/utils"

// Owner ID - người dùng app (có thể lưu trong localStorage hoặc auth)
const OWNER_ID = "owner"

export default function MoneyManagementPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.money.members)
  const expenses = useAppSelector((state) => state.money.expenses)
  const payments = useAppSelector((state) => state.money.payments)

  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const balances = useMemo(() => {
    return calculateBalances(members, expenses, payments)
  }, [members, expenses, payments])

  const totalExpenses = useMemo(() => {
    return expenses
      .filter((e: { settled: boolean }) => !e.settled)
      .reduce((sum: number, e: { amount: number }) => sum + e.amount, 0)
  }, [expenses])

  const totalRemaining = useMemo(() => {
    // Tính tổng còn lại của tất cả members
    return balances.reduce((sum, balance) => {
      // Tìm payments của member này
      const memberPayments = payments.filter((p: { memberId: string }) => p.memberId === balance.memberId)
      const totalPaid = memberPayments.reduce((s: number, p: { amount: number }) => s + p.amount, 0)
      
      // Tính phần còn lại của member này
      const memberTotal = expenses
        .filter((e: { splitBetween: string[]; settled: boolean }) => 
          e.splitBetween.includes(balance.memberId) && !e.settled
        )
        .reduce((s: number, e: { amount: number; splitBetween: string[] }) => 
          s + (e.amount / e.splitBetween.length), 0
        )
      
      const remaining = Math.max(0, memberTotal - totalPaid)
      return sum + remaining
    }, 0)
  }, [balances, expenses, payments])

  const handleAddMember = (member: { name: string; color: string }) => {
    dispatch(addMember(member))
  }

  const handleDeleteMember = (memberId: string) => {
    if (confirm("Xóa thành viên này? Tất cả chi tiêu liên quan sẽ bị xóa.")) {
      dispatch(deleteMember(memberId))
    }
  }

  const handleAddExpense = (expense: {
    description: string
    amount: number
    paidBy: string
    splitBetween: string[]
    category?: 'food' | 'transport' | 'entertainment' | 'shopping' | 'other'
  }) => {
    dispatch(
      addExpense({
        ...expense,
        date: format(new Date(), "yyyy-MM-dd"),
        settled: false,
      })
    )
  }

  const handleSettleAll = (memberId: string, amount: number) => {
    dispatch(settleAllForMember({ memberId, amount }))
  }

  const handleResetMember = (memberId: string) => {
    dispatch(resetMemberData(memberId))
  }

  const handlePrintAll = () => {
    if (members.length === 0) {
      alert('Chưa có thành viên nào để in')
      return
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Vui lòng cho phép popup để in')
      return
    }

    // Tạo nội dung HTML cho tất cả members
    let allContent = ''
    members.forEach((member: Member) => {
      const memberExpenses = expenses.filter(
        (e: { paidBy: string; splitBetween: string[] }) => e.paidBy === member.id || e.splitBetween.includes(member.id)
      )

      // Tạo temporary div để render MemberDetailPDF
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = `
        <div style="page-break-after: always;">
          ${renderMemberPDFContent(member, memberExpenses)}
        </div>
      `
      allContent += tempDiv.innerHTML
    })

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Báo cáo tất cả thành viên - ${format(new Date(), 'dd-MM-yyyy')}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; color: #1e293b; }
            @media print { 
              body { padding: 0; }
              .page-break { page-break-after: always; }
            }
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

  const renderMemberPDFContent = (member: Member, memberExpenses: Array<{
    id: string;
    paidBy: string;
    splitBetween: string[];
    amount: number;
    settled: boolean;
  }>) => {
    // Tổng tiền (phần của member trong các expenses chưa settled)
    const totalAmount = memberExpenses
      .filter((e) => e.splitBetween.includes(member.id) && !e.settled)
      .reduce((sum, e) => sum + (e.amount / e.splitBetween.length), 0)

    // Đã trả (từ payments)
    const memberPayments = payments.filter((p: { memberId: string }) => p.memberId === member.id)
    const totalPaid = memberPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0)

    // Còn lại
    const remaining = Math.max(0, totalAmount - totalPaid)

    // Render inline HTML (simplified version)
    return `
      <div id="member-${member.id}-content" style="font-family: Arial, sans-serif; padding: 20px; background: #ffffff; color: #1e293b; min-height: 100vh;">
        <div style="border-bottom: 3px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <div style="width: 60px; height: 60px; border-radius: 12px; background-color: ${member.color}; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 24px; font-weight: bold;">
                ${member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1e293b;">${member.name}</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Báo cáo chi tiết chi tiêu</p>
              </div>
            </div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}</p>
          </div>
          <div style="text-align: center;">
            <img src="/image/QR.png" alt="QR Code" style="width: 120px; height: 120px; border: 3px solid #e2e8f0; border-radius: 12px; padding: 8px; background: #ffffff;" />
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;">Scan để xem online</p>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Tổng</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #1e293b;">${formatMoney(totalAmount)}đ</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Còn lại</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #ef4444;">${formatMoney(remaining)}đ</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Đã trả</p>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #10b981;">${formatMoney(totalPaid)}đ</p>
          </div>
        </div>
        ${memberExpenses.length > 0 ? `
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1e293b;">Chi tiết chi tiêu</h2>
          <p style="color: #64748b; font-size: 14px;">Tổng ${memberExpenses.length} giao dịch</p>
        ` : `
          <p style="text-align: center; color: #64748b; padding: 40px 0;">Chưa có chi tiêu nào</p>
        `}
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Báo cáo được tạo tự động từ hệ thống quản lý tiền nhóm</p>
        </div>
      </div>
    `
  }

  return (
    <div className="liquid-page">
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
              <ArrowLeft
                size={18}
                weight="bold"
                className="text-slate-700 dark:text-slate-300 sm:hidden"
              />
              <ArrowLeft
                size={20}
                weight="bold"
                className="hidden text-slate-700 dark:text-slate-300 sm:block"
              />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
                  <Wallet
                    size={18}
                    className="text-slate-700 dark:text-slate-300 sm:hidden"
                    weight="fill"
                  />
                  <Wallet
                    size={24}
                    className="hidden text-slate-700 dark:text-slate-300 sm:block"
                    weight="fill"
                  />
                </div>
                <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-4xl">
                  Quản lý tiền nhóm
                </h1>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:mt-1 sm:text-sm md:text-base">
                {format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handlePrintAll}
              className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
              title="In tất cả thành viên"
            >
              <Printer size={16} weight="bold" className="sm:hidden" />
              <Printer size={18} weight="bold" className="hidden sm:block" />
              <span>In tất cả</span>
            </button>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
            >
              <UserPlus size={16} weight="bold" className="sm:hidden" />
              <UserPlus size={18} weight="bold" className="hidden sm:block" />
              <span>Thêm thành viên</span>
            </button>
          </div>
        </motion.header>

        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
         
          <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
            <p className="truncate text-[11px] text-slate-600 dark:text-slate-400 sm:text-xs md:text-sm">
              Tổng chi tiêu
            </p>
            <p className="mt-1 truncate text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl md:text-3xl">
              {formatMoney(totalExpenses)}đ
            </p>
          </GlassCard>

          <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
            <p className="truncate text-[11px] text-slate-600 dark:text-slate-400 sm:text-xs md:text-sm">
              Tổng còn lại
            </p>
            <p className="mt-1 truncate text-xl font-bold text-rose-600 dark:text-rose-400 sm:text-2xl md:text-3xl">
              {formatMoney(totalRemaining)}đ
            </p>
          </GlassCard>
        </div>

        <section className="w-full space-y-3 sm:space-y-4">
          <h2 className="text-base font-semibold dark:text-slate-100 sm:text-lg md:text-xl">
            Danh sách thành viên ({members.length})
          </h2>

          {members.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-6 text-center sm:p-8 md:p-12">
                <Wallet
                  size={32}
                  className="mx-auto text-slate-500 dark:text-slate-400 sm:hidden"
                  weight="duotone"
                />
                <Wallet
                  size={42}
                  className="mx-auto hidden text-slate-500 dark:text-slate-400 sm:block"
                  weight="duotone"
                />
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 sm:mt-3 sm:text-base md:text-lg">
                  Chưa có thành viên nào
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-sm">
                  Nhấn &quot;Thêm thành viên&quot; để bắt đầu.
                </p>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence>
                {members.map((member: Member) => {
                  const balance = balances.find((b) => b.memberId === member.id) || {
                    memberId: member.id,
                    totalPaid: 0,
                    totalOwed: 0,
                    balance: 0,
                  }

                  return (
                    <MemberCard
                      key={member.id}
                      member={member}
                      balance={balance}
                      payments={payments}
                      onClick={() => {
                        setSelectedMember(member)
                      }}
                      onDelete={() => handleDeleteMember(member.id)}
                    />
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {members.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowExpenseModal(true)}
          className="fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30 transition-shadow hover:shadow-xl hover:shadow-sky-500/40 sm:bottom-24 sm:right-6 sm:size-16"
        >
          <Plus size={24} weight="bold" className="text-white sm:hidden" />
          <Plus size={28} weight="bold" className="hidden text-white sm:block" />
        </motion.button>
      )}

      <ExpenseQuickAddModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        members={members}
        ownerId={OWNER_ID}
        onAdd={handleAddExpense}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAdd={handleAddMember}
      />

      {selectedMember && (
        <MemberDetailModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember}
          expenses={expenses}
          onToggleSettled={(expenseId) => dispatch(toggleExpenseSettled(expenseId))}
          onSettleAll={handleSettleAll}
          onReset={handleResetMember}
        />
      )}
    </div>
  )
}
