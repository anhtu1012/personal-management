// Haptic feedback utilities for mobile
export const haptics = {
  light: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  },

  medium: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(20)
    }
  },

  heavy: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(30)
    }
  },

  success: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 50, 10])
    }
  },

  error: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([20, 100, 20, 100, 20])
    }
  },

  selection: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(5)
    }
  },
}
