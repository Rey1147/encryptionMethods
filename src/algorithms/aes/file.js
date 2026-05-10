import { aesDecryptBuffer, aesEncryptBuffer } from "./core"

const downloadBlob = (data, filename, type = "application/octet-stream") => {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const encryptFileAes = (file, password) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!password?.length) {
    alert("Введите ключ")
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const plain = new Uint8Array(e.target.result)
      const packed = await aesEncryptBuffer(plain, password)
      downloadBlob(packed, "encrypted.aes")
    } catch (err) {
      alert(err?.message ?? "Ошибка шифрования файла")
    }
  }
  reader.readAsArrayBuffer(file)
}

export const decryptFileAes = (file, password) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!password?.length) {
    alert("Введите ключ")
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const packed = new Uint8Array(e.target.result)
      const plain = await aesDecryptBuffer(packed, password)
      downloadBlob(plain, "decrypted.bin")
    } catch (err) {
      alert(err?.message ?? "Ошибка дешифрования (ключ или файл)")
    }
  }
  reader.readAsArrayBuffer(file)
}
