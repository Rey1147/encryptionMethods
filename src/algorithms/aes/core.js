import { concatParts } from "./bytes"

export const SALT_BYTES = 16
export const IV_BYTES = 12
export const PBKDF2_ITERATIONS = 200000
export const AES_KEY_BITS = 256

export const assertSubtle = () => {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Web Crypto API недоступен. Откройте приложение по HTTPS или через localhost."
    )
  }
}

const deriveAesKey = async (password, salt) => {
  assertSubtle()
  const subtle = crypto.subtle
  const enc = new TextEncoder()
  const material = await subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: AES_KEY_BITS },
    false,
    ["encrypt", "decrypt"],
  )
}

export const aesEncryptBuffer = async (plaintext, password) => {
  if (!password?.length) throw new Error("Пустой ключ")
  const subtle = crypto.subtle
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveAesKey(password, salt)
  const ctBuf = await subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext)
  const cipher = new Uint8Array(ctBuf)
  return concatParts(salt, iv, cipher)
}

export const aesDecryptBuffer = async (packed, password) => {
  if (!password?.length) throw new Error("Пустой ключ")
  const min = SALT_BYTES + IV_BYTES + 16
  if (packed.length < min) throw new Error("Неверный формат шифра")
  const salt = packed.subarray(0, SALT_BYTES)
  const iv = packed.subarray(SALT_BYTES, SALT_BYTES + IV_BYTES)
  const cipher = packed.subarray(SALT_BYTES + IV_BYTES)
  const key = await deriveAesKey(password, salt)
  assertSubtle()
  const ptBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher)
  return new Uint8Array(ptBuf)
}
