import {
  decryptBytes,
  encryptBytes,
  expandKey,
} from "./core"

export function bytesToBase64(u8) {
  let bin = ""
  for (let i = 0; i < u8.length; i++) {
    bin += String.fromCharCode(u8[i])
  }
  return btoa(bin)
}

export function base64ToBytes(b64) {
  const trimmed = String(b64).replace(/\s/g, "")
  const bin = atob(trimmed)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i)
  }
  return out
}

export function feistelEncryptText(text, key) {
  if (typeof text !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }
  try {
    const subkeys = expandKey(key)
    const data = new TextEncoder().encode(text)
    const cipher = encryptBytes(data, subkeys)
    return bytesToBase64(cipher)
  } catch {
    return ""
  }
}

export function feistelDecryptText(base64Cipher, key) {
  if (typeof base64Cipher !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }
  try {
    const subkeys = expandKey(key)
    const cipher = base64ToBytes(base64Cipher)
    const plain = decryptBytes(cipher, subkeys)
    return new TextDecoder().decode(plain)
  } catch {
    return ""
  }
}
