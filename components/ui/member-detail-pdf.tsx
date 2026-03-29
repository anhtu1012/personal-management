"use client"

import type { Member, Expense } from "@/types"
import { formatMoney } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface MemberDetailPDFProps {
  member: Member
  expenses: Expense[]
  totalAmount: number
  totalPaid: number
  remaining: number
}

export function MemberDetailPDF({
  member,
  expenses,
  totalAmount,
  totalPaid,
  remaining,
}: MemberDetailPDFProps) {
  const categories = [
    { value: "food", label: "Ăn uống", color: "#f97316" },
    { value: "transport", label: "Di chuyển", color: "#3b82f6" },
    { value: "entertainment", label: "Giải trí", color: "#8b5cf6" },
    { value: "shopping", label: "Mua sắm", color: "#ec4899" },
    { value: "other", label: "Khác", color: "#64748b" },
  ]

  const calculateMemberShare = (expense: Expense) => {
    return expense.amount / expense.splitBetween.length
  }

  const memberExpenses = expenses.filter(
    (e) => e.paidBy === member.id || e.splitBetween.includes(member.id)
  )

  const expensesByCategory: Record<string, Expense[]> = {}
  memberExpenses.forEach((expense) => {
    const cat = expense.category || "other"
    if (!expensesByCategory[cat]) {
      expensesByCategory[cat] = []
    }
    expensesByCategory[cat].push(expense)
  })

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '3px solid #e2e8f0',
        paddingBottom: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: member.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>
                {member.name}
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                Báo cáo chi tiết chi tiêu
              </p>
            </div>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
            Ngày xuất: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
          </p>
        </div>
        
        {/* QR Code */}
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/image/QR.png" 
            alt="QR Code" 
            style={{ 
              width: '120px', 
              height: '120px',
              border: '3px solid #e2e8f0',
              borderRadius: '12px',
              padding: '8px',
              backgroundColor: '#ffffff'
            }} 
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            Scan để xem online
          </p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f8fafc'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Tổng</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
            {formatMoney(totalAmount)}đ
          </p>
        </div>
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f8fafc'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Còn lại</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
            {formatMoney(remaining)}đ
          </p>
        </div>
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f8fafc'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Đã trả</p>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: '#10b981'
          }}>
            {formatMoney(totalPaid)}đ
          </p>
        </div>
      </div>

      {/* Chi tiết chi tiêu */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>
        Chi tiết chi tiêu
      </h2>

      {categories.map((category) => {
        const categoryExpenses = expensesByCategory[category.value] || []
        if (categoryExpenses.length === 0) return null

        const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)

        return (
          <div key={category.value} style={{ marginBottom: '25px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '10px',
              color: '#1e293b'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: category.color
              }} />
              <span style={{ fontSize: '16px', fontWeight: '600', flex: 1, color: '#1e293b' }}>
                {category.label} ({categoryExpenses.length})
              </span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                {formatMoney(categoryTotal)}đ
              </span>
            </div>

            {categoryExpenses.map((expense) => {
              const share = calculateMemberShare(expense)

              return (
                <div
                  key={expense.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: expense.settled ? '#f1f5f9' : '#ffffff',
                    opacity: expense.settled ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        {expense.description}
                        {expense.settled && ' ✓'}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        {format(new Date(expense.date), "dd/MM/yyyy", { locale: vi })}
                        {" • "}
                        {/* {isPayer ? "Bạn trả" : `${getMemberName(expense.paidBy)} trả`} */}
                        {/* {" • "} */}
                        Chia {expense.splitBetween.length} người
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
                        {formatMoney(expense.amount)}đ
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Phần bạn: {formatMoney(share)}đ
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {memberExpenses.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
          Chưa có chi tiêu nào
        </p>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px solid #e2e8f0',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '12px'
      }}>
        <p style={{ margin: 0 }}>
          Báo cáo được tạo tự động từ hệ thống quản lý tiền nhóm
        </p>
      </div>
    </div>
  )
}
