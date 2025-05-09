import { useEffect, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getAllUsers, createUser, updateUser, deleteUser, type UserData } from '../services/user.service';
import UserFormModal from '../components/user/UserModal';
import UsersTable from '../components/user/UserTable';
import UsersCards from '../components/user/UserCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { ErrorMessage } from '../components/ErrorMessage';

type User = {
  username: string;
  name: string;
  position: string;
  department: string;
  signature?: string;
};

type FormData = {
  username: string;
  name: string;
  position: string;
  department: string;
  password?: string;
  signature?: string;
};

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    position: '',
    department: '',
    password: ''
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      position: '',
      department: '',
      password: ''
    });
    setIsEditing(false);
    setModalOpen(false);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const userData: UserData = {
        ...formData,
        password: formData.password || '' // Asegurar que password no sea undefined
      };

      if (isEditing) {
        await updateUser(userData);
      } else {
        if (!formData.password) {
          throw new Error('La contraseña es requerida para nuevos usuarios');
        }
        await createUser(userData);
      }
      const data = await getAllUsers();
      setUsers(data);
      resetForm();
    } catch (err: any) {
      throw err;
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      username: user.username,
      name: user.name,
      position: user.position,
      department: user.department,
      password: '',
      signature: user.signature
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteInit = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setUserToDelete(user);
      setIsConfirmingDelete(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.username);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirmingDelete(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0">
        <div className="h-16 md:h-0" />

        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-semibold text-gray-800">Gestión de Usuarios</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden" id="table-container">
              {windowWidth >= 1293 ? (
                <UsersTable
                  users={filteredUsers}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              ) : (
                <UsersCards
                  users={filteredUsers}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              )}
            </div>
          )}
        </div>

        <UserFormModal
          isOpen={modalOpen}
          isEditing={isEditing}
          formData={formData}
          onClose={resetForm}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />

        <ConfirmDialog
          isOpen={isConfirmingDelete}
          message={`¿Estás seguro de eliminar al usuario ${userToDelete?.name} (${userToDelete?.username})?`}
          onCancel={() => {
            setIsConfirmingDelete(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteConfirmed}
        />
      </main>
    </div>
  );
};

export default User;