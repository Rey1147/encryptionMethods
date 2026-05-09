const DEFAULT_KEY='КОМБАЙН'

const getColumnOrder = (key) => {
  let chars = key.split("").map((char, index) => ({
    char,
    index
  }));
  
  chars.sort((a, b) => {
    if (a.char < b.char) return -1;
    if (a.char > b.char) return 1;
    return a.index - b.index;
  });
  
  let order = [];

  chars.forEach((item, i) => {
      order[item.index] = i;
  });

  return order;
}


const encrypt = (text, key) => {
  text = text.replace(/\s+/g, "")

  const cols = key.length
  const order = getColumnOrder(key)
  const rows = Math.ceil(text.length / cols)

  let table = Array.from({ length: rows }, () =>
    Array(cols).fill(" ")
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

  return encrypted.replace(/\s+$/g, "")
}

const decrypt = (cipher, key) => {
  const cols = key.length
  const order = getColumnOrder(key)
  const rows = Math.ceil(cipher.length / cols)

  let table = Array.from({ length: rows }, () =>
      Array(cols).fill(" ")
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

  return decrypted.trim()
}


export const permutationEncryption = (text, key=DEFAULT_KEY, type='encrypt') => {
  if (type === 'encrypt') {
    return encrypt(text, key)
  } else {
    return decrypt(text, key)
  }
}