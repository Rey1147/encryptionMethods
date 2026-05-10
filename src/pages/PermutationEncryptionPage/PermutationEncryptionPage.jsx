import { useState } from "react"
import {
  permutationEncryption,
  permutationEncryptionFile,
} from "../../algorithms/permutationEncryption"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import styles from "./index.module.css"

export const PermutationEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")

  const encod = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      permutationEncryptionFile(file, key, "encrypt")
      return
    }

    const result = permutationEncryption(text, key, "encrypt")
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decod = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      permutationEncryptionFile(file, key, "decrypt")
      return
    }

    const result = permutationEncryption(text, key, "decrypt")
    if (result === resultDecod) return
    setResultDecod(result)
  }

  return (
    <section>
      <h2 className={styles.title}>Метод шифрования перестановочным шифром</h2>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Шифрование"
          submitLabel="Шифровать"
          textareaName="Текст для шифрования"
          fileInputLabel="Файл для шифрования"
          onProcess={encod}
          result={resultEncod}
        />
      </div>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Дешифрование"
          submitLabel="Дешифровать"
          textareaName="Текст для дешифрования"
          fileInputLabel="Файл для дешифрования"
          onProcess={decod}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
