import { useState } from "react"
import {
  RSA_CIPHER_BYTES,
  RSA_MODULUS_BITS,
  exportPrivateJwkJson,
  exportPublicJwkJson,
  generateRsaKeyPair,
  rsaEncryption,
  rsaEncryptionFile,
} from "../../algorithms/rsa"
import { EncryptionForm } from "../../components/EncryptionForm/EncryptionForm"
import { INPUT_MODE_FILE } from "../../components/EncryptionForm/constants"
import { Button } from "../../view/Button/Button"
import styles from "./index.module.css"

export const RsaEncryptionPage = () => {
  const [resultEncod, setResultEncod] = useState("")
  const [resultDecod, setResultDecod] = useState("")
  const [keyGenMsg, setKeyGenMsg] = useState("")

  const downloadText = (content, filename) => {
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerateKeys = async () => {
    setKeyGenMsg("")
    try {
      const pair = await generateRsaKeyPair()
      const pub = await exportPublicJwkJson(pair.publicKey)
      const prv = await exportPrivateJwkJson(pair.privateKey)
      downloadText(pub, "rsa-public.jwk")
      downloadText(prv, "rsa-private.jwk")
      setKeyGenMsg("Скачаны rsa-public.jwk и rsa-private.jwk. Для шифрования используйте public, для расшифровки — private.")
    } catch (e) {
      alert(e?.message ?? "Ошибка генерации ключей RSA")
    }
  }

  const encode = async ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      rsaEncryptionFile(file, key, "encrypt")
      return
    }
    try {
      const result = await rsaEncryption(text, key, "encrypt")
      if (result !== resultEncod) setResultEncod(result)
    } catch (e) {
      alert(e?.message ?? "Ошибка шифрования")
    }
  }

  const decode = async ({ inputMode, key, text, file }) => {
    if (inputMode === INPUT_MODE_FILE) {
      rsaEncryptionFile(file, key, "decrypt")
      return
    }
    try {
      const result = await rsaEncryption(text, key, "decrypt")
      if (result !== resultDecod) setResultDecod(result)
    } catch (e) {
      alert(e?.message ?? "Ошибка дешифрования")
    }
  }

  return (
    <section>
      <h2 className={styles.title}>RSA</h2>
      <aside className={styles.spec} aria-label="Параметры RSA">
        <p className={styles.specLead}>Реализация в браузере (Web Crypto API):</p>
        <div className={styles.specChips}>
          <span className={styles.chip}>
            <strong>RSA-OAEP</strong>
            <span className={styles.chipMuted}>SHA-256 · {RSA_MODULUS_BITS} бит</span>
          </span>
          <span className={styles.chip}>
            Длинные данные — <strong>гибрид</strong>
            <span className={styles.chipMuted}>RSA({RSA_CIPHER_BYTES} B) + AES-256-GCM</span>
          </span>
          <span className={styles.chip}>
            Текст → <strong>Base64</strong>
          </span>
          <span className={styles.chip}>
            Файл → <strong>.rsa</strong> / <strong>decrypted.bin</strong>
          </span>
        </div>
      </aside>

      <div className={styles.keygen}>
        <p className={styles.keygenHint}>
          Ключи в формате JWK (JSON). Укажите файлы <code>rsa-public.jwk</code> /{' '}
          <code>rsa-private.jwk</code> в форме ниже или сгенерируйте новую пару.
        </p>
        <Button type="button" onClick={() => void handleGenerateKeys()}>
          Сгенерировать пару RSA и скачать JWK
        </Button>
        {keyGenMsg ? <p className={styles.specLead} style={{ marginTop: 10 }}>{keyGenMsg}</p> : null}
      </div>

      <div className={styles.wrapper}>
        <EncryptionForm
          title="Шифрование"
          submitLabel="Шифровать"
          textareaName="Текст для шифрования"
          fileInputLabel="Файл для шифрования"
          keyFromFile
          keyFileLabel="Открытый ключ (rsa-public.jwk)"
          onProcess={encode}
          result={resultEncod}
        />
      </div>
      <div className={styles.wrapper}>
        <EncryptionForm
          title="Дешифрование"
          submitLabel="Дешифровать"
          textareaName="Шифротекст (Base64)"
          fileInputLabel="Файл encrypted.rsa"
          accept=".rsa,.bin,application/octet-stream,*.*"
          keyFromFile
          keyFileLabel="Закрытый ключ (rsa-private.jwk)"
          onProcess={decode}
          result={resultDecod}
        />
      </div>
    </section>
  )
}
