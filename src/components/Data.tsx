import { useState } from "react";

export const useFormCorrective = () => {
    const [formData, setFormData] = useState({
        caseNumber: "202X",
        toRating: false,
        rated: false,
        typeCase: "Mantenimiento",
        serviceType: "",
        dependency: "",
        status: "Abierto",
        reportedAt: "",
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
        effectivenessRating: {
            value: 0
        },
        satisfactionRating: {
            value: 0
        },
        serviceData: {
            description: "",
            attendedAt: "",
            solvedAt: "",
            priority: "",
            category: "",
            level: "",
            diagnosis: "",
            solution: "",
            requiresEscalation: false,
            escalationTechnician: {
                _id: "",
                name: "",
                position: "",
                department: "",
                signature: "",
                level: ""
            },
            equipments: [{
                name: "",
                type: "",
                brand: "",
                model: "",
                serial: "",
                inventoryNumber: "",
                convention:"",
            }],
            materials: [{
                quantity: 0,
                description: ""
            }],
        }
    });

    return { formData, setFormData };
};

export const useFormPreventive = () => {
    const [formData, setFormData] = useState({
        caseNumber: "202X",
        toRating: false,
        rated: false,
        typeCase: "Preventivo",
        serviceType: "Mantenimiento Preventivo",
        dependency: "",
        status: "Abierto",
        reportedAt: "",
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
        effectivenessRating: {
            value: 0
        },
        satisfactionRating: {
            value: 0
        },
        serviceData: {
            name: "",
            type: "",
            brand: "",
            model: "",
            serial: "",
            numberInventory: "",
            location: "",
            hardware: {
                limpiezaDeVentiladores: { enabled: false, value: false },
                limpiezaUnidadesDeAlmacenamiento: { enabled: false, value: false },
                limpiezaDeModulosDeMemoria: { enabled: false, value: false },
                limpiezaDeTarjetasYPlacaMadre: { enabled: false, value: false },
                limpiezaFuenteDePoder: { enabled: false, value: false },
                limpiezaExternaChasis: { enabled: false, value: false },
                reconexionYAjusteDeProcesador: { enabled: false, value: false },
                reconexionYAjusteDeModulosDeMemoriaRam: { enabled: false, value: false },
                reconexionYAjusteTarjetasDeExpansion: { enabled: false, value: false },
                reconexionYAjusteDeUnidadesDeAlmacenamiento: { enabled: false, value: false },
                reconexionYAjusteDeFuenteDePoder: { enabled: false, value: false },
                reconexionYAjusteDePuertosDeChasis: { enabled: false, value: false },
                reconexionYAjusteDeTeclado: { enabled: false, value: false },
                reconexionYAjusteDeMouse: { enabled: false, value: false },
                reconexionYAjusteDeMonitor: { enabled: false, value: false },
                reconexionYAjusteImpresora: { enabled: false, value: false },
                reconexionYAjusteDeEscaner: { enabled: false, value: false },
                reconexionYAjusteDeCableDePoder: { enabled: false, value: false },
                reconexionYAjusteDeClabeDeRed: { enabled: false, value: false },
                reconexionYAjusteDeAdaptadorDeCorriente: { enabled: false, value: false },
                verificacionDeFuncionamiento: { enabled: false, value: false },
                inventarioDeHardware: { enabled: false, value: false }
            },
            software: {
                actualizacionOCambioDelSistemaOperativo: { enabled: false, value: false },
                confirmarUsuarioYContrasenaAdministradorLocal: { enabled: false, value: false },
                confirmarOAsignarContrasenaEstandar: { enabled: false, value: false },
                configuracionDeSegmentoDeRedYDnsDeConexionADominioEInternet: { enabled: false, value: false },
                identificacionDeUnidadesDeAlmacenamiento: { enabled: false, value: false },
                comprobacionYReparacionDeErroresDeDiscoDuro: { enabled: false, value: false },
                desfragmentacionDeDiscoDuro: { enabled: false, value: false },
                eliminacionDeArchivosTemporales: { enabled: false, value: false },
                actualizacionConfiguracionYSolucionesDeSeguridadInformaticaTraficoSeguro: { enabled: false, value: false },
                confirmarSeguridadDeWindowsBitlockerEnParticionesDeDisco: { enabled: false, value: false },
                confirmarInstalarYConfigurarServicioDeMensajeriaInterna: { enabled: false, value: false },
                confirmarInstalarServicioRemotoYHabilitarReglasEnElFirewall: { enabled: false, value: false },
                confirmarUsuarioDeDominioEnActiveDirectoryDeAcuerdoAlServicio: { enabled: false, value: false },
                confirmacionDeAplicacionesEquiposDeUsoAsistencial: { enabled: false, value: false },
                confirmacionDeAplicacionesEquiposDeUsoAdministrativo: { enabled: false, value: false },
                confirmacionDeUnidadDeAlmacenamientoDestinadaParaElUsuario: { enabled: false, value: false },
                instalarRecursosCompartidosImpresorasOEscaner: { enabled: false, value: false },
                configuracionServicioDeNubeYServiciosTecnologicos: { enabled: false, value: false },
                activacionPlanDeEnergia: { enabled: false, value: false },
                crearPuntoDeRestauracion: { enabled: false, value: false },
                inventarioDeSoftware: { enabled: false, value: false }
            },
            printers: {
                limpiezaInterna: { enabled: false, value: false },
                lubricacionYAjusteSistemaEngranaje: { enabled: false, value: false },
                limpiezaExterna: { enabled: false, value: false },
                verificacionDeFuncionamiento: { enabled: false, value: false },
                activacionModoBorradorYAhorroDeEnergia: { enabled: false, value: false }
            },
            phones: {
                verificacionYAjusteDeCablesDeConexion: { enabled: false, value: false },
                verificacionDeFuncionamiento: { enabled: false, value: false },
                verificacionDeDisponibilidadYFuncionamientoDeLaExtensionTelefonica: { enabled: false, value: false },
                limpieza: { enabled: false, value: false }
            },
            scanners: {
                verificacionYAjusteDeCablesDeConexion: { enabled: false, value: false },
                verificacionDeFuncionamiento: { enabled: false, value: false },
                limpieza: { enabled: false, value: false }
            }
        }
    });

    return { formData, setFormData };
};

export const serviceCategories = [
    "Ayudas Audiovisuales",
    "CCTV",
    "Correo Electronico - Sitio Web",
    "Directorio Activo",
    "Hardware",
    "Herramientas Ofimaticas",
    "Mantenimientos Preventivos",
    "Perifericos",
    "Red",
    "Seguridad",
    "Sistemas de Informacion Externos",
    "Sistemas de Informacion Internos",
    "Sistema Electrico Regulado",
    "Software",
    "Telefonia",
    "Traslado e Instalación",
    "Videoconferencia",
] as const;
export type ServiceCategory = typeof serviceCategories[number];

export const serviceLevels = [
    "Soporte Nivel 1",
    "Soporte Nivel 2",
    "Soporte Nivel 3",
    "ANS Basado en el Servicio",
] as const;
export type ServiceLevel = typeof serviceLevels[number];

export const serviceConventions = [
    { classification: "A", text: "Se encuentra en estado de obsolecencia tecnológica para la entidad." },
    { classification: "B", text: "Se encuentra en estado inservible, para dar de baja." },
    { classification: "C", text: "Se encuentra en estado funcionalmente bueno, se sugiere la permanencia del mismo." },
    { classification: "D", text: "Se encuentra averiado debe ser reparado y/o actualizado." },
] as const;

export type ServiceConvention = typeof serviceConventions[number]['text'];