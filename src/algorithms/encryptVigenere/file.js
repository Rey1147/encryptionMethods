import {
  decryptVigenere,
  decryptVigenereAutokey,
  encryptVigenere,
  encryptVigenereAutokey,
} from "./text"

const downloadFileVigenere = (content, filename) => {
  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const encryptWithOptions = (text, key, options = {}) => {
  return options.autokey === true
    ? encryptVigenereAutokey(text, key)
    : encryptVigenere(text, key)
}

const decryptWithOptions = (text, key, options = {}) => {
  return options.autokey === true
    ? decryptVigenereAutokey(text, key)
    : decryptVigenere(text, key)
}

export const encryptFileVigenere = (file, key, options = {}) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const text = event.target.result
    const encrypted = encryptWithOptions(text, key, options)
    downloadFileVigenere(encrypted, "encrypted.txt")
  }

  reader.readAsText(file)
}

export const decryptFileVigenere = (file, key, options = {}) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const text = event.target.result
    const decrypted = decryptWithOptions(text, key, options)
    downloadFileVigenere(decrypted, "decrypted.txt")
  }

  reader.readAsText(file)
}
