const ALPH_UPPER = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
const ALPH_LOWER = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

const alphabetIndex = (char) => {
  let i = ALPH_UPPER.indexOf(char)
  if (i !== -1) return i
  i = ALPH_LOWER.indexOf(char)
  return i
}

const isLowerCase = (char) => ALPH_LOWER.indexOf(char) !== -1

const shiftKeyPosition = (keyChar) => {
  const kp = alphabetIndex(keyChar)
  return kp === -1 ? 0 : kp
}

export const encryptVigenere = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string") {
    return ""
  }

  let result = ""
  let keyIndex = 0
  const keyLen = key.length > 0 ? key.length : 1

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i]
    const textPos = alphabetIndex(textChar)

    if (textPos === -1) {
      result += textChar
      continue
    }

    const keyChar = key[keyIndex % keyLen]
    const keyPos = shiftKeyPosition(keyChar)

    const encryptedPos = (textPos + keyPos) % ALPH_UPPER.length

    result += isLowerCase(textChar)
      ? ALPH_LOWER[encryptedPos]
      : ALPH_UPPER[encryptedPos]
    keyIndex++
  }

  return result
}

export const decryptVigenere = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string") {
    return ""
  }

  let result = ""
  let keyIndex = 0
  const keyLen = key.length > 0 ? key.length : 1

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i]
    const textPos = alphabetIndex(textChar)

    if (textPos === -1) {
      result += textChar
      continue
    }

    const keyChar = key[keyIndex % keyLen]
    const keyPos = shiftKeyPosition(keyChar)

    const decryptedPos =
      (textPos - keyPos + ALPH_UPPER.length) % ALPH_UPPER.length

    result += isLowerCase(textChar)
      ? ALPH_LOWER[decryptedPos]
      : ALPH_UPPER[decryptedPos]
    keyIndex++
  }

  return result
}

const nthAlphaChar = (text, n) => {
  let count = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (alphabetIndex(ch) === -1) continue
    if (count === n) return ch
    count++
  }
  return null
}

export const encryptVigenereAutokey = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  let result = ""
  let alphaPos = 0
  const kl = key.length

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i]
    const textPos = alphabetIndex(textChar)

    if (textPos === -1) {
      result += textChar
      continue
    }

    const ksChar =
      alphaPos < kl
        ? key[alphaPos]
        : nthAlphaChar(text, alphaPos - kl)

    const keyPos = shiftKeyPosition(ksChar)
    const encryptedPos = (textPos + keyPos) % ALPH_UPPER.length

    result += isLowerCase(textChar)
      ? ALPH_LOWER[encryptedPos]
      : ALPH_UPPER[encryptedPos]
    alphaPos++
  }

  return result
}

export const decryptVigenereAutokey = (text, key) => {
  if (typeof text !== "string" || typeof key !== "string" || !key.length) {
    return ""
  }

  let result = ""
  let alphaPos = 0
  const kl = key.length
  const plainAlpha = []

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i]
    const textPos = alphabetIndex(textChar)

    if (textPos === -1) {
      result += textChar
      continue
    }

    const ksChar =
      alphaPos < kl ? key[alphaPos] : plainAlpha[alphaPos - kl]

    const keyPos = shiftKeyPosition(ksChar)
    const decryptedPos =
      (textPos - keyPos + ALPH_UPPER.length) % ALPH_UPPER.length

    const outChar = isLowerCase(textChar)
      ? ALPH_LOWER[decryptedPos]
      : ALPH_UPPER[decryptedPos]
    result += outChar
    plainAlpha.push(outChar)
    alphaPos++
  }

  return result
}
