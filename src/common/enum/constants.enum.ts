export enum Constants {
  SincronizarEventosSignificativos = 'sincronizarParametricaEventosSignificativos',
  EventosSignificativos = 'EventosSignificativos',
  SincronizarListaMensajesServicios = 'sincronizarListaMensajesServicios',
  MensajesServicios = 'MensajesServicios',
  SincronizarParametricaMotivoAnulacion = 'sincronizarParametricaMotivoAnulacion',
  MotivoAnulacion = 'MotivoAnulacion',
  SincronizarParametricaPaisOrigen = 'sincronizarParametricaPaisOrigen',
  PaisOrigen = 'PaisOrigen',
  SincronizarParametricaTipoDocumentoIdentidad = 'sincronizarParametricaTipoDocumentoIdentidad',
  TipoDocumentoIdentidad = 'TipoDocumentoIdentidad',
  SincronizarParametricaTipoDocumentoSector = 'sincronizarParametricaTipoDocumentoSector',
  TipoDocumentoSector = 'TipoDocumentoSector',
  SincronizarParametricaTipoHabitacion = 'sincronizarParametricaTipoHabitacion',
  TipoHabitacion = 'TipoHabitacion',
  SincronizarParametricaTipoMetodoPago = 'sincronizarParametricaTipoMetodoPago',
  TipoMetodoPago = 'TipoMetodoPago',
  SincronizarParametricaTipoMoneda = 'sincronizarParametricaTipoMoneda',
  TipoMoneda = 'TipoMoneda',
  SincronizarParametricaTipoPuntoVenta = 'sincronizarParametricaTipoPuntoVenta',
  TipoPuntoVenta = 'TipoPuntoVenta',
  SincronizarParametricaTiposFactura = 'sincronizarParametricaTiposFactura',
  TiposFactura = 'TiposFactura',
  SincronizarParametricaUnidadMedida = 'sincronizarParametricaUnidadMedida',
  UnidadMedida = 'UnidadMedida',
  SincronizarParametricaTipoEmision = 'sincronizarParametricaTipoEmision',
  TipoEmision = 'TipoEmision',
  ActivitiesDocumentSector = 'ActividadesDocumentoSector',

  BillStatusNew = 0,
  BillStatusSentUnconfirmed = 1,
  BillStatusSent = 2,
  BillStatusAnnulled = 3,
  BillStatusSentError = 4,
  BillStatusValidationError = 5,
  BillStatusAdjusted = 6,

  ElectronicOnlineBilling = 1,
  ComputerizedOnlineBilling = 2,

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  EmitterTypeOnline = 1,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  EmitterTypeContingency = 2,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  EmitterTypeMassive = 3,

  DocumentTypeNit = '5',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DocumentTaxCodeBill = 1,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DocumentTaxCodeBillWithoitIva = 2,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DocumentTaxCodeNote = 3,


  EventStatusNew = 0,
  EventStatusClose = 1,
  EventStatusSentPackages = 2,

  TypeDosification = 'CUIS',
}
