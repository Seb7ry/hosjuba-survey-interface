export type Technician = {
  _id: string;
  name: string;
  position: string;
  signature: string;
};

export type ReportedBy = {
  _id: string;
  name: string;
  position: string;
  department: string;
};

export type BaseCase = {
  caseNumber: string;
  toRating: boolean;
  typeCase: "Preventivo" | "Mantenimiento";
  serviceType: string;
  dependency: string;
  status: string;
  reportedAt: string;
  observations: string;
  reportedBy: ReportedBy;
  assignedTechnician: Technician;
  effectivenessRating: { value: number };
  satisfactionRating: { value: number };
};

export type PreventiveServiceData = {
  name: string,
  type: string,
  brand: string,
  model: string,
  serial: string,
  numberInventory: string,
  location: string,
  hardware: {
    limpiezaDeVentiladores: boolean,
    limpiezaUnidadesDeAlmacenamiento: boolean,
    limpiezaDeModulosDeMemoria: boolean,
    limpiezaDeTarjetasYPlacaMadre: boolean,
    limpiezaFuenteDePoder: boolean,
    limpiezaExternaChasis: boolean,
    reconexionYAjusteDeProcesador: boolean,
    reconexionYAjusteDeModulosDeMemoriaRam: boolean,
    reconexionYAjusteTarjetasDeExpansion: boolean,
    reconexionYAjusteDeUnidadesDeAlmacenamiento: boolean,
    reconexionYAjusteDeFuenteDePoder: boolean,
    reconexionYAjusteDePuertosDeChasis: boolean,
    reconexionYAjusteDeTeclado: boolean,
    reconexionYAjusteDeMouse: boolean,
    reconexionYAjusteDeMonitor: boolean,
    reconexionYAjusteImpresora: boolean,
    reconexionYAjusteDeEscaner: boolean,
    reconexionYAjusteDeCableDePoder: boolean,
    reconexionYAjusteDeClabeDeRed: boolean,
    reconexionYAjusteDeAdaptadorDeCorriente: boolean,
    verificacionDeFuncionamiento: boolean,
    inventarioDeHardware: boolean
  };
  software: {
    actualizacionOCambioDelSistemaOperativo: boolean,
    confirmarUsuarioYContrasenaAdministradorLocal: boolean,
    confirmarOAsignarContrasenaEstandar: boolean,
    configuracionDeSegmentoDeRedYDnsDeConexionADominioEInternet: boolean,
    identificacionDeUnidadesDeAlmacenamiento: boolean,
    comprobacionYReparacionDeErroresDeDiscoDuro: boolean,
    desfragmentacionDeDiscoDuro: boolean,
    eliminacionDeArchivosTemporales: boolean,
    actualizacionConfiguracionYSolucionesDeSeguridadInformaticaTraficoSeguro: boolean,
    confirmarSeguridadDeWindowsBitlockerEnParticionesDeDisco: boolean,
    confirmarInstalarYConfigurarServicioDeMensajeriaInterna: boolean,
    confirmarInstalarServicioRemotoYHabilitarReglasEnElFirewall: boolean,
    confirmarUsuarioDeDominioEnActiveDirectoryDeAcuerdoAlServicio: boolean,
    confirmacionDeAplicacionesEquiposDeUsoAsistencial: boolean,
    confirmacionDeAplicacionesEquiposDeUsoAdministrativo: boolean,
    confirmacionDeUnidadDeAlmacenamientoDestinadaParaElUsuario: boolean,
    instalarRecursosCompartidosImpresorasOEscaner: boolean,
    configuracionServicioDeNubeYServiciosTecnologicos: boolean,
    activacionPlanDeEnergia: boolean,
    crearPuntoDeRestauracion: boolean,
    inventarioDeSoftware: boolean
  };
  printers: {
    limpiezaInterna: boolean,
    lubricacionYAjusteSistemaEngranaje: boolean,
    limpiezaExterna: boolean,
    verificacionDeFuncionamiento: boolean,
    activacionModoBorradorYAhorroDeEnergia: boolean
  };
  phones: {
    verificacionYAjusteDeCablesDeConexion: boolean,
    verificacionDeFuncionamiento: boolean,
    verificacionDeDisponibilidadYFuncionamientoDeLaExtensionTelefonica: boolean,
    limpieza: boolean
  };
  scanners: {
    verificacionYAjusteDeCablesDeConexion: boolean,
    verificacionDeFuncionamiento: boolean,
    limpieza: boolean
  };
};

export type PreventiveCase = BaseCase & {
  typeCase: "Preventivo";
  serviceData: PreventiveServiceData;
};


export type CorrectiveServiceData = {
  description: string;
  attendedAt: string;
  solvedAt: string;
  priority: string;
  category: string;
  level: string;
  diagnosis: string;
  solution: string;
  requiresEscalation: boolean;
  escalationTechnician: Technician;
  escalatedTechnician: Technician & { department: string; level: string };
  equipments: Array<{
    name: string;
    type: string;
    brand: string;
    model: string;
    serial: string;
    inventoryNumber: string;
  }>;
  materials: Array<{
    quantity: number;
    description: string;
  }>;
};

export type CorrectiveCase = BaseCase & {
  typeCase: "Mantenimiento";
  serviceData: CorrectiveServiceData;
};

export type CaseFormData = PreventiveCase | CorrectiveCase;
