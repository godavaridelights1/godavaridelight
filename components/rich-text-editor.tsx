"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, FileText } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  name?: string
  required?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  id,
  name,
  required = false,
  className = ""
}: RichTextEditorProps) {
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(id || "editor") as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || "text"
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newValue)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const insertBulletPoint = () => {
    const textarea = document.getElementById(id || "editor") as HTMLTextAreaElement
    const start = textarea.selectionStart
    const textBefore = value.substring(0, start)
    const textAfter = value.substring(start)
    
    // Check if we're at the start of a line
    const lastNewline = textBefore.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    const isStartOfLine = start === lineStart || start === 0
    
    let newValue: string
    if (isStartOfLine) {
      newValue = textBefore + "• " + textAfter
    } else {
      newValue = textBefore + "\n• " + textAfter
    }
    
    onChange(newValue)
    setTimeout(() => {
      const newPosition = isStartOfLine ? start + 2 : textBefore.length + 2
      textarea.focus()
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-1 flex-wrap bg-slate-100 dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setIsBold(!isBold)
            insertMarkdown("**", "**")
          }}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setIsItalic(!isItalic)
            insertMarkdown("_", "_")
          }}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="border-r border-slate-300 dark:border-slate-700"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertBulletPoint}
          className="h-8 w-8 p-0"
          title="Bullet Point"
        >
          <List className="h-4 w-4" />
        </Button>

        <div className="border-r border-slate-300 dark:border-slate-700"></div>

        <span className="text-xs text-muted-foreground flex items-center px-2">
          Supports Markdown
        </span>
      </div>

      <Textarea
        id={id || "editor"}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`resize-vertical min-h-32 font-mono text-sm ${className}`}
      />

      <p className="text-xs text-muted-foreground">
        Markdown formatting supported: **bold**, _italic_, • bullet points
      </p>
    </div>
  )
}
