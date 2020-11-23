import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Siema from 'siema'

// TODO maybe customize siema (and maybe even make a pull request)
// - use px instead of % (e.g. 3 slides @ 240px => 720px track)
//   but w/ % (each slide gets 1/3% => 33.333% ~ 239.976px)
// - use css grid instead of floats (allows for gap)

function SiemaCarousel(props) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const s = new Siema({
      ...props.options,
      // onChange: function () {
      //   props.setSiema(this)

      //   if (props.options && props.options.onChange) props.options.onChange.call(this)
      // },
      selector: ref.current
    })

    props.setSiema(s)

    return () => {
      s.destroy(true)
    }
  }, [ref])

  return (
    <div ref={ref}>
      {props.children}
    </div>
  )
}

SiemaCarousel.propTypes = {
  options: PropTypes.object,
  setSiema: PropTypes.func,
  children: PropTypes.node
}

export default SiemaCarousel