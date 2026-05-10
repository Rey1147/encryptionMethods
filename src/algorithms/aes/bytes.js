export const uint8ToBase64 = (u8) => {
  const chunk = 0x8000
  let bin = ""
  for (let i = 0; i < u8.length; i += chunk) {
    bin += String.fromCharCode.apply(null, u8.subarray(i, i + chunk))
  }
  return btoa(bin)
}

export const base64ToUint8 = (b64) => {
  const trimmed = String(b64).replace(/\s/g, "")
  const bin = atob(trimmed)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i)
  }
  return out
}

export const concatParts =(...parts) => {
  const len = parts.reduce((a, p) => a + p.length, 0)
  const out = new Uint8Array(len)
  let off = 0
  for (const p of parts) {
    out.set(p, off)
    off += p.length
  }
  return out
}
