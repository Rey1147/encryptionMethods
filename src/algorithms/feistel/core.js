export const BLOCK_BYTES = 8
export const FEISTEL_ROUNDS = 16

export function feistelF(half, roundKey) {
  let x = (half ^ roundKey) >>> 0
  x = ((x << 13) | (x >>> 19)) >>> 0
  x = (x + roundKey) >>> 0
  x = ((x << 7) | (x >>> 25)) >>> 0
  return x >>> 0
}

export function expandKey(keyStr) {
  let s = 0
  const str = String(keyStr)
  for (let i = 0; i < str.length; i++) {
    s = (Math.imul(s, 31) + str.charCodeAt(i)) >>> 0
  }
  if (s === 0) s = 0x9e3779b9
  const keys = []
  for (let r = 0; r < FEISTEL_ROUNDS; r++) {
    s = (Math.imul(s, 1664525) + 1013904223 + r) >>> 0
    keys.push(s)
  }
  return keys
}

export function readU32BE(buf, offset) {
  return (
    ((buf[offset] << 24) | (buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3]) >>>
    0
  )
}

export function writeU32BE(buf, offset, v) {
  const x = v >>> 0
  buf[offset] = (x >>> 24) & 0xff
  buf[offset + 1] = (x >>> 16) & 0xff
  buf[offset + 2] = (x >>> 8) & 0xff
  buf[offset + 3] = x & 0xff
}

export function feistelEncryptBlock(block8, subkeys) {
  let L = readU32BE(block8, 0)
  let R = readU32BE(block8, 4)
  for (let i = 0; i < FEISTEL_ROUNDS; i++) {
    const nL = R >>> 0
    const nR = (L ^ feistelF(R, subkeys[i])) >>> 0
    L = nL
    R = nR
  }
  const out = new Uint8Array(BLOCK_BYTES)
  writeU32BE(out, 0, L)
  writeU32BE(out, 4, R)
  return out
}

export function feistelDecryptBlock(block8, subkeys) {
  let L = readU32BE(block8, 0)
  let R = readU32BE(block8, 4)
  for (let i = FEISTEL_ROUNDS - 1; i >= 0; i--) {
    const nR = L >>> 0
    const nL = (R ^ feistelF(L, subkeys[i])) >>> 0
    L = nL
    R = nR
  }
  const out = new Uint8Array(BLOCK_BYTES)
  writeU32BE(out, 0, L)
  writeU32BE(out, 4, R)
  return out
}

export function pkcs7Pad(bytes) {
  const n = bytes.length
  const padLen = BLOCK_BYTES - (n % BLOCK_BYTES) || BLOCK_BYTES
  const out = new Uint8Array(n + padLen)
  out.set(bytes, 0)
  for (let i = n; i < out.length; i++) {
    out[i] = padLen
  }
  return out
}

export function pkcs7Unpad(bytes) {
  if (bytes.length === 0 || bytes.length % BLOCK_BYTES !== 0) {
    throw new Error("INVALID_PADDING")
  }
  const padLen = bytes[bytes.length - 1]
  if (padLen < 1 || padLen > BLOCK_BYTES) {
    throw new Error("INVALID_PADDING")
  }
  for (let i = bytes.length - padLen; i < bytes.length; i++) {
    if (bytes[i] !== padLen) throw new Error("INVALID_PADDING")
  }
  return bytes.subarray(0, bytes.length - padLen)
}

export function encryptBytes(plainBytes, subkeys) {
  const padded = pkcs7Pad(plainBytes)
  const out = new Uint8Array(padded.length)
  for (let off = 0; off < padded.length; off += BLOCK_BYTES) {
    const chunk = padded.subarray(off, off + BLOCK_BYTES)
    out.set(feistelEncryptBlock(chunk, subkeys), off)
  }
  return out
}

export function decryptBytes(cipherBytes, subkeys) {
  if (cipherBytes.length % BLOCK_BYTES !== 0) {
    throw new Error("INVALID_LENGTH")
  }
  const plainPadded = new Uint8Array(cipherBytes.length)
  for (let off = 0; off < cipherBytes.length; off += BLOCK_BYTES) {
    const chunk = cipherBytes.subarray(off, off + BLOCK_BYTES)
    plainPadded.set(feistelDecryptBlock(chunk, subkeys), off)
  }
  return pkcs7Unpad(plainPadded)
}
