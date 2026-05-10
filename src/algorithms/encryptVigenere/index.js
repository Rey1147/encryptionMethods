import { decryptFileVigenere, encryptFileVigenere } from "./file"
import {
  decryptVigenere,
  decryptVigenereAutokey,
  encryptVigenere,
  encryptVigenereAutokey,
} from "./text"

/**
 * @param {object} [options]
 * @param {boolean} [options.autokey] — автоключевой режим Виженера
 */
export const vigenereEncryption = (text, key, type = "encrypt", options = {}) => {
  const autokey = options.autokey === true
  if (type === "encrypt") {
    return autokey ? encryptVigenereAutokey(text, key) : encryptVigenere(text, key)
  }
  return autokey ? decryptVigenereAutokey(text, key) : decryptVigenere(text, key)
}

export const vigenereEncryptionFile = (file, key, type = "encrypt", options = {}) => {
  if (type === "encrypt") {
    encryptFileVigenere(file, key, options)
  } else {
    decryptFileVigenere(file, key, options)
  }
}
