import { useState } from "react";

export const useFormData = (initialType: "Preventivo" | "Correctivo" = "Preventivo") => {
    const [formData, setFormData] = useState({
        typeCase: initialType,
        serviceType: "",
        dependency: "",
        status: "Abierto",
        reportedAt: new Date().toISOString(),
        observations: "",
        reportedBy: {
            _id: "",
            name: "",
            position: "",
            department: ""
        },
        assignedTechnician: {
            _id: "",
            name: "",
            position: "",
            signature: ""
        },
        serviceData: {
            type: "",
            brand: "",
            model: "",
            serial: "",
            inventoryNumber: ""
        },
        hardware: {
            cleanFans: false,
            cleanStorageUnits: false,
            cleanMemoryModules: false,
            cleanMotherboard: false,
            cleanPowerSupply: false,
            cleanChassis: false,
            reconnectProcessor: false,
            reconnectRAM: false,
            reconnectExpansionCards: false,
            reconnectStorageUnits: false,
            reconnectPowerSupply: false,
            reconnectChassisPorts: false,
            reconnectKeyboard: false,
            reconnectMouse: false,
            reconnectMonitor: false,
            reconnectPrinter: false,
            reconnectScanner: false,
            reconnectPowerCable: false,
            reconnectNetworkCable: false,
            reconnectCharger: false,
            functionCheck: false,
            hardwareInventory: false
        },
        software: {
            osUpdate: false,
            localAdminPassword: false,
            standardUserPassword: false,
            networkConfig: false,
            identifyStorage: false,
            repairDiskErrors: false,
            defragDisk: false,
            deleteTempFiles: false,
            securityUpdate: false,
            bitlockerCheck: false,
            messagingService: false,
            remoteAccessFirewall: false,
            domainUserCheck: false,
            assistiveApps: false,
            adminApps: false,
            userStorage: false,
            sharedResources: false,
            cloudServiceConfig: false,
            powerPlan: false,
            createRestorePoint: false,
            softwareInventory: false
        },
        printers: {
            internalCleaning: false,
            gearLubrication: false,
            externalCleaning: false,
            functionCheck: false,
            draftMode: false
        },
        phones: {
            cableCheck: false,
            functionCheck: false,
            extensionCheck: false,
            cleaning: false
        },
        scanners: {
            cableCheck: false,
            functionCheck: false,
            cleaning: false
        }
    });

    return { formData, setFormData };
};
