import { useState } from "react"
import { permutationEncryption } from "../algorithms/permutationEncryption"

export const PermutationEncryptionPage = () => {
  const [key, setKey] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState('') 

  const encod = (text, key, type) => {
    const result = permutationEncryption(text, key, type)
    setResult(result)
  }

  return (
    <section>
      <h2>Метод шифрования перестановочным шифром</h2>

      <div>
        <h3>Шифрование</h3>
        <div>
          <input 
            type="text"
            placeholder="Ключ"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <input 
            type="text"
            placeholder="Текст"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button type="button" onClick={() => encod(text, key, 'encrypt')}>Шифровать</button>

        <div>
          <p>Результат:</p>
          {result && <p>{result}</p>}
        </div>
      </div>
    </section>
  )
}
