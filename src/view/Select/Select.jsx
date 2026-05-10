import styles from "./index.module.css"

export function Select({
  options = [],
  value,
  onChange,
  title,
  className,
  ...rest
}) {
  return (
    <select
      className={[styles.select, className].filter(Boolean).join(" ")}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      title={title}
      {...rest}
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
