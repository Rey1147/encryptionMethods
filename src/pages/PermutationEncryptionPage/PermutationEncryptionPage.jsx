import { useState } from "react"
import { Form } from "react-router-dom"
import {
  permutationEncryption,
  permutationEncryptionFile,
} from "../../algorithms/permutationEncryption"
import { Input } from "../../view/Input/Input"
import { Textarea } from "../../view/Input/Textarea"
import { Button } from "../../view/Button/Button"
import styles from "./index.module.css"

const MODE_TEXT = 'text'
const MODE_FILE = 'file'

const ModeSelect = ({ value, onChange }) => (
  <select
    className={styles.modeSelect}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    title="Выберите тип данных: текст или файл"
  >
    <option value={MODE_TEXT}>Текст</option>
    <option value={MODE_FILE}>Файл</option>
  </select>
)

export const PermutationEncryptionPage = () => {
  const [encodMode, setEncodMode] = useState(MODE_TEXT)
  const [decodMode, setDecodMode] = useState(MODE_TEXT)

  const [keyEncod, setKeyEncod] = useState('')
  const [textEncod, setTextEncod] = useState('')
  const [fileEncod, setFileEncod] = useState(null)

  const [keyDecod, setKeyDecod] = useState('')
  const [textDecod, setTextDecod] = useState('')
  const [fileDecod, setFileDecod] = useState(null)

  const [resultEncod, setResultEncod] = useState('')
  const [resultDecod, setResultDecod] = useState('')

  const encod = () => {
    if (encodMode === MODE_FILE) {
      permutationEncryptionFile(fileEncod, keyEncod, 'encrypt')
      return
    }

    const result = permutationEncryption(textEncod, keyEncod, 'encrypt')
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decod = () => {
    if (decodMode === MODE_FILE) {
      permutationEncryptionFile(fileDecod, keyDecod, 'decrypt')
      return
    }

    const result = permutationEncryption(textDecod, keyDecod, 'decrypt')
    if (result === resultDecod) return
    setResultDecod(result)
  }

  // TODO: вынести форму с состояниями в отдельный компонент

  return (
    <section>
      <h2 className={styles.title}>Метод шифрования перестановочным шифром</h2>
      <div className={styles.wrapper}>
        <div className={styles.encrypt}>
          <div className={styles.form__header}>
            <h3 className={styles.encrypt__title}>Шифрование</h3>
            <ModeSelect value={encodMode} onChange={setEncodMode} />
          </div>
          <Form
            className={styles.encrypt__form}
            onSubmit={encod}
          >
            {encodMode === MODE_TEXT ? (
              <Textarea
                type="text"
                placeholder="Текст"
                name="Текст для шифрования"
                value={textEncod}
                onChange={(e) => setTextEncod(e.target.value)}
                required
              />
            ) : (
              <label className={styles.fileInput__label}>
                Файл для шифрования
                <input
                  className={styles.fileInput}
                  type="file"
                  accept=".txt,text/plain"
                  onChange={(e) => setFileEncod(e.target.files?.[0] ?? null)}
                  required
                />
              </label>
            )}
            <Input
              type="text"
              placeholder="Ключ"
              value={keyEncod}
              onChange={(e) => setKeyEncod(e.target.value)}
              required
            />
            <Button type="button" onClick={encod}>Шифровать</Button>
          </Form>
          {encodMode === MODE_TEXT && Boolean(resultEncod) &&
            <div className={styles.encrypt__result}>
              <p>Результат:</p>
              <p className={styles.encrypt__result_text}>{resultEncod}</p>
            </div>
          }
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.decrypt}>
          <div className={styles.form__header}>
            <h3 className={styles.decrypt__title}>Дешифрование</h3>
            <ModeSelect value={decodMode} onChange={setDecodMode} />
          </div>
          <Form
            className={styles.encrypt__form}
            onSubmit={decod}
          >
            {decodMode === MODE_TEXT ? (
              <Textarea
                type="text"
                placeholder="Текст"
                name="Текст для дешифрования"
                value={textDecod}
                onChange={(e) => setTextDecod(e.target.value)}
                required
              />
            ) : (
              <label className={styles.fileInput__label}>
                Файл для дешифрования
                <input
                  className={styles.fileInput}
                  type="file"
                  accept=".txt,text/plain"
                  onChange={(e) => setFileDecod(e.target.files?.[0] ?? null)}
                  required
                />
              </label>
            )}
            <Input
              type="text"
              placeholder="Ключ"
              value={keyDecod}
              onChange={(e) => setKeyDecod(e.target.value)}
              required
            />
            <Button type="button" onClick={decod}>Дешифровать</Button>
          </Form>
          {decodMode === MODE_TEXT && Boolean(resultDecod) &&
            <div className={styles.encrypt__result}>
              <p>Результат:</p>
              <p className={styles.encrypt__result_text}>{resultDecod}</p>
            </div>
          }
        </div>
      </div>
    </section>
  )
}
