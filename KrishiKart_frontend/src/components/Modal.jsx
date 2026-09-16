import React, { useEffect } from 'react'
import { IconClose } from './icons'

export default function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-moss-950/50" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-xl shadow-xl my-8 animate-[fadeIn_.15s_ease-out]`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-moss-100">
          <h3 className="font-display text-base font-semibold text-moss-950">{title}</h3>
          <button onClick={onClose} className="text-moss-400 hover:text-moss-700 p-1 rounded-md hover:bg-moss-50">
            <IconClose />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
