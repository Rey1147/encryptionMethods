import styles from './index.module.css'

export const Input = (props) => {
  return (
    <>
      <label 
        for={props?.name}
        className={styles.input__label}
      >
        {props.name}
        <input
          className={styles.input && props?.className}
          type={props?.type}
          name={props?.name}
          placeholder={props?.placeholder}
          value={props?.value}
          onChange={props.onChange}
          required={props?.required}
        />
      </label>
    </>
  )
}