import { generateLfsrBitString } from "../lfsr.js"

const BITS_PER_UNIT = 16

export const textToBinary = (text) => {
  let binary = ""
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    binary += code.toString(2).padStart(BITS_PER_UNIT, "0")
  }

  return binary
}

export const binaryToText = (binary) => {
  let text = ""
  for (let i = 0; i < binary.length; i += BITS_PER_UNIT) {
    const chunk = binary.slice(i, i + BITS_PER_UNIT)
    if (chunk.length < BITS_PER_UNIT) break
    const code = parseInt(chunk, 2)
    if (Number.isNaN(code)) break
    text += String.fromCharCode(code)
  }

  return text
}

export const xorBinary = (binaryText, binaryKey) => {
  if (!binaryKey.length) {
    return ""
  }

  let result = ""
  for (let i = 0; i < binaryText.length; i++) {
    const keyBit = binaryKey[i % binaryKey.length]
    result += binaryText[i] === keyBit ? "0" : "1"
  }

  return result
}

export const gammaEncrypt = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  const binaryText = textToBinary(text)
  const binaryKey = textToBinary(key)
  return xorBinary(binaryText, binaryKey)
}

export const gammaDecrypt = (binaryCipher, key) => {
  if (typeof binaryCipher !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  const clean = binaryCipher.replace(/[^01]/g, "")
  const binaryKey = textToBinary(key)
  const decryptedBinary = xorBinary(clean, binaryKey)

  return binaryToText(decryptedBinary)
}

export const gammaEncryptLfsr = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  const binaryText = textToBinary(text)
  const lfsrGamma = generateLfsrBitString(key, binaryText.length)
  return xorBinary(binaryText, lfsrGamma)
}

export const gammaDecryptLfsr = (binaryCipher, key) => {
  if (typeof binaryCipher !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  const clean = binaryCipher.replace(/[^01]/g, "")
  if (!clean.length) return ""

  const lfsrGamma = generateLfsrBitString(key, clean.length)
  const decryptedBinary = xorBinary(clean, lfsrGamma)

  return binaryToText(decryptedBinary)
}
