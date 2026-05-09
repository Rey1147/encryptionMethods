import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PermutationEncryptionPage } from './pages/PermutationEncryptionPage.jsx';
import { MainPage } from './pages/MainPage.jsx';
import App from './App.jsx'
import './main.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async() => {
      return null
    },
    children: [
      { index: true, element: <MainPage /> },
      { path: "permutation", element: <PermutationEncryptionPage /> }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>,
)
