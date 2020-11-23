// TODO use hex...

const [HIGH, LOW] = ['1', '0']

const boolToBit = b => (typeof b === `boolean` && b) ? HIGH : LOW
const bitToBool = b => b === HIGH

const boolArrayToBitString = arr => arr.map(boolToBit).join('')
const bitStringToBoolArray = bits => bits.split('').map(bitToBool)

const getBool = (bitString, index) => bitToBool(bitString[index])
const setBit = (bitString, index, value) => bitString.substring(0, index) + boolToBit(value) + bitString.substring(index + 1)
const setAllBits = (bitString, value) => boolToBit(value).repeat(bitString.length)

export {
  boolToBit,
  bitToBool,
  boolArrayToBitString,
  bitStringToBoolArray,
  getBool,
  setBit,
  setAllBits
}
