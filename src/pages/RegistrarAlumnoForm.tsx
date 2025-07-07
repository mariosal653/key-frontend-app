import { useState } from "react";
import { auth } from "../firebase";
import Layout from "../components/Layout";

const RegistrarAlumnoForm = () => {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        direccion: "",
        telefono: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Token de autenticación no disponible.");

            const response = await fetch("http://localhost:8080/api/registro/alumnos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error al registrar al alumno.");
            }

            setMensaje("Alumno registrado exitosamente.");
            setFormData({
                nombres: "",
                apellidos: "",
                email: "",
                direccion: "",
                telefono: "",
            });
        } catch (err: any) {
            setError(err.message || "Ocurrió un error.");
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
                <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Alumno</h2>

                {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
                {error && <p className="text-red-600 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {["nombres", "apellidos", "email", "direccion", "telefono"].map((campo) => (
                        <div key={campo}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">{campo}</label>
                            <input
                                type="text"
                                name={campo}
                                value={(formData as any)[campo]}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        Registrar Alumno
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default RegistrarAlumnoForm;
