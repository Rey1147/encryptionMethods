import { uint8ToBase64, base64ToUint8 } from "../aes/bytes"
import {
  importPrivateKeyForDecrypt,
  importPublicKeyForEncrypt,
  rsaHybridDecrypt,
  rsaHybridEncrypt,
} from "./core"

export async function rsaEncryptText(text, publicJwkString) {
  if (typeof text !== "string" || typeof publicJwkString !== "string" || !publicJwkString.trim()) {
    throw new Error("Укажите текст и открытый ключ (JWK)")
  }
  try {
    const pub = await importPublicKeyForEncrypt(publicJwkString.trim())
    const plain = new TextEncoder().encode(text)
    const packed = await rsaHybridEncrypt(plain, pub)
    return uint8ToBase64(packed)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка шифрования RSA"
    throw new Error(msg, { cause: e })
  }
}

export async function rsaDecryptText(base64Packed, privateJwkString) {
  if (
    typeof base64Packed !== "string" ||
    typeof privateJwkString !== "string" ||
    !privateJwkString.trim()
  ) {
    throw new Error("Укажите шифротекст (Base64) и закрытый ключ (JWK)")
  }
  if (!String(base64Packed).replace(/\s/g, "").length) {
    throw new Error("Пустой шифротекст")
  }
  try {
    const prv = await importPrivateKeyForDecrypt(privateJwkString.trim())
    const packed = base64ToUint8(base64Packed)
    const plain = await rsaHybridDecrypt(packed, prv)
    return new TextDecoder().decode(plain)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка дешифрования RSA"
    throw new Error(msg, { cause: e })
  }
}
