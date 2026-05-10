import { decryptFileFeistel, encryptFileFeistel } from "./file"
import { feistelDecryptText, feistelEncryptText } from "./text"

export const feistelEncryption = (text, key, type = "encrypt") => {
  if (type === "encrypt") {
    return feistelEncryptText(text, key)
  }
  return feistelDecryptText(text, key)
}

export const feistelEncryptionFile = (file, key, type = "encrypt") => {
  if (type === "encrypt") {
    encryptFileFeistel(file, key)
  } else {
    decryptFileFeistel(file, key)
  }
}

export {
  BLOCK_BYTES,
  FEISTEL_ROUNDS,
  expandKey,
  feistelDecryptBlock,
  feistelEncryptBlock,
  feistelF,
} from "./core"
