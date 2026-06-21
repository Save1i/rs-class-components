'use client';

import Link from 'next/link';
import './App.css';

import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';
import AboutPage from './components/pages/AboutPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {


  return (
    <ErrorBoundary>
      <main className="app">
        <div className="container">

        </div>
      </main>
    </ErrorBoundary>
  );
}

export default App;
