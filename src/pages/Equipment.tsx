import { useEffect, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getAllEquipment, createEquipment, updateEquipment, deleteEquipment, type EquipmentData, type EquipmentResponse } from '../services/equipment.service';
import EquipmentFormModal from '../components/equipment/EquipmentModal';
import EquipmentTable from '../components/equipment/EquipmentTable';
import EquipmentCards from '../components/equipment/EquipmentCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { ErrorMessage } from '../components/ErrorMessage';

type Equipment = EquipmentResponse & { id: string };

const Equipment = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [currentEquipmentId, setCurrentEquipmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EquipmentData>({
    name: '',
    brand: '',
    model: '',
    type: '',
    department: '',
    serial: '',
    numberInventory: ''
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await getAllEquipment();
        setEquipments(data.map((e) => ({ ...e, id: e._id || '' })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      type: '',
      department: '',
      serial: '',
      numberInventory: ''
    });
    setIsEditing(false);
    setCurrentEquipmentId(null);
    setModalOpen(false);
  };

  const handleSubmit = async (formData: EquipmentData) => {
    try {
      if (isEditing && currentEquipmentId) {
        await updateEquipment(currentEquipmentId, formData);
      } else {
        await createEquipment(formData);
      }
      const data = await getAllEquipment();
      setEquipments(data.map((e) => ({ ...e, id: e._id || '' })));
      resetForm();
    } catch (err: any) {
      throw err;
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setFormData({
      name: equipment.name,
      brand: equipment.brand,
      model: equipment.model,
      type: equipment.type,
      department: equipment.department,
      serial: equipment.serial,
      numberInventory: equipment.numberInventory
    });
    setCurrentEquipmentId(equipment._id!);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteInit = (id: string) => {
    const equipment = equipments.find(e => e._id === id);
    if (equipment) {
      setEquipmentToDelete(equipment);
      setIsConfirmingDelete(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!equipmentToDelete) return;

    try {
      await deleteEquipment(equipmentToDelete._id!);
      const data = await getAllEquipment();
      setEquipments(data.map((e) => ({ ...e, id: e._id || '' })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirmingDelete(false);
      setEquipmentToDelete(null);
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
            <h1 className="text-3xl font-semibold text-gray-800">Gestión de Equipos</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Equipo
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar equipos..."
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
                <EquipmentTable
                  equipment={filteredEquipments}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              ) : (
                <EquipmentCards
                  equipment={filteredEquipments}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              )}
            </div>
          )}
        </div>

        <EquipmentFormModal
          isOpen={modalOpen}
          isEditing={isEditing}
          equipmentId={currentEquipmentId || undefined}
          formData={formData}
          onClose={resetForm}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />

        <ConfirmDialog
          isOpen={isConfirmingDelete}
          message={`¿Estás seguro de eliminar el equipo ${equipmentToDelete?.name} (${equipmentToDelete?.model})?`}
          onCancel={() => {
            setIsConfirmingDelete(false);
            setEquipmentToDelete(null);
          }}
          onConfirm={handleDeleteConfirmed}
        />
      </main>
    </div>
  );
};

export default Equipment;