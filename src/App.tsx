import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardRegistro from "./pages/RegistroDashboard";
import DashboardProfesor from "./pages/ProfesorDashboard";
import DashboardAlumno from "./pages/AlumnoDashboard";
import { useAuth } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  const { user, role } = useAuth();


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/registro"
          element={
            <PrivateRoute allowedRoles={["REGISTRO"]}>
              <DashboardRegistro />
            </PrivateRoute>
          }
        />

        <Route
          path="/profesor"
          element={
            <PrivateRoute allowedRoles={["PROFESOR"]}>
              <DashboardProfesor />
            </PrivateRoute>
          }
        />

        <Route
          path="/alumno"
          element={
            <PrivateRoute allowedRoles={["ALUMNO"]}>
              <DashboardAlumno />
            </PrivateRoute>
          }
        />

        {/* Redirección genérica según rol */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  {
                    REGISTRO: "/registro",
                    PROFESOR: "/profesor",
                    ALUMNO: "/alumno",
                  }[role || ""] || "/login"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all para rutas inválidas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
