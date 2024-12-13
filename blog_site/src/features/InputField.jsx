import React from 'react'

export function InputField({name, label, type, onChange, required, value, placeholder}) {
  return (
    <div className='inputField'>
        <label htmlFor={name}>
            {label} {required && (<span>*</span>)}
        </label>
        <input 
            type={type}
            id={name}
            name={name}
            onChange={onChange}
            value={value ? value : null}
            placeholder={placeholder ? placeholder : ""}
        />
    </div>
  )
}
