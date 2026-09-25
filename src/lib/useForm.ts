import { useCallback, useMemo, useState } from 'react'

export type Validator = (v: string) => string | null

export const required: Validator = v => (v.trim() ? null : 'This field is mandatory')
export const email: Validator = v =>
  !v.trim() ? 'This field is mandatory' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter a valid email address'
export const phone: Validator = v =>
  !v.trim() ? 'This field is mandatory' : v.replace(/\D/g, '').length >= 7 ? null : 'Enter a valid phone number'
export const postcode: Validator = v =>
  !v.trim() ? 'This field is mandatory' : /^\d{3}\s?\d{2,3}$/.test(v.trim()) ? null : 'Enter a valid postcode'
export const cardNumber: Validator = v =>
  !v.trim() ? 'This field is mandatory' : v.replace(/\D/g, '').length === 16 ? null : 'Card number should have 16 digits'
export const cvv: Validator = v => (!v.trim() ? 'This field is mandatory' : /^\d{3,4}$/.test(v) ? null : 'Enter 3 digits')
export const expiry: Validator = v => {
  if (!v.trim()) return 'This field is mandatory'
  const m = v.match(/^(\d{2})\s?\/\s?(\d{2,4})$/)
  if (!m) return 'Use MM / YYYY'
  const month = +m[1]
  const year = +(m[2].length === 2 ? `20${m[2]}` : m[2])
  if (month < 1 || month > 12) return 'Use MM / YYYY'
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1) ? null : 'This card has expired'
}

/** Minimal form state: values, blur-touched fields and a "submitted" flag that reveals every error. */
export function useForm<K extends string>(initial: Record<K, string>, rules: Partial<Record<K, Validator>>) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const e = {} as Record<K, string | null>
    for (const k of Object.keys(values) as K[]) e[k] = rules[k]?.(values[k]) ?? null
    return e
  }, [values, rules])

  const isValid = useMemo(() => (Object.keys(errors) as K[]).every(k => !errors[k]), [errors])

  const bind = useCallback(
    (k: K) => ({
      value: values[k],
      onChange: (v: string) => setValues(prev => ({ ...prev, [k]: v })),
      onBlur: () => setTouched(t => ({ ...t, [k]: true })),
      error: (submitted || touched[k]) && values[k] !== undefined ? errors[k] : null,
      valid: !errors[k] && !!values[k]?.trim(),
    }),
    [values, errors, touched, submitted],
  )

  return { values, setValues, errors, isValid, bind, submitted, submit: () => setSubmitted(true), reset: () => setSubmitted(false) }
}

export const formatCard = (v: string) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 6)
  return d.length <= 2 ? d : `${d.slice(0, 2)} / ${d.slice(2)}`
}
