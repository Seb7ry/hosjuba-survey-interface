// components/UserList.tsx

import { Pencil, Trash2 } from "lucide-react";

type User = {
    username: string;
    name: string;
    position: string;
    department: string;
};

type UserListProps = {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (username: string) => void;
    searchTerm: string;
};

const UserList = ({ users, onEdit, onDelete, searchTerm }: UserListProps) => {
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Nombre</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Usuario</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Rol</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Dependencia</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.username} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.username}</td>
                                <td className="px-4 py-3">{user.position}</td>
                                <td className="px-4 py-3">{user.department}</td>
                                <td className="px-4 py-3 flex justify-center space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => onEdit(user)}
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => onDelete(user.username)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
