import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(28, 25, 23, 0.9)",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
