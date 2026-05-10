import { Link } from 'react-router-dom'
import styles from './index.module.css'

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to='/'>
        <p className={styles.title}>Encod</p>
      </Link>
    </header>
  )
}