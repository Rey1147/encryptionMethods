import { useState } from "react"
import { Form } from "react-router-dom"
import { permutationEncryption } from "../../algorithms/permutationEncryption"
import { Input } from "../../view/Input/Input"
import { Textarea } from "../../view/Input/Textarea"
import { Button } from "../../view/Button/Button"
import styles from "./index.module.css"

export const PermutationEncryptionPage = () => {
  const [key, setKey] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState('') 

  const encod = (text, key, type) => {    
    const resultEncod = permutationEncryption(text, key, type)
    if (resultEncod === result) return
    setResult(resultEncod)
  }

  return (
    <section>
      <h2 className={styles.title}>Метод шифрования перестановочным шифром</h2>
      <div className={styles.encrypt}>
        <h3 className={styles.encrypt__title}>Шифрование</h3>
        <Form 
          className={styles.encrypt__form}
          onSubmit={() => encod(text, key, 'encrypt')}
        >
          <Textarea
            type="text"
            placeholder="Текст"
            name="Текст для шифрования"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Ключ"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <Button type="button" onClick={() => encod(text, key, 'encrypt')}>Шифровать</Button>
        </Form>
        {Boolean(result) &&
          <div className={styles.encrypt__result}>
            <p>Результат:</p>
            <p>{result}</p>
          </div>
        }
      </div>
    </section>
  )
}
