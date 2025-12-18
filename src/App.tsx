import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CreatePathPage from "./pages/CreatePath";
import CreateSectionPage from "./pages/CreateSection";
import CreateTaskPage from "./pages/CreateTask";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegistrationSuccessPage from "./pages/RegistrationSuccess";
import RegisterPage from "./pages/Register";
import PathDetailPage from "./pages/PathDetail";
import { PathsProvider } from "./context/PathsContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <PathsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/success" element={<RegistrationSuccessPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paths/create"
              element={
                <ProtectedRoute>
                  <CreatePathPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paths/:id/sections/create"
              element={
                <ProtectedRoute>
                  <CreateSectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paths/:id/sections/:sectionId/tasks/create"
              element={
                <ProtectedRoute>
                  <CreateTaskPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paths/:id"
              element={
                <ProtectedRoute>
                  <PathDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PathsProvider>
    </AuthProvider>
  );
}

export default App;
