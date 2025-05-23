import { formatLabel } from "../../Utils";
import GroupItem from "../../GroupItem";
import React from "react";

interface PreventiveBodyProps {
    formData: any;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreventiveBody = React.memo(({ formData, handleCheckboxChange }: PreventiveBodyProps) => {
    const checkboxStyle = "h-5 w-5 min-h-[20px] min-w-[20px] text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2";
    const labelStyle = "block text-sm text-gray-700";
    const itemStyle = "flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50";

    return (
        <div className="space-y-6">
            {/* Sección de mantenimiento de hardware */}
            <GroupItem title="Mantenimiento de Hardware (Computadores)">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(formData.serviceData.hardware).map(([key, value]) => (
                        <div key={`hardware-${key}`} className={itemStyle}>
                            <input
                                type="checkbox"
                                id={`hardware-${key}`}
                                name={`serviceData.hardware.${key}`}
                                checked={value as boolean}
                                onChange={handleCheckboxChange}
                                className={checkboxStyle}
                            />
                            <label htmlFor={`hardware-${key}`} className={labelStyle}>
                                {formatLabel(key)}
                            </label>
                        </div>
                    ))}
                </div>
            </GroupItem>

            {/* Sección de mantenimiento de software */}
            <GroupItem title="Mantenimiento de Software (Computadores)">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(formData.serviceData.software).map(([key, value]) => (
                        <div key={`software-${key}`} className={itemStyle}>
                            <input
                                type="checkbox"
                                id={`software-${key}`}
                                name={`serviceData.software.${key}`}
                                checked={value as boolean}
                                onChange={handleCheckboxChange}
                                className={checkboxStyle}
                            />
                            <label htmlFor={`software-${key}`} className={labelStyle}>
                                {formatLabel(key)}
                            </label>
                        </div>
                    ))}
                </div>
            </GroupItem>

            {/* Sección de impresoras */}
            <GroupItem title="Mantenimiento de Impresoras">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(formData.serviceData.printers).map(([key, value]) => (
                        <div key={`printers-${key}`} className={itemStyle}>
                            <input
                                type="checkbox"
                                id={`printers-${key}`}
                                name={`serviceData.printers.${key}`}
                                checked={value as boolean}
                                onChange={handleCheckboxChange}
                                className={checkboxStyle}
                            />
                            <label htmlFor={`printers-${key}`} className={labelStyle}>
                                {formatLabel(key)}
                            </label>
                        </div>
                    ))}
                </div>
            </GroupItem>

            {/* Sección de teléfonos */}
            <GroupItem title="Mantenimiento de Teléfonos">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(formData.serviceData.phones).map(([key, value]) => (
                        <div key={`phones-${key}`} className={itemStyle}>
                            <input
                                type="checkbox"
                                id={`phones-${key}`}
                                name={`serviceData.phones.${key}`}
                                checked={value as boolean}
                                onChange={handleCheckboxChange}
                                className={checkboxStyle}
                            />
                            <label htmlFor={`phones-${key}`} className={labelStyle}>
                                {formatLabel(key)}
                            </label>
                        </div>
                    ))}
                </div>
            </GroupItem>

            {/* Sección de escáneres */}
            <GroupItem title="Mantenimiento de Escáneres">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(formData.serviceData.scanners).map(([key, value]) => (
                        <div key={`scanners-${key}`} className={itemStyle}>
                            <input
                                type="checkbox"
                                id={`scanners-${key}`}
                                name={`serviceData.scanners.${key}`}
                                checked={value as boolean}
                                onChange={handleCheckboxChange}
                                className={checkboxStyle}
                            />
                            <label htmlFor={`scanners-${key}`} className={labelStyle}>
                                {formatLabel(key)}
                            </label>
                        </div>
                    ))}
                </div>
            </GroupItem>
        </div>
    );
});

export default PreventiveBody;