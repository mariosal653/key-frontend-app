import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { auth } from "../firebase";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const token = await auth.currentUser?.getIdToken();
      const decoded = jwtDecode<{ role: string }>(token!);

      if (decoded.role === "REGISTRO") {
        navigate("/registro");
      } else if (decoded.role === "ALUMNO") {
        navigate("/alumno");
      } else if (decoded.role === "PROFESOR") {
        navigate("/profesor");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Iniciar Sesión
        </button>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="bg-red-500 text-white w-full py-2 mt-2 rounded hover:bg-red-600"
        >
          Iniciar con Google
        </button>

      </form>
    </div>
  );
};

export default Login;
