import { encryptVigenere, decryptVigenere } from "./text"

const downloadFileVigenere = (content, filename) => {
  const blob = new Blob(
    [content],
    {
      type: "text/plain;charset=utf-8"
    }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const encryptFileVigenere = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function(event) {
    const text = event.target.result
    const encrypted = encryptVigenere(text, key)
    downloadFileVigenere(encrypted, "encrypted.txt")
  }

  reader.readAsText(file)
}

export const decryptFileVigenere = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function(event) {
    const text = event.target.result
    const decrypted = decryptVigenere(text, key)
    downloadFileVigenere(decrypted, "decrypted.txt")
  }

  reader.readAsText(file)
}
