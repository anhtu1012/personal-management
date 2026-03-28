import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number): string {
  if (amount >= 1000000) {
    return `${Math.floor(amount / 1000000)}tr`
  }
  return amount.toLocaleString('vi-VN')
}
