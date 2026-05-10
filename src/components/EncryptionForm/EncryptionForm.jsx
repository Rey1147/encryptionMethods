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
}) => {
  const [inputMode, setInputMode] = useState(INPUT_MODE_TEXT)
  const [key, setKey] = useState("")
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)

  const run = () => {
    void Promise.resolve(
      onProcess({
        inputMode,
        key,
        text,
        file,
        featureEnabled: featureToggle ? featureToggle.checked : false,
      }),
    ).catch((err) => {
      console.error(err)
    })
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
        <Input
          type="text"
          placeholder="Ключ"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
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
