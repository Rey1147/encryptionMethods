import { useState } from "react"
import { Input } from "../../view/Input/Input"
import { Textarea } from "../../view/Input/Textarea"
import { Button } from "../../view/Button/Button"
import { Select } from "../../view/Select/Select"
import { Checkbox } from "../../view/Checkbox/Checkbox"
import {
  INPUT_MODE_FILE,
  INPUT_MODE_TEXT,
} from "./constants"
import styles from "./index.module.css"

const INPUT_MODE_OPTIONS = [
  { value: INPUT_MODE_TEXT, label: "Текст" },
  { value: INPUT_MODE_FILE, label: "Файл" },
]

export const EncryptionForm = ({
  title,
  submitLabel,
  textareaName,
  fileInputLabel,
  textPlaceholder = "Текст",
  modeSelectTitle = "Выберите тип данных: текст или файл",
  accept = ".txt,text/plain",
  onProcess,
  result = "",
  className,
  headingClassName,
  featureToggle,
  /** Многострочный ключ (например JWK JSON для RSA) */
  keyMultiline = false,
  keyLabel = "Ключ",
  keyPlaceholder = "Ключ",
  keyRows = 6,
  /** Ключ задаётся файлом .jwk (содержимое читается как UTF-8) */
  keyFromFile = false,
  keyFileLabel = "Файл ключа (JWK)",
  keyFileAccept = ".jwk,.json,application/json",
}) => {
  const [inputMode, setInputMode] = useState(INPUT_MODE_TEXT)
  const [key, setKey] = useState("")
  const [keyFile, setKeyFile] = useState(null)
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)

  const readKeyFileAsText = (f) =>
    new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = () => reject(r.error)
      r.readAsText(f, "utf-8")
    })

  const run = () => {
    void (async () => {
      try {
        let keyPayload = key
        if (keyFromFile) {
          if (!keyFile) {
            alert("Выберите файл ключа")
            return
          }
          keyPayload = (await readKeyFileAsText(keyFile)).trim()
          if (!keyPayload) {
            alert("Файл ключа пуст")
            return
          }
        }
        await Promise.resolve(
          onProcess({
            inputMode,
            key: keyPayload,
            text,
            file,
            featureEnabled: featureToggle ? featureToggle.checked : false,
          }),
        )
      } catch (err) {
        console.error(err)
      }
    })()
  }

  return (
    <div className={[styles.section, className].filter(Boolean).join(" ")}>
      <div className={styles.form__header}>
        <h3 className={[styles.heading, headingClassName].filter(Boolean).join(" ")}>
          {title}
        </h3>
        <Select
          options={INPUT_MODE_OPTIONS}
          value={inputMode}
          onChange={setInputMode}
          title={modeSelectTitle}
        />
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          run()
        }}
      >
        {inputMode === INPUT_MODE_TEXT ? (
          <Textarea
            type="text"
            placeholder={textPlaceholder}
            name={textareaName}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        ) : (
          <label className={styles.fileInput__label}>
            {fileInputLabel}
            <input
              className={styles.fileInput}
              type="file"
              accept={accept}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
        )}
        {keyFromFile ? (
          <label className={styles.fileInput__label}>
            {keyFileLabel}
            <input
              className={styles.fileInput}
              type="file"
              accept={keyFileAccept}
              onChange={(e) => setKeyFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
        ) : keyMultiline ? (
          <Textarea
            type="text"
            name={keyLabel}
            placeholder={keyPlaceholder}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            rows={keyRows}
          />
        ) : (
          <Input
            type="text"
            name={keyLabel}
            placeholder={keyPlaceholder}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
        )}
        {featureToggle ? (
          <Checkbox
            checked={featureToggle.checked}
            onChange={featureToggle.onChange}
          >
            {featureToggle.label}
          </Checkbox>
        ) : null}
        <Button type="button" onClick={run}>
          {submitLabel}
        </Button>
      </form>
      {inputMode === INPUT_MODE_TEXT && Boolean(result) && (
        <div className={styles.result}>
          <p>Результат:</p>
          <p className={styles.result_text}>{result}</p>
        </div>
      )}
    </div>
  )
}
