import { useState } from "react"
import {
  BLOCK_BYTES,
  FEISTEL_ROUNDS,
  feistelEncryption,
  feistelEncryptionFile,
} from "../../algorithms/feistel"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import styles from "./index.module.css"

export const FeistelEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")

  const encode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      feistelEncryptionFile(file, key, "encrypt")
      return
    }

    const result = feistelEncryption(text, key, "encrypt")
    if (result === resultEncod) return
    setResultEncod(result)
  }

  const decode = ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      feistelEncryptionFile(file, key, "decrypt")
      return
    }

    const result = feistelEncryption(text, key, "decrypt")
    if (result === resultDecod) return
    setResultDecod(result)
  }

  return (
    <section>
      <h2 className={styles.title}>Сеть Фейстеля</h2>
      <aside className={styles.spec} aria-label="Параметры шифра">
        <p className={styles.specLead}>Формат данных в этой версии приложения:</p>
        <div className={styles.specChips}>
          <span className={styles.chip}>
            Блок {BLOCK_BYTES} байт{' '}
            <span className={styles.chipMuted}>· 32+32 бит</span>
          </span>
          <span className={styles.chip}>{FEISTEL_ROUNDS} раундов</span>
          <span className={styles.chip}>
            Текст → <strong>Base64</strong>
          </span>
          <span className={styles.chip}>
            Файл → <strong>PKCS#7</strong>, бинарь
          </span>
        </div>
      </aside>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Шифрование"
          submitLabel="Шифровать"
          textareaName="Текст для шифрования"
          fileInputLabel="Файл для шифрования (любой тип)"
          onProcess={encode}
          result={resultEncod}
        />
      </div>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Дешифрование"
          submitLabel="Дешифровать"
          textareaName="Шифротекст (Base64)"
          fileInputLabel="Зашифрованный бинарный файл (.feistel)"
          accept=".feistel,.bin,application/octet-stream,*.*"
          onProcess={decode}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
