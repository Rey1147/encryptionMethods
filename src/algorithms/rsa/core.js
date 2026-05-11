import { concatParts } from "../aes/bytes"

export const RSA_MODULUS_BITS = 2048
export const RSA_CIPHER_BYTES = RSA_MODULUS_BITS / 8
export const AES_SESSION_KEY_BYTES = 32
export const IV_BYTES = 12

const RSA_GEN_ALG = {
  name: "RSA-OAEP",
  modulusLength: RSA_MODULUS_BITS,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
}

const RSA_OAEP_PARAMS = { name: "RSA-OAEP", hash: "SHA-256" }
const RSA_OAEP_IMPORT_ALG = { name: "RSA-OAEP", hash: "SHA-256" }

export const assertSubtle = () => {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Web Crypto API недоступен. Используйте HTTPS или localhost.",
    )
  }
}

export const generateRsaKeyPair = async () => {
  assertSubtle()
  return crypto.subtle.generateKey(RSA_GEN_ALG, true, ["encrypt", "decrypt"])
}

export const exportPublicJwkJson = async (publicKey) => {
  const jwk = await crypto.subtle.exportKey("jwk", publicKey)
  return JSON.stringify(jwk, null, 2)
}

export const exportPrivateJwkJson = async (privateKey) => {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey)
  return JSON.stringify(jwk, null, 2)
}

export const importPublicKeyForEncrypt = async (jwkString) => {
  assertSubtle()
  const jwk = JSON.parse(jwkString)
  return crypto.subtle.importKey("jwk", jwk, RSA_OAEP_IMPORT_ALG, false, ["encrypt"])
}

export const importPrivateKeyForDecrypt = async (jwkString) => {
  assertSubtle()
  const jwk = JSON.parse(jwkString)
  return crypto.subtle.importKey("jwk", jwk, RSA_OAEP_IMPORT_ALG, false, ["decrypt"])
}

export const importAesSessionKey = async (raw32) => {
  assertSubtle()
  return crypto.subtle.importKey(
    "raw",
    raw32,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

export const rsaHybridEncrypt = async (plainBytes, publicKey) => {
  assertSubtle()
  const sessionKeyPlain = crypto.getRandomValues(new Uint8Array(AES_SESSION_KEY_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))

  const aesKey = await importAesSessionKey(sessionKeyPlain)
  const aesCtBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plainBytes,
  )
  const aesCipher = new Uint8Array(aesCtBuf)

  const rsaCtBuf = await crypto.subtle.encrypt(
    RSA_OAEP_PARAMS,
    publicKey,
    sessionKeyPlain,
  )
  const rsaCipher = new Uint8Array(rsaCtBuf)
  if (rsaCipher.length !== RSA_CIPHER_BYTES) {
    throw new Error("Неожиданная длина RSA-блока (ожидается ключ 2048 бит)")
  }

  return concatParts(rsaCipher, iv, aesCipher)
}

export const rsaHybridDecrypt = async (packedBytes, privateKey) => {
  assertSubtle()
  const min = RSA_CIPHER_BYTES + IV_BYTES + 16
  if (packedBytes.length < min) {
    throw new Error("Неверный формат пакета")
  }

  const rsaCipher = packedBytes.subarray(0, RSA_CIPHER_BYTES)
  const iv = packedBytes.subarray(RSA_CIPHER_BYTES, RSA_CIPHER_BYTES + IV_BYTES)
  const aesCipher = packedBytes.subarray(RSA_CIPHER_BYTES + IV_BYTES)

  const skBuf = await crypto.subtle.decrypt(RSA_OAEP_PARAMS, privateKey, rsaCipher)
  const sessionKeyPlain = new Uint8Array(skBuf)
  if (sessionKeyPlain.length !== AES_SESSION_KEY_BYTES) {
    throw new Error("Неверный сессионный ключ после RSA")
  }

  const aesKey = await importAesSessionKey(sessionKeyPlain)
  const ptBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    aesCipher,
  )
  return new Uint8Array(ptBuf)
}
