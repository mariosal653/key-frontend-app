import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegistroPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const goToRegistrarAlumno = () => {
        navigate("/registro/alumno");
    };

    const goToBoletas = () => {
        navigate("/registro/boletas");
    };

    return (
        <Layout>
            <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Bienvenido, Registro Académico</h1>
                    <p className="text-gray-600 mb-6">
                        Has iniciado sesión como <span className="font-semibold">{user?.email}</span>
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={goToRegistrarAlumno}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Registrar Alumno
                        </button>

                        <button
                            onClick={goToBoletas}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Ver Boletas
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RegistroPage;
