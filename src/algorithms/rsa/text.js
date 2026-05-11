import { uint8ToBase64, base64ToUint8 } from "../aes/bytes"
import {
  importPrivateKeyForDecrypt,
  importPublicKeyForEncrypt,
  rsaHybridDecrypt,
  rsaHybridEncrypt,
} from "./core"

export async function rsaEncryptText(text, publicJwkString) {
  if (typeof text !== "string" || typeof publicJwkString !== "string" || !publicJwkString.trim()) {
    return ""
  }
  try {
    const pub = await importPublicKeyForEncrypt(publicJwkString.trim())
    const plain = new TextEncoder().encode(text)
    const packed = await rsaHybridEncrypt(plain, pub)
    return uint8ToBase64(packed)
  } catch {
    return ""
  }
}

export async function rsaDecryptText(base64Packed, privateJwkString) {
  if (
    typeof base64Packed !== "string" ||
    typeof privateJwkString !== "string" ||
    !privateJwkString.trim()
  ) {
    return ""
  }
  try {
    const prv = await importPrivateKeyForDecrypt(privateJwkString.trim())
    const packed = base64ToUint8(base64Packed)
    const plain = await rsaHybridDecrypt(packed, prv)
    return new TextDecoder().decode(plain)
  } catch {
    return ""
  }
}
