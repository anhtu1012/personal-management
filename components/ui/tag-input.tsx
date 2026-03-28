"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Thêm tag...",
  maxTags = 10,
}: TagInputProps) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onChange([...tags, trimmed])
      setInput("")
    }
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-300/60 bg-white/75 p-2">
      <AnimatePresence>
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-slate-900"
            >
              <X size={12} weight="bold" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      {tags.length < maxTags && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-slate-400",
            tags.length === 0 && "w-full"
          )}
        />
      )}
    </div>
  )
}
