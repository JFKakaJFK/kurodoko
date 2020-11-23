import validateKurodoko from './validate-kurodoko'
import validateOhno from './validate-ohno'
import { KURODOKO, OHNO } from '../util/puzzle-types'

const getValidate = (type) => {
  switch (type) {
    case KURODOKO:
      return validateKurodoko
    case OHNO:
      return validateOhno
    default:
      throw new Error('Puzzle Type unknown')
  }
}

const validate = (data) => {
  const { grid, rows, cols, type } = data

  const v = getValidate(type)

  return [solved, hints] = v(grid, rows, cols)
}

export default validate
