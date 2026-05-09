import './App.css'
import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';

function App() {

  return (
    <>
    <ErrorBoundary>
      <Main/>
    </ErrorBoundary>
    </>
  )
}

export default App
