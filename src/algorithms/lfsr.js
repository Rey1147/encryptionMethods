const MASK = 0xffff
const FEEDBACK_MASK = 0xb400

const foldSeedToState = (seedStr) => {
  let h = 0
  for (let i = 0; i < seedStr.length; i++) {
    h = (Math.imul(h, 31) + seedStr.charCodeAt(i)) >>> 0
  }
  h = (h ^ (h >>> 16)) & MASK
  if (h === 0) h = 0xace1
  return h
}

export const createLfsrState = (seedString) => {
  return foldSeedToState(String(seedString))
}

export const lfsrStep = (state) => {
  let s = state & MASK
  const bit = s & 1
  s >>>= 1
  if (bit) s ^= FEEDBACK_MASK
  return { nextState: s & MASK, bit }
}

export const generateLfsrBitString = (seedString, length) => {
  if (length <= 0) return ""
  let state = createLfsrState(seedString)
  let out = ""
  for (let i = 0; i < length; i++) {
    const { nextState, bit } = lfsrStep(state)
    state = nextState
    out += bit ? "1" : "0"
  }
  return out
}
