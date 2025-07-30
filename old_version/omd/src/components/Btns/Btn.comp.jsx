import React, { useState } from 'react'
import "./Btn.comp.css"
const BtnComponent = ({
  text,
  backgroundColor,
  fontSize,
  onclick,
  color,
  padding,
  disable,
  borderRadius,
  width,
  border,
  letterSpacing
}) => {

  const [hover, setHover] = useState(false);

  return (
    <button
      disabled={disable}
      style={{
        fontSize: fontSize,
        letterSpacing: letterSpacing,
        backgroundColor: hover ? 'black' : backgroundColor,
        padding: padding,
        color: hover ? '#fff' : color,
        borderRadius: borderRadius,
        border: border,
        width: width
      }}
      onClick={onclick}
      className='btn-comp btn-comp-hover'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text || "Submmit"}
    </button>
  )
}

export default BtnComponent
