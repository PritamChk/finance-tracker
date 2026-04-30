import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { useThemeStore } from './stores/theme.store'

const queryClient = new QueryClient();

const ThemeInit = () => {
  const isDark = useThemeStore((s) => s.isDark);
  if (isDark) document.documentElement.classList.add('dark');
  return null;
};

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeInit />
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
)
