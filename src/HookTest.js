import React, { useState, useEffect } from 'react'
import { set, get } from 'idb-keyval'

const sharedStyles = {
  height: '15rem',
  fontSize: '2rem',
  textAlign: 'center',
}

function HookTest() {
  const [darkModeOn, setDarkModeOn] = useState(undefined)

  useEffect(() => {
    get('darkModeOn').then((value) =>
      // If a value is retrieved then use it; otherwise default to true
      setDarkModeOn(value ?? true),
    )
  }, [setDarkModeOn])

  const handleOnChange = ({ target }) => {
    setDarkModeOn(target.checked)

    set('darkModeOn', target.checked)
  }

  const styles = {
    ...sharedStyles,
    ...(darkModeOn
      ? {
          backgroundColor: 'black',
          color: 'white',
        }
      : {
          backgroundColor: 'white',
          color: 'black',
        }),
  }

  return (
    <div style={styles}>
      {darkModeOn === undefined ? (
        <>Loading preferences...</>
      ) : (
        <>
          <input
            type="checkbox"
            value="darkMode"
            checked={darkModeOn}
            id="darkModeOn"
            name="darkModeOn"
            style={{ width: '3rem', height: '3rem' }}
            onChange={handleOnChange}
          />
          <label htmlFor="darkModeOn">Use dark mode?</label>
        </>
      )}
    </div>
  )
}

export default HookTest
