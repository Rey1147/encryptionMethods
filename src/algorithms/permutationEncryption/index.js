import { decryptFile, encryptFile } from "./file"
import { decrypt, encrypt } from "./text"

const DEFAULT_KEY='КОМБАЙН'

export const permutationEncryption = (text, key=DEFAULT_KEY, type='encrypt') => {
  if (type === 'encrypt') {
    return encrypt(text, key)
  } else {
    return decrypt(text, key)
  }
}

export const permutationEncryptionFile = (file, key=DEFAULT_KEY, type='encrypt') => {
  if (type === 'encrypt') {
    return encryptFile(file, key)
  } else {
    return decryptFile(file, key)
  }
}
