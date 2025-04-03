// ** React Imports
import { useEffect, useState, createContext } from 'react'

// ** Create Context
const ThemeColors = createContext()

const ThemeContext = ({ children }) => {
  // ** State
  const [theme, setTheme] = useState("light")

  

  return <ThemeColors.Provider value={{ theme,setTheme }}>{children}</ThemeColors.Provider>
}

export { ThemeColors, ThemeContext }