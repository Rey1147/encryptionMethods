import { decryptFileGamma, encryptFileGamma } from "./file"
import {
  gammaDecrypt,
  gammaDecryptLfsr,
  gammaEncrypt,
  gammaEncryptLfsr,
} from "./text"

export const gammaEncryption = (text, key, type = "encrypt", options = {}) => {
  const useLfsr = options.useLfsr === true
  if (type === "encrypt") {
    return useLfsr ? gammaEncryptLfsr(text, key) : gammaEncrypt(text, key)
  }
  return useLfsr ? gammaDecryptLfsr(text, key) : gammaDecrypt(text, key)
}

export const gammaEncryptionFile = (file, key, type = "encrypt", options = {}) => {
  if (type === "encrypt") {
    encryptFileGamma(file, key, options)
  } else {
    decryptFileGamma(file, key, options)
  }
}
