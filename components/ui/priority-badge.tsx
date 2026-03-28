import { Priority } from "@/types"
import { cn } from "@/lib/utils"
import { ArrowUp, Minus, ArrowDown } from "@phosphor-icons/react"

interface PriorityBadgeProps {
  priority?: Priority
  size?: "sm" | "md" | "lg"
}

export function PriorityBadge({ priority = "medium", size = "md" }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: "h-5 w-5 text-[10px]",
    md: "h-6 w-6 text-xs",
    lg: "h-7 w-7 text-sm",
  }

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  const config = {
    high: {
      bg: "bg-red-500",
      text: "text-red-700",
      icon: ArrowUp,
      label: "Cao",
    },
    medium: {
      bg: "bg-amber-500",
      text: "text-amber-700",
      icon: Minus,
      label: "TB",
    },
    low: {
      bg: "bg-blue-500",
      text: "text-blue-700",
      icon: ArrowDown,
      label: "Thấp",
    },
  }

  const { bg, icon: Icon } = config[priority]

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        bg,
        sizeClasses[size]
      )}
      title={config[priority].label}
    >
      <Icon size={iconSize[size]} weight="bold" className="text-white" />
    </div>
  )
}
