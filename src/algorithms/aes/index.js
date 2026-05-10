import { decryptFileAes, encryptFileAes } from "./file"
import { aesDecryptText, aesEncryptText } from "./text"

export async function aesEncryption(text, password, type = "encrypt") {
  if (type === "encrypt") {
    return aesEncryptText(text, password)
  }
  return aesDecryptText(text, password)
}

export function aesEncryptionFile(file, password, type = "encrypt") {
  if (type === "encrypt") {
    encryptFileAes(file, password)
  } else {
    decryptFileAes(file, password)
  }
}
