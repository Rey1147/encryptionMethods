import { useState } from "react"
import {
  gammaEncryption,
  gammaEncryptionFile,
} from "../../algorithms/gammaEncryption"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import styles from "./index.module.css"

export const GammaEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")

  const encode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      gammaEncryptionFile(file, key, "encrypt")
      return
    }

    const result = gammaEncryption(text, key, "encrypt")
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      gammaEncryptionFile(file, key, "decrypt")
      return
    }

    const result = gammaEncryption(text, key, "decrypt")
    if (result === resultDecod) return
    setResultDecod(result)
  }

  return (
    <section>
      <h2 className={styles.title}>Гаммирование</h2>
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
          textareaName="Шифротекст (двоичная строка 0/1)"
          fileInputLabel="Файл с шифротекстом (текст из 0 и 1)"
          onProcess={decode}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
