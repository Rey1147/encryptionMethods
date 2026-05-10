import { gammaDecrypt, gammaEncrypt } from "./text"

const downloadFile = (content, filename) => {
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

  link.click()
  URL.revokeObjectURL(url)
}

export const encryptFileGamma = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function(event) {
    const text = event.target.result
    const encrypted = gammaEncrypt(text, key)
    downloadFile(encrypted,"encrypted.txt")
  }

  reader.readAsText(file)
}

export const decryptFileGamma = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function(event) {
    const binary = event.target.result
    const decrypted = gammaDecrypt(binary, key)
    downloadFile(decrypted, "decrypted.txt")
  }

  reader.readAsText(file)
}
