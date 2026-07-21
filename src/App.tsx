'use client';

import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <main className="app">
        <div className="container" />
      </main>
    </ErrorBoundary>
  );
}

export default App;
