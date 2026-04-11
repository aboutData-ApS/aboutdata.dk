'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableFieldProps {
  value: string
  onChange: (v: string) => void
  as?: 'input' | 'textarea'
  className?: string
  rows?: number
  placeholder?: string
  style?: React.CSSProperties
}

export default function EditableField({
  value,
  onChange,
  as = 'input',
  className = '',
  rows = 3,
  placeholder = '',
  style,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  const displayClass = `${className} cursor-text rounded outline-dashed outline-1 outline-transparent hover:outline-blue-300 transition-[outline-color] px-0.5 -mx-0.5`

  if (!editing) {
    return (
      <span
        className={displayClass}
        style={style}
        onClick={() => setEditing(true)}
        title="Klik for at redigere"
      >
        {value || <span className="opacity-30 italic">{placeholder}</span>}
      </span>
    )
  }

  if (as === 'textarea') {
    return (
      <textarea
        ref={ref}
        value={value}
        rows={rows}
        placeholder={placeholder}
        className={`${className} w-full rounded border border-blue-400 bg-blue-50/40 px-1 -mx-0.5 outline-none ring-2 ring-blue-200 resize-none`}
        style={style}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
      />
    )
  }

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      placeholder={placeholder}
      className={`${className} rounded border border-blue-400 bg-blue-50/40 px-1 -mx-0.5 outline-none ring-2 ring-blue-200`}
      style={{ ...style, width: `max(${Math.max(value.length, placeholder.length, 4)}ch, 60px)` }}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false) }}
    />
  )
}
