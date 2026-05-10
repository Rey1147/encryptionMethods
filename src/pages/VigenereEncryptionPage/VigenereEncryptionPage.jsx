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
  const [autokey, setAutokey] = useState(false)

  const encode = ({ inputMode, key, text, file, featureEnabled }) => {
    const opts = { autokey: featureEnabled === true }
    if (inputMode === INPUT_MODE_FILE) {
      vigenereEncryptionFile(file, key, "encrypt", opts)
      return
    }

    const result = vigenereEncryption(text, key, "encrypt", opts)
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decode = ({ inputMode, key, text, file, featureEnabled }) => {
    const opts = { autokey: featureEnabled === true }
    if (inputMode === INPUT_MODE_FILE) {
      vigenereEncryptionFile(file, key, "decrypt", opts)
      return
    }

    const result = vigenereEncryption(text, key, "decrypt", opts)
    if (result === resultDecod) return
    setResultDecod(result)
  }

  const toggleProps = {
    label: "Автоключевой режим",
    checked: autokey,
    onChange: setAutokey,
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
          featureToggle={toggleProps}
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
          featureToggle={toggleProps}
        />
      </div>
    </section>
  )
}
