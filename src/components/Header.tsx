'use client';

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

  



export const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="header">
      <Link className="logo" href="/">
        Pokemon Search
      </Link>
      <nav>
        <Link className="link" href="/about">
          About
        </Link>
      </nav>
      <label className="theme-controler">
        Theme:
        <select
          className="theme-select"
          value={theme}
          onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </header>
  )
}

export default Header