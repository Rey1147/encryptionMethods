import styles from './index.module.css'

export const Textarea = (props) => {
  return (
    <label 
      for={props?.name}
      className={styles.textarea__label}
    >
      {props.name}
      <textarea
        className={styles.input && props?.className}
        type={props?.type}
        name={props?.name}
        placeholder={props?.placeholder}
        value={props?.value}
        onChange={props.onChange}
        required={props?.required}
        rows={props?.rows}
        spellCheck={props?.spellCheck ?? false}
        autoCorrect={props?.autoCorrect ?? "off"}
        autoCapitalize={props?.autoCapitalize ?? "off"}
      />
    </label>
  )
}