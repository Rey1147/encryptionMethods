import styles from './index.module.css'

export const Button = ({ children, ...props }) => {
  console.log(props?.onClick);
  
  return (
    <button
      type={props?.type || 'button'}
      onClick={props?.onClick}
      className={styles.button && props.className}
    >
      {children}
    </button>
  )
}