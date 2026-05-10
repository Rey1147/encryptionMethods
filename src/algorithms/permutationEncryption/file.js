import { decrypt, encrypt } from "./text"

function downloadFile(content, filename) {
  const blob = new Blob(
    [content],
    { type: "text/plain;charset=utf-8" }
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


export const encryptFile = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const text = event.target.result
    const encryptedText = encrypt(text, key)
    downloadFile(encryptedText, "encrypted.txt")
    return
  }

  reader.readAsText(file)
}

export const decryptFile = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const text = event.target.result
    const decryptedText = decrypt(text, key)
    downloadFile(decryptedText, "decrypted.txt")
  }

  reader.readAsText(file)
}
