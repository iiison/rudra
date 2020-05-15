import React from 'react'
import styles from './styles.css'

console.log('*****************************')
console.log(styles)
console.log('*****************************')

function Input({ event, placeholder = 'Enter value' }) {
  return (
    <input className='input' type="text" placeholder={placeholder} />
  )
}

export default Input

