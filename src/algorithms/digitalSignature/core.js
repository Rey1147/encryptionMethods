const ECDSA_ALG = { name: "ECDSA", namedCurve: "P-256" }
const SIGN_ALG = { name: "ECDSA", hash: "SHA-256" }

export function assertSubtle() {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Web Crypto API недоступен. Используйте HTTPS или localhost.",
    )
  }
}

export async function generateEcdsaKeyPair() {
  assertSubtle()
  return crypto.subtle.generateKey(ECDSA_ALG, true, ["sign", "verify"])
}

export async function exportPublicJwkJson(publicKey) {
  const jwk = await crypto.subtle.exportKey("jwk", publicKey)
  return JSON.stringify(jwk, null, 2)
}

export async function exportPrivateJwkJson(privateKey) {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey)
  return JSON.stringify(jwk, null, 2)
}

export async function importPublicKeyFromJwkString(json) {
  assertSubtle()
  const jwk = JSON.parse(json)
  return crypto.subtle.importKey("jwk", jwk, ECDSA_ALG, false, ["verify"])
}

export async function importPrivateKeyFromJwkString(json) {
  assertSubtle()
  const jwk = JSON.parse(json)
  return crypto.subtle.importKey("jwk", jwk, ECDSA_ALG, false, ["sign"])
}

export async function signData(privateKey, data) {
  assertSubtle()
  return crypto.subtle.sign(SIGN_ALG, privateKey, data)
}

export async function verifyData(publicKey, signature, data) {
  assertSubtle()
  return crypto.subtle.verify(SIGN_ALG, publicKey, signature, data)
}
