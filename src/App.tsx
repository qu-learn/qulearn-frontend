import { BrowserRouter, Routes } from "react-router-dom"
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { api } from './utils/api.ts'

export function App() {
  return (
    <ApiProvider api={api}>
      <BrowserRouter>
        <Routes>
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  );
}
