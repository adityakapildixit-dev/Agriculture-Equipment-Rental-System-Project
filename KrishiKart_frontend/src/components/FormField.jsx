import React from 'react'

export function TextField({ label, name, value, onChange, type = 'text', required, placeholder, step, error }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="field-input"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function SelectField({ label, name, value, onChange, options, required, error }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        className="field-input"
      >
        <option value="" disabled>Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function TextAreaField({ label, name, value, onChange, required, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="field-input resize-none"
      />
    </div>
  )
}
