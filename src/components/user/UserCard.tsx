type User = {
  username: string;
  name: string;
  position: string;
  department: string;
};

type UsersCardsProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (username: string) => void;
};

const UsersCard = ({ users, onEdit, onDelete }: UsersCardsProps) => {
  return (
    <div>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.username} className="p-4 bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(user.username)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p><span className="font-medium">Departamento:</span> {user.department}</p>
              <p><span className="font-medium">Cargo:</span> {user.position}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </div>
  );
};

export default UsersCard;