import { Link, Outlet } from "react-router-dom"
import { Header } from "./components/Header/Header"
import styles from './main.module.css'

const navigation = [
  { title: 'Метод перестановки', link: '/permutation' },
  { title: 'Полиалфавитный шифр Виженера', link: '/vigenere' },
  { title: 'Гаммирование', link: '/gamma' },
  { title: 'Автоключевое шифрование', link: '/' }
]

function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <nav className={styles.navigate}>
          <ul>
            {navigation.map((item) => (
              <li id="key">
                <Link to={item.link}>
                  <p className={styles.list__item}>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section className={styles.children}>
          <Outlet />
        </section>
      </main>
    </>
  )
}

export default App
