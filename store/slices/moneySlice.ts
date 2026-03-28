import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Member, Expense, Balance } from '@/types'

interface MoneyState {
  members: Member[]
  expenses: Expense[]
  loading: boolean
}

const initialState: MoneyState = {
  members: [],
  expenses: [],
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

      // Đánh dấu các expense chưa settled của member cho đến khi hết số tiền
      const unsettledExpenses = state.expenses
        .filter(e => e.splitBetween.includes(memberId) && !e.settled)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      for (const expense of unsettledExpenses) {
        if (remaining <= 0) break
        const share = expense.amount / expense.splitBetween.length
        if (remaining >= share) {
          expense.settled = true
          remaining -= share
        }
      }
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
  setLoading,
} = moneySlice.actions

export default moneySlice.reducer

// Selectors
export const calculateBalances = (members: Member[], expenses: Expense[]): Balance[] => {
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

  // Calculate balance
  Object.values(balances).forEach(balance => {
    balance.balance = balance.totalPaid - balance.totalOwed
  })

  return Object.values(balances)
}
