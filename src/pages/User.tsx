import { useEffect, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/user.service';
import UserFormModal from '../components/user/UserModal';
import UsersTable from '../components/user/UserTable';
import UsersCards from '../components/user/UserCard';

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
  password: string;
  signature?: string;
};

const User = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [useCardView, setUseCardView] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    position: '',
    department: '',
    password: ''
  });

  useEffect(() => {
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;
  
    const checkTableFit = () => {
      const tableContainer = document.getElementById('table-container');
      const tableElement = tableContainer?.querySelector('table');
      
      if (!tableContainer || !tableElement) return;
  
      // Medimos tanto el contenedor como la tabla real
      const containerWidth = tableContainer.clientWidth;
      const tableWidth = tableElement.scrollWidth; // Ancho total incluyendo lo no visible
      
      // Determinamos si necesita scroll horizontal
      const needsHorizontalScroll = tableWidth > containerWidth;
      
      setUseCardView(needsHorizontalScroll);
    };
  
    // Usamos ResizeObserver para detectar cambios en la tabla
    if ('ResizeObserver' in window) {
      const tableElement = document.getElementById('table-container')?.querySelector('table');
      if (tableElement) {
        resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(checkTableFit);
        });
        resizeObserver.observe(tableElement);
      }
    }
  
    // También observamos cambios en el contenedor
    const containerObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(checkTableFit);
    });
  
    const tableContainer = document.getElementById('table-container');
    if (tableContainer) {
      containerObserver.observe(tableContainer);
    }
  
    // Listener de resize como fallback
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(checkTableFit);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Verificación inicial con pequeño delay
    setTimeout(checkTableFit, 50);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      containerObserver.disconnect();
    };
  }, []);
  // Fetch users on mount
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
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form and close modal
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateUser(formData);
      } else {
        await createUser(formData);
      }
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Prepare form for editing
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

  // Handle user deletion
  const handleDelete = async (username: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(username);
        const updatedUsers = await getAllUsers();
        setUsers(updatedUsers);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Spacer for mobile header */}
        <div className="h-16 md:h-0" />

        {/* Content container */}
        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          {/* Header with title and action button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden" id="table-container">
              {!useCardView ? (
                <UsersTable 
                  users={filteredUsers} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ) : (
                <UsersCards 
                  users={filteredUsers} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              )}
            </div>
          )}
        </div>

        {/* User form modal */}
        <UserFormModal
          isOpen={modalOpen}
          isEditing={isEditing}
          formData={formData}
          onClose={resetForm}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};

export default User;
