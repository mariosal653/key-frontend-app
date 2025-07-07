import { useEffect, useState } from "react";
import { auth } from "../firebase";
import Layout from "../components/Layout";

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
    const [data, setData] = useState<RespuestaNotas[] | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchNotas = async () => {
            setLoading(true);
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) throw new Error("No se pudo obtener el token. Por favor inicia sesión de nuevo.");

                const response = await fetch("http://localhost:8080/api/alumno/todos-con-notas", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const message =
                        response.status === 403
                            ? "Acceso denegado. No tienes permisos para ver estas notas."
                            : response.status === 401
                                ? "No autorizado. Por favor inicia sesión nuevamente."
                                : `Error ${response.status}: ${response.statusText}`;
                    throw new Error(message);
                }

                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message || "Ocurrió un error desconocido.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotas();
    }, []);

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Boleta de Notas</h1>

                {loading && <p className="text-gray-600">Cargando datos...</p>}

                {error && <p className="text-red-600 font-semibold">{error}</p>}

                {data && !loading && !error && (
                    <div className="space-y-8">
                        {data.map((alumno, index) => (
                            <div key={index}>
                                <p className="text-lg font-semibold mb-2">
                                    Alumno: {alumno.nombreCompleto}
                                </p>
                                {alumno.notas.length > 0 ? (
                                    <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 border">Materia</th>
                                                <th className="px-4 py-2 border text-center">Nota Final</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alumno.notas.map((nota) => (
                                                <tr key={nota.materiaId}>
                                                    <td className="px-4 py-2 border">{nota.nombreMateria}</td>
                                                    <td className="px-4 py-2 border text-center">
                                                        {nota.notaFinal}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 italic">No tiene notas registradas.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default BoletasPage;
