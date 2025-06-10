import React from "react";
import GroupItem from "../../GroupItem";
import { formatLabel } from "../../Utils";

interface PreventiveBodyProps {
    formData: {
        serviceData: Record<string, Record<string, { enabled: boolean; value: boolean }>>;
    };
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEnableToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreventiveBody = React.memo(({ formData, handleCheckboxChange, handleEnableToggle }: PreventiveBodyProps) => {
    const checkboxBaseStyle = "h-5 w-5 min-h-[20px] min-w-[20px] border-gray-300 rounded";
    const enabledCheckboxStyle = `${checkboxBaseStyle} accent-yellow-500 mr-1`;
    const valueCheckboxStyle = `${checkboxBaseStyle} accent-blue-600 mr-1`;
    const disabledCheckboxStyle = `${checkboxBaseStyle} accent-gray-400 cursor-not-allowed mr-1`;
    const labelStyle = "text-sm text-gray-700 ml-2"; 
    const itemStyle = "flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50";

    const renderItems = (sectionKey: string, sectionData: Record<string, { enabled: boolean; value: boolean }>) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(sectionData).map(([key, { enabled, value }]) => (
                <div key={`${sectionKey}-${key}`} className={itemStyle}>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name={`serviceData.${sectionKey}.${key}.enabled`}
                            checked={enabled}
                            onChange={handleEnableToggle}
                            className={enabledCheckboxStyle}
                            id={`enabled-${sectionKey}-${key}`}
                        />
                        <input
                            type="checkbox"
                            name={`serviceData.${sectionKey}.${key}.value`}
                            checked={value}
                            disabled={!enabled}
                            onChange={handleCheckboxChange}
                            className={enabled ? valueCheckboxStyle : disabledCheckboxStyle}
                            id={`value-${sectionKey}-${key}`}
                        />
                        <label htmlFor={`enabled-${sectionKey}-${key}`} className={labelStyle}>
                            {formatLabel(key)}
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <GroupItem title="Mantenimiento de Hardware (Computadores)">
                {renderItems("hardware", formData.serviceData.hardware)}
            </GroupItem>
            <GroupItem title="Mantenimiento de Software (Computadores)">
                {renderItems("software", formData.serviceData.software)}
            </GroupItem>
            <GroupItem title="Mantenimiento de Impresoras">
                {renderItems("printers", formData.serviceData.printers)}
            </GroupItem>
            <GroupItem title="Mantenimiento de Teléfonos">
                {renderItems("phones", formData.serviceData.phones)}
            </GroupItem>
            <GroupItem title="Mantenimiento de Escáneres">
                {renderItems("scanners", formData.serviceData.scanners)}
            </GroupItem>
        </div>
    );
});


export default PreventiveBody;