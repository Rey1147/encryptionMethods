import { useState } from "react"
import {
  vigenereEncryption,
  vigenereEncryptionFile,
} from "../../algorithms/encryptVigenere"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import styles from "./index.module.css"

export const VigenereEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")

  const encode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      vigenereEncryptionFile(file, key, "encrypt")
      return
    }

    const result = vigenereEncryption(text, key, "encrypt")
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      vigenereEncryptionFile(file, key, "decrypt")
      return
    }

    const result = vigenereEncryption(text, key, "decrypt")
    if (result === resultDecod) return
    setResultDecod(result)
  }

  return (
    <section>
      <h2 className={styles.title}>Полиалфавитный шифр Виженера</h2>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Шифрование"
          submitLabel="Шифровать"
          textareaName="Текст для шифрования"
          fileInputLabel="Файл для шифрования"
          onProcess={encode}
          result={resultEncod}
        />
      </div>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Дешифрование"
          submitLabel="Дешифровать"
          textareaName="Текст для дешифрования"
          fileInputLabel="Файл для дешифрования"
          onProcess={decode}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
