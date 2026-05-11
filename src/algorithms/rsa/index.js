import { decryptFileRsa, encryptFileRsa } from "./file"
import { rsaDecryptText, rsaEncryptText } from "./text"

export async function rsaEncryption(text, publicOrPrivateJwk, type = "encrypt") {
  if (type === "encrypt") {
    return rsaEncryptText(text, publicOrPrivateJwk)
  }
  return rsaDecryptText(text, publicOrPrivateJwk)
}

export function rsaEncryptionFile(file, jwkString, type = "encrypt") {
  if (type === "encrypt") {
    encryptFileRsa(file, jwkString)
  } else {
    decryptFileRsa(file, jwkString)
  }
}

export {
  AES_SESSION_KEY_BYTES,
  IV_BYTES,
  RSA_CIPHER_BYTES,
  RSA_MODULUS_BITS,
  assertSubtle,
  exportPrivateJwkJson,
  exportPublicJwkJson,
  generateRsaKeyPair,
  importPrivateKeyForDecrypt,
  importPublicKeyForEncrypt,
  rsaHybridDecrypt,
  rsaHybridEncrypt,
} from "./core"
