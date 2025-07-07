import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardRegistro from "./pages/RegistroDashboard";
import DashboardProfesor from "./pages/ProfesorDashboard";
import DashboardAlumno from "./pages/AlumnoDashboard";
import { useAuth } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import BoletasPage from "./pages/BoletasPage";
import RegistrarAlumnoForm from "./pages/RegistrarAlumnoForm";

function App() {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  const getRedirectPath = () => {
    switch (role) {
      case "REGISTRO":
        return "/registro";
      case "PROFESOR":
        return "/profesor";
      case "ALUMNO":
        return "/alumno";
      default:
        return "/login";
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/registro"
          element={
            <PrivateRoute allowedRoles={["REGISTRO"]}>
              <DashboardRegistro />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro/alumno"
          element={
            <PrivateRoute allowedRoles={["REGISTRO"]}>
              <RegistrarAlumnoForm />
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
          path="/registro/boletas"
          element={
            <PrivateRoute allowedRoles={["REGISTRO"]}>
              <BoletasPage />
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

        <Route path="/" element={<Navigate to={user ? getRedirectPath() : "/login"} />} />
        <Route
          path="/alumno/boletas"
          element={
            <PrivateRoute allowedRoles={["ALUMNO"]}>
              <BoletasPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
