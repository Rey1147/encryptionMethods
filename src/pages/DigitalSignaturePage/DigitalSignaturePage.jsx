import { useState } from "react"
import {
  exportPrivateJwkJson,
  exportPublicJwkJson,
  generateEcdsaKeyPair,
  importPrivateKeyFromJwkString,
  importPublicKeyFromJwkString,
  signData,
  verifyData,
} from "../../algorithms/digitalSignature"
import { Button } from "../../view/Button/Button"
import styles from "./index.module.css"

const downloadText = (content, filename, mime = "application/json") => {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadBuffer = (buf, filename) => {
  const blob = new Blob([buf], { type: "application/octet-stream" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsText(file, "utf-8")
  })

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(r.error)
    r.readAsArrayBuffer(file)
  })

export const DigitalSignaturePage = () => {
  const [keyGenMessage, setKeyGenMessage] = useState("")
  const [signMessage, setSignMessage] = useState("")
  const [verifyResult, setVerifyResult] = useState(null)

  const [signFile, setSignFile] = useState(null)
  const [signKeyFile, setSignKeyFile] = useState(null)

  const [verifyFile, setVerifyFile] = useState(null)
  const [verifySigFile, setVerifySigFile] = useState(null)
  const [verifyPubFile, setVerifyPubFile] = useState(null)

  const handleGenerateKeys = async () => {
    setKeyGenMessage("")
    try {
      const pair = await generateEcdsaKeyPair()
      const pub = await exportPublicJwkJson(pair.publicKey)
      const prv = await exportPrivateJwkJson(pair.privateKey)
      downloadText(pub, "ecdsa-public.jwk", "application/json")
      downloadText(prv, "ecdsa-private.jwk", "application/json")
      setKeyGenMessage("Скачаны файлы ecdsa-public.jwk и ecdsa-private.jwk (храните закрытый ключ в секрете).")
    } catch (e) {
      alert(e?.message ?? "Ошибка генерации ключей")
    }
  }

  const handleSign = async () => {
    setSignMessage("")
    if (!signFile || !signKeyFile) {
      alert("Выберите файл для подписи и файл закрытого ключа (.jwk)")
      return
    }
    try {
      const data = await readFileAsArrayBuffer(signFile)
      const jwkText = await readFileAsText(signKeyFile)
      const privateKey = await importPrivateKeyFromJwkString(jwkText)
      const sig = await signData(privateKey, data)
      downloadBuffer(sig, `${signFile.name}.sig`)
      setSignMessage(`Создан файл подписи: ${signFile.name}.sig`)
    } catch (e) {
      alert(e?.message ?? "Ошибка подписи")
    }
  }

  const handleVerify = async () => {
    setVerifyResult(null)
    if (!verifyFile || !verifySigFile || !verifyPubFile) {
      alert("Нужны три файла: исходный, подпись (.sig), открытый ключ (.jwk)")
      return
    }
    try {
      const data = await readFileAsArrayBuffer(verifyFile)
      const sigBuf = await readFileAsArrayBuffer(verifySigFile)
      const pubText = await readFileAsText(verifyPubFile)
      const publicKey = await importPublicKeyFromJwkString(pubText)
      const ok = await verifyData(publicKey, sigBuf, data)
      setVerifyResult(ok)
    } catch (e) {
      setVerifyResult(null)
      alert(e?.message ?? "Ошибка проверки (ключ, подпись или формат файла)")
    }
  }

  return (
    <section>
      <h2 className={styles.title}>Электронно-цифровая подпись</h2>
      <aside className={styles.spec} aria-label="Параметры ЭЦП">
        <p className={styles.specLead}>Реализация в браузере (Web Crypto API):</p>
        <div className={styles.specChips}>
          <span className={styles.chip}>
            <strong>ECDSA</strong>
            <span className={styles.chipMuted}>кривая P-256</span>
          </span>
          <span className={styles.chip}>
            Хэш — <strong>SHA-256</strong>
          </span>
          <span className={styles.chip}>
            Ключи — <strong>JWK</strong>
            <span className={styles.chipMuted}>JSON</span>
          </span>
          <span className={styles.chip}>
            Подпись — <strong>.sig</strong>
            <span className={styles.chipMuted}>бинарный файл</span>
          </span>
        </div>
      </aside>

      <div className={styles.wrapper}>
        <h3 className={styles.sectionTitle}>1. Генерация пары ключей</h3>
        <p className={styles.hint}>
          Создаётся новая пара и сразу скачиваются два файла. Для проверки подписи достаточно открытого ключа.
        </p>
        <Button type="button" onClick={() => void handleGenerateKeys()}>
          Сгенерировать и скачать ключи
        </Button>
        {keyGenMessage ? <p className={styles.statusOk}>{keyGenMessage}</p> : null}
      </div>

      <div className={styles.wrapper}>
        <h3 className={styles.sectionTitle}>2. Формирование подписи файла</h3>
        <div className={styles.row}>
          <label className={styles.label}>
            Файл для подписи
            <input
              className={styles.fileInput}
              type="file"
              onChange={(e) => setSignFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className={styles.label}>
            Закрытый ключ (ecdsa-private.jwk)
            <input
              className={styles.fileInput}
              type="file"
              accept=".jwk,.json,application/json"
              onChange={(e) => setSignKeyFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button type="button" onClick={() => void handleSign()}>
            Подписать и скачать .sig
          </Button>
          {signMessage ? <p className={styles.statusOk}>{signMessage}</p> : null}
        </div>
      </div>

      <div className={styles.wrapper}>
        <h3 className={styles.sectionTitle}>3. Проверка подписи файла</h3>
        <div className={styles.row}>
          <label className={styles.label}>
            Исходный файл (тот же байтовый состав, что при подписи)
            <input
              className={styles.fileInput}
              type="file"
              onChange={(e) => setVerifyFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className={styles.label}>
            Файл подписи (.sig)
            <input
              className={styles.fileInput}
              type="file"
              accept=".sig,application/octet-stream,*/*"
              onChange={(e) => setVerifySigFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className={styles.label}>
            Открытый ключ (ecdsa-public.jwk)
            <input
              className={styles.fileInput}
              type="file"
              accept=".jwk,.json,application/json"
              onChange={(e) => setVerifyPubFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button type="button" onClick={() => void handleVerify()}>
            Проверить подпись
          </Button>
          {verifyResult === true ? (
            <p className={styles.statusOk}>Подпись действительна.</p>
          ) : null}
          {verifyResult === false ? (
            <p className={styles.statusBad}>Подпись недействительна или данные изменены.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
