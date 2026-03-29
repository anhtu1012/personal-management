import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Member, Expense, Balance, Payment, PersonalExpense } from '@/types'

interface MoneyState {
  members: Member[]
  expenses: Expense[]
  payments: Payment[]
  personalExpenses: PersonalExpense[]
  loading: boolean
}

const initialState: MoneyState = {
  members: [],
  expenses: [],
  payments: [],
  personalExpenses: [],
  loading: false,
}

const moneySlice = createSlice({
  name: 'money',
  initialState,
  reducers: {
    // Member actions
    addMember: (state, action: PayloadAction<Omit<Member, 'id' | 'createdAt'>>) => {
      const newMember: Member = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.members.push(newMember)
    },
    
    updateMember: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id)
      if (index !== -1) {
        state.members[index] = action.payload
      }
    },
    
    deleteMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload)
      // Xóa các expense liên quan
      state.expenses = state.expenses.filter(
        e => e.paidBy !== action.payload && !e.splitBetween.includes(action.payload)
      )
    },

    // Expense actions
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id' | 'createdAt'>>) => {
      const newExpense: Expense = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.expenses.push(newExpense)
    },
    
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
    },
    
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload)
    },
    
    toggleExpenseSettled: (state, action: PayloadAction<string>) => {
      const expense = state.expenses.find(e => e.id === action.payload)
      if (expense) {
        expense.settled = !expense.settled
      }
    },

    settleAllForMember: (state, action: PayloadAction<{ memberId: string; amount: number }>) => {
      const { memberId, amount } = action.payload
      let remaining = amount

      // Lấy tất cả expense chưa settled mà member này phải trả (là người nợ)
      const memberOwedExpenses = state.expenses
        .filter(e => e.splitBetween.includes(memberId) && !e.settled)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Đánh dấu settled cho các expense theo thứ tự cũ -> mới
      for (const expense of memberOwedExpenses) {
        if (remaining <= 0) break
        
        // Tính phần của member trong expense này
        const share = expense.amount / expense.splitBetween.length
        
        // Nếu còn đủ tiền để cover phần này
        if (remaining >= share) {
          // Kiểm tra xem tất cả người khác trong splitBetween đã thanh toán chưa
          // Nếu chỉ còn member này chưa thanh toán thì mới đánh dấu settled
          const allOthersPaid = expense.splitBetween.every(id => id === memberId)
          
          if (allOthersPaid || expense.splitBetween.length === 1) {
            expense.settled = true
          }
          
          remaining -= share
        }
      }

      // Tạo payment record
      const payment: Payment = {
        id: Date.now().toString(),
        memberId,
        amount,
        date: new Date().toISOString(),
        note: `Thanh toán ${amount.toLocaleString('vi-VN')}đ`,
        createdAt: new Date().toISOString(),
      }
      state.payments.push(payment)
    },

    // Payment actions
    addPayment: (state, action: PayloadAction<Omit<Payment, 'id' | 'createdAt'>>) => {
      const newPayment: Payment = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.payments.push(newPayment)
    },

    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(p => p.id !== action.payload)
    },

    resetMemberData: (state, action: PayloadAction<string>) => {
      const memberId = action.payload
      // Xóa tất cả expenses liên quan
      state.expenses = state.expenses.filter(
        e => e.paidBy !== memberId && !e.splitBetween.includes(memberId)
      )
      // Xóa tất cả payments của member
      state.payments = state.payments.filter(p => p.memberId !== memberId)
    },

    // Personal Expense actions
    addPersonalExpense: (state, action: PayloadAction<Omit<PersonalExpense, 'id' | 'createdAt'>>) => {
      const newExpense: PersonalExpense = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.personalExpenses.push(newExpense)
    },

    updatePersonalExpense: (state, action: PayloadAction<PersonalExpense>) => {
      const index = state.personalExpenses.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.personalExpenses[index] = action.payload
      }
    },

    deletePersonalExpense: (state, action: PayloadAction<string>) => {
      state.personalExpenses = state.personalExpenses.filter(e => e.id !== action.payload)
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  addMember,
  updateMember,
  deleteMember,
  addExpense,
  updateExpense,
  deleteExpense,
  toggleExpenseSettled,
  settleAllForMember,
  addPayment,
  deletePayment,
  resetMemberData,
  addPersonalExpense,
  updatePersonalExpense,
  deletePersonalExpense,
  setLoading,
} = moneySlice.actions

export default moneySlice.reducer

// Selectors
export const calculateBalances = (members: Member[], expenses: Expense[], payments: Payment[]): Balance[] => {
  const balances: Record<string, Balance> = {}

  // Initialize balances
  members.forEach(member => {
    balances[member.id] = {
      memberId: member.id,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0,
    }
  })

  // Calculate from expenses (chỉ tính expense chưa settled)
  expenses.filter(e => !e.settled).forEach(expense => {
    // Người trả tiền
    if (balances[expense.paidBy]) {
      balances[expense.paidBy].totalPaid += expense.amount
    }

    // Chia đều cho những người trong splitBetween
    const splitAmount = expense.amount / expense.splitBetween.length
    expense.splitBetween.forEach(memberId => {
      if (balances[memberId]) {
        balances[memberId].totalOwed += splitAmount
      }
    })
  })

  // Trừ đi số tiền đã thanh toán (payments)
  payments.forEach(payment => {
    if (balances[payment.memberId]) {
      // Giảm số nợ bằng số tiền đã thanh toán
      balances[payment.memberId].totalOwed -= payment.amount
      // Đảm bảo không âm
      if (balances[payment.memberId].totalOwed < 0) {
        balances[payment.memberId].totalOwed = 0
      }
    }
  })

  // Calculate balance
  Object.values(balances).forEach(balance => {
    balance.balance = balance.totalPaid - balance.totalOwed
  })

  return Object.values(balances)
}
