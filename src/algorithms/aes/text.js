import { base64ToUint8, uint8ToBase64 } from "./bytes"
import { aesDecryptBuffer, aesEncryptBuffer } from "./core"

export async function aesEncryptText(text, password) {
  if (typeof text !== "string" || typeof password !== "string" || !password.length) {
    return ""
  }
  const enc = new TextEncoder()
  const plain = enc.encode(text)
  const packed = await aesEncryptBuffer(plain, password)
  return uint8ToBase64(packed)
}

export async function aesDecryptText(base64Packed, password) {
  if (
    typeof base64Packed !== "string" ||
    typeof password !== "string" ||
    !password.length
  ) {
    return ""
  }
  const packed = base64ToUint8(base64Packed)
  const plain = await aesDecryptBuffer(packed, password)
  return new TextDecoder().decode(plain)
}
