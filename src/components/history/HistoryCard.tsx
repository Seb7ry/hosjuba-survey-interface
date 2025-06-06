import { formatDateTime } from "../Utils";

type HistoryEntry = {
    id: string;
    timestamp: string;
    username: string;
    action: string;
    details?: string;
};

type HistoryCardProps = {
    entries: HistoryEntry[];
    onViewDetails: (id: string) => void;
};

const HistoryCard = ({ entries, }: HistoryCardProps) => {
    return (
        <div>
            {entries.length > 0 ? (
                entries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{entry.action}</h3>
                                <p className="text-sm text-gray-500">
                                    {formatDateTime(entry.timestamp)}
                                </p>
                            </div>

                        </div>
                        <div className="mt-2 text-sm">
                            <p><span className="font-medium">Usuario:</span> {entry.username}</p>

                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                    No hay registros en el historial
                </div>
            )}
        </div>
    );
};

export default HistoryCard;