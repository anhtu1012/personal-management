/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { X, Download } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"

export function InstallPWABanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isInstalled) {
      return
    }

    // Check if user dismissed banner before
    const dismissed = localStorage.getItem('pwa-banner-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show banner after 3 seconds
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && !isInstalled) {
      setTimeout(() => {
        setShowBanner(true)
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowBanner(false)
    } else {
      // For iOS or browsers without install prompt
      alert(
        'Để cài đặt app:\n\n' +
        '1. Nhấn nút Share (biểu tượng chia sẻ)\n' +
        '2. Chọn "Add to Home Screen"\n' +
        '3. Nhấn "Add"\n\n' +
        'Sau đó mở app từ Home screen để nhận thông báo!'
      )
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString())
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-x-4 bottom-24 z-60 mx-auto max-w-md sm:bottom-6"
        >
          <div className="rounded-2xl border border-emerald-300/60 bg-emerald-50/95 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500">
                <Download size={20} weight="bold" className="text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-bold text-emerald-900">
                  Cài đặt app để nhận thông báo
                </h3>
                <p className="mt-1 text-xs text-emerald-700">
                  Nhận thông báo ngay cả khi app đóng. Chỉ mất 5 giây!
                </p>
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Cài đặt ngay
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Để sau
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="shrink-0 rounded-lg p-1 transition-colors hover:bg-emerald-200"
              >
                <X size={16} weight="bold" className="text-emerald-700" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
