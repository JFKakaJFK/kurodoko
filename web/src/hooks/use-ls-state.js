import { useState, useEffect } from 'react'

/**
 * A version of the React useState which persists the stored state
 * in window.localStorage.
 * 
 * @param {String} key 
 * @param {Any} initialState 
 */
function useLSState(key, initialState = null) {
  const [state, setState] = useState(initialState)

  // retrieve value on startup
  useEffect(() => {
    if (typeof window !== `undefined` && window.localStorage.hasOwnProperty(key)) setState(JSON.parse(window.localStorage.getItem(key)))
  }, [])

  // write every update to localstorage
  useEffect(() => {
    if (typeof window !== `undefined`) window.localStorage.setItem(key, JSON.stringify(state))
  }, [state])

  return [state, setState]
}

// TODO use bitstring util
const [H, L] = ['1', '0']

function useLSBitmap(key, boolArr) {
  const boolToBit = (b) => b ? H : L
  const [bitmap, setBitmap] = useLSState(key, boolArr.map(boolToBit).join(''))

  const get = (i) => {
    if (isNaN(i) || i < 0 || i >= boolArr.length) return
    return bitmap[i] === H
  }

  const set = (i, value) => {
    if (isNaN(i) || i < 0 || i >= boolArr.length) return
    setBitmap(bitmap.substring(0, i) + boolToBit(value) + bitmap.substring(i + 1))
  }

  const setAll = (value) => setBitmap(boolToBit(value).repeat(boolArr.length))

  return [get, set, setAll]
}

export default useLSState

export {
  useLSBitmap
}
