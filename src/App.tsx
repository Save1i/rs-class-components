import './App.css';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';
import AboutPage from './components/pages/AboutPage';
import NotFoundPage from './components/pages/NotFoundPage';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <ErrorBoundary>
      <main className="app">
        <div className="container">
          <header className="header">
            <Link className="logo" to="/">
              Pokemon Search
            </Link>
            <nav>
              <NavLink className="link" to="/about">
                About
              </NavLink>
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

          <Routes>
            <Route path="/" element={<Main />}>
              <Route path="pokemon/:detailsId" element={<Main.Details />} />
            </Route>
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </ErrorBoundary>
  );
}

export default App;
