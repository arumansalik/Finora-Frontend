import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Toaster } from "sonner"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"

import { AuthProvider } from "@/context/AuthContext"


const queryClient = new QueryClient()


createRoot(
  document.getElementById("root")!
).render(

  <StrictMode>

    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <App />

        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          closeButton
        />

      </AuthProvider>

    </QueryClientProvider>

  </StrictMode>

)
