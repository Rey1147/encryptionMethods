import {
  importPrivateKeyForDecrypt,
  importPublicKeyForEncrypt,
  rsaHybridDecrypt,
  rsaHybridEncrypt,
} from "./core"

const downloadBlob = (data, filename, type = "application/octet-stream") => {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const encryptFileRsa = (file, publicJwkString) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!publicJwkString?.trim()) {
    alert("Вставьте или загрузите открытый ключ (JWK)")
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const plain = new Uint8Array(e.target.result)
      const pub = await importPublicKeyForEncrypt(publicJwkString.trim())
      const packed = await rsaHybridEncrypt(plain, pub)
      downloadBlob(packed, "encrypted.rsa")
    } catch (err) {
      alert(err?.message ?? "Ошибка шифрования файла")
    }
  }
  reader.readAsArrayBuffer(file)
}

export const decryptFileRsa = (file, privateJwkString) => {
  if (!file) {
    alert("Выберите файл")
    return
  }
  if (!privateJwkString?.trim()) {
    alert("Вставьте или загрузите закрытый ключ (JWK)")
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const packed = new Uint8Array(e.target.result)
      const prv = await importPrivateKeyForDecrypt(privateJwkString.trim())
      const plain = await rsaHybridDecrypt(packed, prv)
      downloadBlob(plain, "decrypted.bin")
    } catch (err) {
      alert(err?.message ?? "Ошибка дешифрования (ключ или файл)")
    }
  }
  reader.readAsArrayBuffer(file)
}
