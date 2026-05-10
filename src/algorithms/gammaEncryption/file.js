import {
  gammaDecrypt,
  gammaDecryptLfsr,
  gammaEncrypt,
  gammaEncryptLfsr,
} from "./text"

const downloadFile = (content, filename) => {
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
  return options.useLfsr === true
    ? gammaEncryptLfsr(text, key)
    : gammaEncrypt(text, key)
}

const decryptWithOptions = (text, key, options = {}) => {
  return options.useLfsr === true
    ? gammaDecryptLfsr(text, key)
    : gammaDecrypt(text, key)
}

export const encryptFileGamma = (file, key, options = {}) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const text = event.target.result
    const encrypted = encryptWithOptions(text, key, options)
    downloadFile(encrypted, "encrypted.txt")
  }

  reader.readAsText(file)
}

export const decryptFileGamma = (file, key, options = {}) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const binary = event.target.result
    const decrypted = decryptWithOptions(binary, key, options)
    downloadFile(decrypted, "decrypted.txt")
  }

  reader.readAsText(file)
}
