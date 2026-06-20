'use client'
 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
 
const App = dynamic(() => import('../../App'), { ssr: false })
 
export function ClientOnly() {
const QUERY_CACHE_TIME  = Number(process.env.NEXT_PUBLIC_QUERY_CACHE_TIME) | 30000;

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CACHE_TIME ,
        gcTime: QUERY_CACHE_TIME ,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}