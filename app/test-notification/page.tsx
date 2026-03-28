"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, CheckCircle, XCircle } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { notifications } from "@/lib/notifications"

export default function TestNotificationPage() {
  const router = useRouter()
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  )
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleRequestPermission = async () => {
    addResult("Đang yêu cầu quyền thông báo...")
    const granted = await notifications.requestPermission()
    setPermissionStatus(Notification.permission)
    
    if (granted) {
      addResult("✅ Đã cấp quyền thông báo!")
    } else {
      addResult("❌ Người dùng từ chối quyền thông báo")
    }
  }

  const handleTestImmediate = () => {
    addResult("Đang gửi thông báo ngay lập tức...")
    
    if (Notification.permission !== "granted") {
      addResult("❌ Chưa có quyền thông báo. Vui lòng bật trước.")
      return
    }

    notifications.show("🎉 Test Thông Báo", {
      body: "Đây là thông báo test. Nếu bạn thấy được thì đã thành công!",
      icon: "/image/logo.png",
      badge: "/image/logo.png",
      requireInteraction: false,
    })

    addResult("✅ Đã gửi thông báo. Kiểm tra màn hình!")
  }

  const handleTest5Seconds = () => {
    addResult("Sẽ gửi thông báo sau 5 giây...")
    
    if (Notification.permission !== "granted") {
      addResult("❌ Chưa có quyền thông báo. Vui lòng bật trước.")
      return
    }

    setTimeout(() => {
      notifications.show("⏰ Thông Báo 5 Giây", {
        body: "Đã đủ 5 giây! Thông báo hoạt động tốt.",
        icon: "/image/logo.png",
        badge: "/image/logo.png",
        requireInteraction: true,
      })
      addResult("✅ Đã gửi thông báo sau 5 giây")
    }, 5000)
  }

  const handleTest30Seconds = () => {
    addResult("Sẽ gửi thông báo sau 30 giây...")
    
    if (Notification.permission !== "granted") {
      addResult("❌ Chưa có quyền thông báo. Vui lòng bật trước.")
      return
    }

    setTimeout(() => {
      notifications.show("⏰ Thông Báo 30 Giây", {
        body: "Đã đủ 30 giây! Hệ thống hoạt động hoàn hảo.",
        icon: "/image/logo.png",
        badge: "/image/logo.png",
        requireInteraction: true,
      })
      addResult("✅ Đã gửi thông báo sau 30 giây")
    }, 30000)
  }

  const handleTestScheduled = () => {
    const now = new Date()
    const testTime = new Date(now.getTime() + 10000) // 10 seconds from now
    const testDateTime = testTime.toISOString()
    
    addResult(`Đang lên lịch thông báo cho ${testTime.toLocaleTimeString()}...`)
    
    if (Notification.permission !== "granted") {
      addResult("❌ Chưa có quyền thông báo. Vui lòng bật trước.")
      return
    }

    notifications.scheduleTaskReminder("Test Task - Scheduled", testDateTime)
    addResult("✅ Đã lên lịch thông báo. Đợi 10 giây...")
  }

  const handleCheckReminders = () => {
    const reminders = localStorage.getItem("task_reminders")
    if (reminders) {
      const parsed = JSON.parse(reminders) as Array<{
        id: string
        title: string
        time: string
        scheduled: string
      }>
      addResult(`📋 Có ${parsed.length} reminder đang chờ:`)
      parsed.forEach((r) => {
        addResult(`  - ${r.title} lúc ${new Date(r.time).toLocaleString()}`)
      })
    } else {
      addResult("📋 Không có reminder nào")
    }
  }

  const handleClearResults = () => {
    setTestResults([])
  }

  const getPermissionColor = () => {
    switch (permissionStatus) {
      case "granted":
        return "text-emerald-600"
      case "denied":
        return "text-red-600"
      case "default":
        return "text-amber-600"
      default:
        return "text-slate-600"
    }
  }

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case "granted":
        return <CheckCircle size={24} weight="fill" className="text-emerald-600" />
      case "denied":
        return <XCircle size={24} weight="fill" className="text-red-600" />
      default:
        return <Bell size={24} weight="regular" className="text-amber-600" />
    }
  }

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-sky -top-16 -left-8 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-indigo top-30 -right-10 h-44 w-44 sm:h-56 sm:w-56" />

      <div className="liquid-container relative z-10 w-full max-w-2xl space-y-4">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.back()}
            className="liquid-panel rounded-xl p-2"
          >
            <ArrowLeft size={20} weight="bold" className="text-slate-700" />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="liquid-panel flex size-10 items-center justify-center rounded-2xl">
              <Bell size={22} weight="fill" className="text-slate-700" />
            </div>
            <h1 className="liquid-title text-2xl font-bold tracking-tight sm:text-3xl">
              Test Thông Báo
            </h1>
          </div>
        </motion.header>

        <GlassCard variant="strong" className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Trạng thái quyền</h3>
              <p className={`text-lg font-bold ${getPermissionColor()}`}>
                {permissionStatus === "granted" && "✅ Đã cấp quyền"}
                {permissionStatus === "denied" && "❌ Đã từ chối"}
                {permissionStatus === "default" && "⚠️ Chưa yêu cầu"}
                {permissionStatus === "unsupported" && "❌ Không hỗ trợ"}
              </p>
            </div>
            {getPermissionIcon()}
          </div>

          {permissionStatus !== "granted" && (
            <button
              onClick={handleRequestPermission}
              className="w-full rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              🔔 Yêu cầu quyền thông báo
            </button>
          )}
        </GlassCard>

        <GlassCard variant="strong" className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Các test thông báo</h3>
          <div className="space-y-2">
            <button
              onClick={handleTestImmediate}
              disabled={permissionStatus !== "granted"}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
            >
              ⚡ Test ngay lập tức
            </button>
            
            <button
              onClick={handleTest5Seconds}
              disabled={permissionStatus !== "granted"}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
            >
              ⏱️ Test sau 5 giây
            </button>

            <button
              onClick={handleTest30Seconds}
              disabled={permissionStatus !== "granted"}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
            >
              ⏰ Test sau 30 giây
            </button>

            <button
              onClick={handleTestScheduled}
              disabled={permissionStatus !== "granted"}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
            >
              📅 Test scheduled (10 giây)
            </button>

            <button
              onClick={handleCheckReminders}
              className="w-full rounded-xl border border-blue-300/60 bg-blue-50 px-4 py-2.5 text-left text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              📋 Kiểm tra reminders
            </button>
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Kết quả test</h3>
            {testResults.length > 0 && (
              <button
                onClick={handleClearResults}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Xóa
              </button>
            )}
          </div>
          
          <div className="max-h-60 space-y-1 overflow-y-auto rounded-lg bg-slate-50 p-3">
            {testResults.length === 0 ? (
              <p className="text-center text-xs text-slate-500">
                Chưa có kết quả test nào
              </p>
            ) : (
              testResults.map((result, index) => (
                <p key={index} className="text-xs font-mono text-slate-700">
                  {result}
                </p>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="mb-2 text-sm font-semibold">💡 Hướng dẫn</h3>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>1. Nhấn &quot;Yêu cầu quyền thông báo&quot; và cho phép</li>
            <li>2. Chọn một trong các test button</li>
            <li>3. Đợi và kiểm tra thông báo xuất hiện</li>
            <li>4. Nếu không thấy, kiểm tra settings trình duyệt</li>
            <li>5. Trên mobile, đảm bảo không ở chế độ im lặng</li>
          </ul>
        </GlassCard>

        <GlassCard className="border-amber-200 bg-amber-50/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">⚠️ Lưu ý</h3>
          <ul className="space-y-1 text-xs text-amber-700">
            <li>• Giữ tab này mở khi test</li>
            <li>• Không minimize trình duyệt</li>
            <li>• Trên iOS cần cài PWA (Add to Home Screen)</li>
            <li>• Một số trình duyệt chặn thông báo mặc định</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
