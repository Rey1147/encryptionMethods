import { decryptFileVigenere, encryptFileVigenere } from "./file"
import { decryptVigenere, encryptVigenere } from "./text"

export const vigenereEncryption = (text, key, type = "encrypt") => {
  if (type === "encrypt") {
    return encryptVigenere(text, key)
  }
  return decryptVigenere(text, key)
}

export const vigenereEncryptionFile = (file, key, type = "encrypt") => {
  if (type === "encrypt") {
    encryptFileVigenere(file, key)
  } else {
    decryptFileVigenere(file, key)
  }
}
