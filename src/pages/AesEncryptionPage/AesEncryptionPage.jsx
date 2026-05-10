import { useState } from "react"
import {
  AES_KEY_BITS,
  IV_BYTES,
  PBKDF2_ITERATIONS,
  SALT_BYTES,
  aesEncryption,
  aesEncryptionFile,
} from "../../algorithms/aes"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import styles from "./index.module.css"

export const AesEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")

  const encode = async ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      aesEncryptionFile(file, key, "encrypt")
      return
    }

    try {
      const result = await aesEncryption(text, key, "encrypt")
      if (result !== resultEncod) setResultEncod(result)
    } catch (err) {
      alert(err?.message ?? "Ошибка шифрования")
    }
  }

  const decode = async ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      aesEncryptionFile(file, key, "decrypt")
      return
    }

    try {
      const result = await aesEncryption(text, key, "decrypt")
      if (result !== resultDecod) setResultDecod(result)
    } catch (err) {
      alert(err?.message ?? "Ошибка дешифрования")
    }
  }

  return (
    <section>
      <h2 className={styles.title}>AES</h2>
      <aside className={styles.spec} aria-label="Параметры AES">
        <p className={styles.specLead}>Реализация в браузере (стандартная библиотека):</p>
        <div className={styles.specChips}>
          <span className={styles.chip}>
            <strong>AES-{AES_KEY_BITS}</strong>
            <span className={styles.chipMuted}>GCM</span>
          </span>
          <span className={styles.chip}>
            Ключ из пароля — <strong>PBKDF2</strong>
            <span className={styles.chipMuted}>· {PBKDF2_ITERATIONS} ит.</span>
          </span>
          <span className={styles.chip}>
            Соль {SALT_BYTES} B · IV {IV_BYTES} B
          </span>
          <span className={styles.chip}>
            Текст → <strong>Base64</strong>
          </span>
          <span className={styles.chip}>
            Файл → <strong>.aes</strong> / <strong>decrypted.bin</strong>
          </span>
        </div>
      </aside>
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
          textareaName="Шифротекст (Base64)"
          fileInputLabel="Файл encrypted.aes"
          accept=".aes,.bin,application/octet-stream,*.*"
          onProcess={decode}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
