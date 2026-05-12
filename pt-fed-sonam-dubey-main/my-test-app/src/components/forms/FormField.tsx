import type { ReactNode } from 'react'

interface FormFieldProps {
  htmlFor: string
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ htmlFor, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
