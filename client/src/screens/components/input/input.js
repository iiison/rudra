import React, { useState, useEffect } from 'react'
import './styles.css'

function Input({
  event,
  className = '',
  returnData = {},
  placeholder = 'Enter value'
}) {
  const [inputValue, setInputValue] = useState('')
  const [shouldShowButton, toggleButton] = useState(false)
  const [isProcessing, setProcessing] = useState(false)

  useEffect(() => toggleButton(inputValue !== ''), [inputValue])

  return (
    <div className='input-wrapper'>
      <input
        type="text"
        value={inputValue}
        disabled={isProcessing}
        placeholder={placeholder}
        className={`input ${className}`}
        onChange={(evt) => {
          setInputValue(evt.target.value)
        }}
        onKeyDown={(evt) => {
          const { keyCode, target : { value } } = evt

          if (value && keyCode === 13) {
            event && event({ value, ...returnData })
            setProcessing(true)
          }
        }}
      />
      <button
        className={`input-button ${shouldShowButton && !isProcessing && 'visible'}`}
        onClick={() => {
          event && event({ value : inputValue, ...returnData })
          setProcessing(true)
        }}
      >ok</button>
    </div>
  )
}

export default Input

