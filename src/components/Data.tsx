import { useState } from "react";

export const useFormPreventive = () => {
    const [formData, setFormData] = useState({
        caseNumber: "",
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
            type: "",
            brand: "",
            model: "",
            serial: "",
            inventoryNumber: "",
            hardware: {
                limpiezaDeVentiladores: false,
                limpiezaUnidadesDeAlmacenamiento: false,
                limpiezaDeModulosDeMemoria: false,
                limpiezaDeTarjetasYPlacaMadre: false,
                limpiezaFuenteDePoder: false,
                limpiezaExternaChasis: false,
                reconexionYAjusteDeProcesador: false,
                reconexionYAjusteDeModulosDeMemoriaRAM: false,
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
        caseNumber: "",
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
            attendedAt: "",
            solvedAt: "",
            priority: "",
            category: "",
            level: "",
            equipments: [{
                name: "",
                brand: "",
                model: "",
                serial: "",
                inventoryNumber: ""
            }],
            diagnosis: "",
            solution: "",
            conventions: 0,
            materials: [{
                quantity: 0,
                description: ""
            }],
            requiresEscalation: false,
            escalatedTechnician: {
                _id: "",
                name: "",
                position: "",
                department: "",
                signature: ""
            }
        }
    });

    return { formData, setFormData };
};