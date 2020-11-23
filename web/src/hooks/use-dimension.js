import { useState, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

function useDimensions(ref, update = true) {
  const [dimensions, setDimensions] = useState({})

  const getDimensions = (node) => {
    const rect = node.getBoundingClientRect().toJSON()
    return Object.assign(rect, {
      x: rect.hasOwnProperty('x') ? rect.x : rect.left,
      y: rect.hasOwnProperty('y') ? rect.y : rect.top,
    })
  }

  const measure = () =>
    window.requestAnimationFrame(() =>
      setDimensions(getDimensions(ref.current))
    )

  const effect = typeof window === `undefined` ? useEffect : useLayoutEffect
  effect(() => {
    if (!ref.current || !window) return

    measure()

    if (update) {
      window.addEventListener("resize", measure)
      window.addEventListener("scroll", measure)

      return () => {
        window.removeEventListener("resize", measure)
        window.removeEventListener("scroll", measure)
      }
    }
  }, [ref.current])

  return [dimensions, measure]
}

useDimensions.propTypes = {
  ref: PropTypes.object.isRequired,
  update: PropTypes.bool
}

function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: typeof window === `undefined` ? window.innerWidth : 0,
    height: typeof window === `undefined` ? window.innerHeight : 0,
  })

  const effect = typeof window === `undefined` ? useEffect : useLayoutEffect
  effect(() => {
    if (!window) return

    const measure = () =>
      window.requestAnimationFrame(() =>
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      )

    measure()

    window.addEventListener("resize", measure)
    window.addEventListener("orientationchange", measure)

    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("orientationchange", measure)
    }
  }, [])

  return dimensions
}

export default useDimensions

export {
  useDimensions,
  useWindowDimensions
}