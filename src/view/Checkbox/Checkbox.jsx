import styles from "./index.module.css"

export function Checkbox({
  checked,
  onChange,
  children,
  disabled = false,
  className,
  id,
}) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.labelText}>{children}</span>
    </label>
  )
}
