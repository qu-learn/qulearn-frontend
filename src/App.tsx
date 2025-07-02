import { Route, BrowserRouter, Routes } from "react-router-dom"
import { TestPage } from "./pages/TestPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
