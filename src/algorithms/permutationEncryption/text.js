const PAD = '*'

const getColumnOrder = (key) => {
  let chars = key.split("").map((char, index) => ({
    char,
    index
  }))

  chars.sort((a, b) => {
    if (a.char < b.char) return -1
    if (a.char > b.char) return 1
    return a.index - b.index
  })

  let order = []

  chars.forEach((item, i) => {
    order[item.index] = i
  })

  return order
}


export const encrypt = (text, key) => {
  const cols = key.length
  const order = getColumnOrder(key)
  const rows = Math.ceil(text.length / cols)

  let table = Array.from({ length: rows }, () =>
    Array(cols).fill(PAD)
  )

  let index = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (index < text.length) {
        table[r][c] = text[index]
        index++
      }
    }
  }

  let encrypted = ""
  for (let current = 0; current < cols; current++) {
    let col = order.indexOf(current)

    for (let r = 0; r < rows; r++) {
      encrypted += table[r][col]
    }
  }

  return encrypted
}

export const decrypt = (cipher, key) => {
  const cols = key.length
  const order = getColumnOrder(key)
  const rows = Math.ceil(cipher.length / cols)

  let table = Array.from({ length: rows }, () =>
      Array(cols).fill(PAD)
  )

  let index = 0
  for (let current = 0; current < cols; current++) {
    let col = order.indexOf(current)

    for (let r = 0; r < rows; r++) {
      if (index < cipher.length) {
        table[r][col] = cipher[index]
        index++
      }
    }
  }

  let decrypted = ""
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      decrypted += table[r][c]
    }
  }

  return decrypted.replace(/\*+$/, "")
}
