import { decryptBytes, encryptBytes, expandKey } from "./core"

const downloadBin = (u8, filename) => {
  const blob = new Blob([u8], { type: "application/octet-stream" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const encryptFileFeistel = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!key?.length) {
    alert("Введите ключ")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const buf = new Uint8Array(e.target.result)
      const subkeys = expandKey(key)
      const cipher = encryptBytes(buf, subkeys)
      downloadBin(cipher, "encrypted.feistel")
    } catch {
      alert("Ошибка шифрования файла")
    }
  }
  reader.readAsArrayBuffer(file)
}

export const decryptFileFeistel = (file, key) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!key?.length) {
    alert("Введите ключ")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const buf = new Uint8Array(e.target.result)
      const subkeys = expandKey(key)
      const plain = decryptBytes(buf, subkeys)
      downloadBin(plain, "decrypted.bin")
    } catch {
      alert("Ошибка дешифрования: неверный ключ или повреждённый файл")
    }
  }
  reader.readAsArrayBuffer(file)
}
