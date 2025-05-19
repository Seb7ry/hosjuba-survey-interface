import { useState } from "react";

export const useFormPreventive = () => {
    const [formData, setFormData] = useState({
        caseNumber: "202X",
        typeCase: "Preventivo",
        serviceType: "Mantenimiento Preventivo",
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
            name: "",
            type: "",
            brand: "",
            model: "",
            serial: "",
            numberInventory: "",
            location: "",
            hardware: {
                limpiezaDeVentiladores: false,
                limpiezaUnidadesDeAlmacenamiento: false,
                limpiezaDeModulosDeMemoria: false,
                limpiezaDeTarjetasYPlacaMadre: false,
                limpiezaFuenteDePoder: false,
                limpiezaExternaChasis: false,
                reconexionYAjusteDeProcesador: false,
                reconexionYAjusteDeModulosDeMemoriaRam: false,
                reconexionYAjusteTarjetasDeExpansion: false,
                reconexionYAjusteDeUnidadesDeAlmacenamiento: false,
                reconexionYAjusteDeFuenteDePoder: false,
                reconexionYAjusteDePuertosDeChasis: false,
                reconexionYAjusteDeTeclado: false,
                reconexionYAjusteDeMouse: false,
                reconexionYAjusteDeMonitor: false,
                reconexionYAjusteImpresora: false,
                reconexionYAjusteDeEscaner: false,
                reconexionYAjusteDeCableDePoder: false,
                reconexionYAjusteDeClabeDeRed: false,
                reconexionYAjusteDeAdaptadorDeCorriente: false,
                verificacionDeFuncionamiento: false,
                inventarioDeHardware: false
            },
            software: {
                actualizacionOCambioDelSistemaOperativo: false,
                confirmarUsuarioYContrasenaAdministradorLocal: false,
                confirmarOAsignarContrasenaEstandar: false,
                configuracionDeSegmentoDeRedYDnsDeConexionADominioEInternet: false,
                identificacionDeUnidadesDeAlmacenamiento: false,
                comprobacionYReparacionDeErroresDeDiscoDuro: false,
                desfragmentacionDeDiscoDuro: false,
                eliminacionDeArchivosTemporales: false,
                actualizacionConfiguracionYSolucionesDeSeguridadInformaticaTraficoSeguro: false,
                confirmarSeguridadDeWindowsBitlockerEnParticionesDeDisco: false,
                confirmarInstalarYConfigurarServicioDeMensajeriaInterna: false,
                confirmarInstalarServicioRemotoYHabilitarReglasEnElFirewall: false,
                confirmarUsuarioDeDominioEnActiveDirectoryDeAcuerdoAlServicio: false,
                confirmacionDeAplicacionesEquiposDeUsoAsistencial: false,
                confirmacionDeAplicacionesEquiposDeUsoAdministrativo: false,
                confirmacionDeUnidadDeAlmacenamientoDestinadaParaElUsuario: false,
                instalarRecursosCompartidosImpresorasOEscaner: false,
                configuracionServicioDeNubeYServiciosTecnologicos: false,
                activacionPlanDeEnergia: false,
                crearPuntoDeRestauracion: false,
                inventarioDeSoftware: false
            },
            printers: {
                limpiezaInterna: false,
                lubricacionYAjusteSistemaEngranaje: false,
                limpiezaExterna: false,
                verificacionDeFuncionamiento: false,
                activacionModoBorradorYAhorroDeEnergia: false
            },
            phones: {
                verificacionYAjusteDeCablesDeConexion: false,
                verificacionDeFuncionamiento: false,
                verificacionDeDisponibilidadYFuncionamientoDeLaExtensionTelefonica: false,
                limpieza: false
            },
            scanners: {
                verificacionYAjusteDeCablesDeConexion: false,
                verificacionDeFuncionamiento: false,
                limpieza: false
            }
        }
    });

    return { formData, setFormData };
};

export const useFormCorrective = () => {
    const [formData, setFormData] = useState({
        caseNumber: "202X",
        typeCase: "Mantenimiento",
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
            description:"",
            attendedAt: "",
            solvedAt: "",
            priority: "",
            category: "",
            level: "",
            diagnosis: "",
            solution: "",
            requiresEscalation: false,
            equipments: [{
                name: "",
                type: "",
                brand: "",
                model: "",
                serial: "",
                inventoryNumber: ""
            }],
            materials: [{
                quantity: 0,
                description: ""
            }],
            escalatedTechnician: {
                _id: "",
                name: "",
                position: "",
                department: "",
                signature: "",
                level: ""
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