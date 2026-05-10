import { decryptFileGamma, encryptFileGamma } from "./file"
import { gammaDecrypt, gammaEncrypt } from "./text"

export const gammaEncryption = (text, key, type = "encrypt") => {
  if (type === "encrypt") {
    return gammaEncrypt(text, key)
  }
  return gammaDecrypt(text, key)
}

export const gammaEncryptionFile = (file, key, type = "encrypt") => {
  if (type === "encrypt") {
    encryptFileGamma(file, key)
  } else {
    decryptFileGamma(file, key)
  }
}
