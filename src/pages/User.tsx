// pages/User.tsx

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllUsers, createUser, updateUser, deleteUser } from "../services/user.service";
import UserList from "../components/UserList";

const User = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        position: "",
        department: "",
        password: ""
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || "Error al cargar los usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async () => {
        try {
            await createUser(formData);
            setModalOpen(false);
            setFormData({ username: "", name: "", position: "", department: "", password: "" });
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Error al crear el usuario.");
        }
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            name: user.name,
            position: user.position,
            department: user.department,
            password: user.password || ""
        });
        setModalOpen(true);
    };

    const handleUpdateUser = async () => {
        try {
            await updateUser(formData);
            setModalOpen(false);
            setFormData({ username: "", name: "", position: "", department: "", password: "" });
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Error al actualizar el usuario.");
        }
    };

    const handleDeleteUser = async (username: string) => {
        try {
            await deleteUser(username);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Error al eliminar el usuario.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl font-semibold text-black">Gestión de Usuarios</h1>
                    <button
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => setModalOpen(true)}
                    >
                        <Plus className="mr-2" size={18} />
                        Nuevo Usuario
                    </button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o usuario..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="text-gray-500">Cargando usuarios...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <UserList
                        users={users}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        searchTerm={searchTerm}
                    />
                )}
            </div>

            {/* Modal para crear o editar usuario */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                editingUser ? handleUpdateUser() : handleCreateUser();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Cargo</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Dependencia</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
