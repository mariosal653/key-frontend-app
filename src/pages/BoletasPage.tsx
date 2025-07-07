import { useEffect, useState } from "react";
import { auth } from "../firebase";
import Layout from "../components/Layout";
import { jwtDecode } from "jwt-decode";

interface Nota {
    materiaId: number;
    nombreMateria: string;
    notaFinal: number;
}

interface RespuestaNotas {
    nombreCompleto: string;
    notas: Nota[];
}

const BoletasPage = () => {
    const [data, setData] = useState<RespuestaNotas[] | RespuestaNotas | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [materias, setMaterias] = useState<{ id: number; nombreMateria: string }[]>([]);

    const [newNota, setNewNota] = useState({
        emailAlumno: "",
        materiaId: "",
        notaFinal: "",
    });
    const [rol, setRol] = useState("");
    const [alumnos, setAlumnos] = useState<{
        nombres: string;
        apellidos: string;
        email: string;
        direccion: string;
        telefono: string;
    }[]>([]);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch("https://key-backend-service.onrender.com/api/profesor/all-materias", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error al obtener materias");
                const data = await res.json();
                setMaterias(data);
            } catch (error) {
                console.error("Error cargando materias:", error);
            }
        };

        fetchMaterias();
    }, []);


    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch("https://key-backend-service.onrender.com/api/alumno/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error al obtener alumnos");
                const data = await res.json();
                setAlumnos(data);
            } catch (error) {
                console.error("Error cargando alumnos:", error);
            }
        };

        if (["ADMIN", "PROFESOR", "REGISTRO"].includes(rol)) {
            fetchAlumnos();
        }
    }, [rol]);

    // Al inicio del componente
    const fetchNotas = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Token no disponible");

            const decoded: any = jwtDecode(token);
            const role = decoded?.role || "";
            setRol(role);

            const url =
                role === "ADMIN" || role === "PROFESOR" || role === "REGISTRO"
                    ? "https://key-backend-service.onrender.com/api/alumno/todos-con-notas"
                    : "https://key-backend-service.onrender.com/api/alumno/notas";

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("No se pudo obtener las notas");

            const result = await res.json();
            setData(result);
        } catch (err: any) {
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotas();
    }, []);


    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Boleta de Notas</h1>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {/* ADMIN - múltiples alumnos */}
                {Array.isArray(data) && data.map((alumno) => (
                    <div key={alumno.nombreCompleto} className="mb-8">
                        <p className="font-semibold mb-2">Alumno: {alumno.nombreCompleto}</p>
                        <table className="min-w-full bg-white border mb-4">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">Materia</th>
                                    <th className="px-4 py-2 border">Nota Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumno.notas.map((nota) => (
                                    <tr key={nota.materiaId}>
                                        <td className="px-4 py-2 border">{nota.nombreMateria}</td>
                                        <td className="px-4 py-2 border text-center">{nota.notaFinal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                {!Array.isArray(data) && data && (
                    <>
                        <p className="font-semibold mb-2">Alumno: {data.nombreCompleto}</p>
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">Materia</th>
                                    <th className="px-4 py-2 border">Nota Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.notas.map((nota) => (
                                    <tr key={nota.materiaId}>
                                        <td className="px-4 py-2 border">{nota.nombreMateria}</td>
                                        <td className="px-4 py-2 border text-center">{nota.notaFinal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            {["ADMIN", "PROFESOR", "REGISTRO"].includes(rol) && (
                <div className="mt-8 p-4 bg-gray-50 rounded border">
                    <h2 className="text-lg font-semibold mb-4">Agregar Nota</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={newNota.emailAlumno}
                            onChange={(e) => setNewNota({ ...newNota, emailAlumno: e.target.value })}
                            className="border rounded p-2"
                        >
                            <option value="">Selecciona un alumno</option>
                            {alumnos.map((alumno) => (
                                <option key={alumno.email} value={alumno.email}>
                                    {alumno.nombres} {alumno.apellidos} ({alumno.email})
                                </option>
                            ))}
                        </select>
                        <select
                            value={newNota.materiaId}
                            onChange={(e) => setNewNota({ ...newNota, materiaId: e.target.value })}
                            className="border rounded p-2"
                        >
                            <option value="">Selecciona una materia</option>
                            {materias.map((materia) => (
                                <option key={materia.id} value={materia.id}>
                                    {materia.nombreMateria}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Nota Final"
                            value={newNota.notaFinal}
                            onChange={(e) => setNewNota({ ...newNota, notaFinal: e.target.value })}
                            className="border rounded p-2"
                        />
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const token = await auth.currentUser?.getIdToken();
                                const res = await fetch("https://key-backend-service.onrender.com/api/profesor/notas", {
                                    method: "PUT",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify([
                                        {
                                            emailAlumno: newNota.emailAlumno,
                                            materiaId: parseInt(newNota.materiaId),
                                            notaFinal: parseFloat(newNota.notaFinal),
                                        },
                                    ]),
                                });

                                if (!res.ok) throw new Error("Error al guardar la nota");

                                alert("Nota agregada correctamente");
                                setNewNota({ emailAlumno: "", materiaId: "", notaFinal: "" });
                                await fetchNotas(); // 🔁 Refrescar datos
                            } catch (error) {
                                alert("Ocurrió un error al guardar la nota");
                            }
                        }}

                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Guardar Nota
                    </button>
                </div>
            )}

        </Layout>
    );
};

export default BoletasPage;
