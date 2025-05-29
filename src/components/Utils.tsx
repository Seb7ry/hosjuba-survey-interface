export const getStatusStyles = (estado: string) => {
    switch (estado) {
        case "Abierto":
            return "bg-yellow-200 text-yellow-800 border-yellow-400 px-3 py-1 rounded-full text-sm";
        case "En proceso":
            return "bg-blue-200 text-blue-800 border-blue-400 px-3 py-1 rounded-full text-sm";
        case "Cerrado":
            return "bg-green-200 text-green-800 border-green-400 px-3 py-1 rounded-full text-sm";
        default:
            return "bg-gray-200 text-gray-800 border-gray-400 px-3 py-1 rounded-full text-sm";
    }
};

export const getPriorityStyles = (prioridad: string) => {
    switch (prioridad) {
        case "Alta":
            return "bg-red-200 text-red-800 border-red-400 px-3 py-1 rounded-full text-sm";
        case "Media":
            return "bg-orange-200 text-orange-800 border-orange-400 px-3 py-1 rounded-full text-sm";
        case "Baja":
            return "bg-green-200 text-green-800 border-green-400 px-3 py-1 rounded-full text-sm";
        case "Crítico":
            return "bg-purple-200 text-purple-800 border-purple-400 px-3 py-1 rounded-full text-sm font-bold";
        default:
            return "bg-gray-200 text-gray-800 border-gray-400 px-3 py-1 rounded-full text-sm";
    }
};

export const formatDateTime = (isoString: string) => {
    if (!isoString) return 'Fecha no disponible';

    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida recibida:', isoString);
            return 'Fecha inválida';
        }

        return date.toLocaleString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error, 'Valor:', isoString);
        return 'Fecha inválida';
    }
};

export const formatLabel = (key: string) => {
    const prepositions = ["de", "del", "la", "el", "y", "en", "con", "para", "a", "por", "las", "los", "al"];
    return key
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .split(/[\s_]+/)
        .map((word, i) =>
            prepositions.includes(word) && i !== 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
};
