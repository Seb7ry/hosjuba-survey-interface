import { formatDateTime } from "../Utils";

type HistoryEntry = {
    id: string;
    timestamp: string;
    username: string;
    action: string;
    details?: string;
};

type HistoryListProps = {
    entries: HistoryEntry[];
    onViewDetails: (id: string) => void;
};

const HistoryList = ({ entries, }: HistoryListProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 text-center">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Fecha/Hora
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                                        {formatDateTime(entry.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                                        {entry.username}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                                        {entry.action}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay registros en el historial
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryList;
