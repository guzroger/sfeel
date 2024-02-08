
insert into ge_constant_group (code_group, description) values('APP_CONFIG', 'CONFIGURACIONES DE SISTEMA');
insert into ge_constant_group (code_group, description) values('WS_URL', 'URL SERVICES GENERAL');
insert into ge_constant_group (code_group, description) values('TIPO_EVENTO', 'TIPO_EVENTO');
insert into ge_constant_group (code_group, description) values('TIPO_PUNTO_VENTA', 'TIPOS DE PUNTO DE VENTA');
insert into ge_constant_group (code_group, description) values('CODIGO_MODALIDAD', 'CODIGO_MODALIDAD');
insert into ge_constant_group (code_group, description) values('CODIGO_AMBIENTE', 'AMBIENTES');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('AMBIENTE', 'APP_CONFIG', 'AMBIENTE', '2' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('URL_QR', 'APP_CONFIG', 'URL_QR', 'https://pilotosiat.impuestos.gob.bo/consulta/QR' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('URL_PING_SIN', 'APP_CONFIG', 'URL_PING_SIN', 'https://pilotosiatservicios.impuestos.gob.bo' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('URL_PING_INTERNET', 'APP_CONFIG', 'URL_PING_INTERNET', 'https://www.google.com.bo' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('NOTE_ONLINE', 'APP_CONFIG', 'NOTE_ONLINE', 'Este documento es la Representación Gráfica de un Documento Fiscal Digital emitido en una modalidad de facturación en línea' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('NOTE_OFFLINE', 'APP_CONFIG', 'NOTE_OFFLINE', 'Este documento es la Representación Gráfica de un Documento Fiscal Digital emitido fuera de línea, verifique su envío con su proveedor o en la página web www.impuestos.gob.bo' , current_date, current_date, null);


insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('CODIGO_SISTEMA', 'APP_CONFIG', 'CODIGO_SISTEMA', '776EDD90B3B4CF5AE09CAD7' , current_date, current_date, null);


insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('FACTURACION_OPERACIONES', 'WS_URL', 'FACTURACION_OPERACIONES', 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionOperaciones' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('SINCRONIZACION_CATALOGOS', 'WS_URL', 'SINCRONIZACION CATALOGOS', 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion' , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('SOLICITUD_CODIGOS', 'WS_URL', 'SOLICITUD_CODIGOS', 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos' , current_date, current_date, null);




insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('1', 'TIPO_EVENTO', 'CORTE DEL SERVICIO', '3' , current_date, current_date, 'RND 1021-11, artículo 29 El CUFD se extenderá hasta 72 horas');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('2', 'TIPO_EVENTO', 'INACCESIBILIDAD AL SERVICIO WEB', '3' , current_date, current_date, 'RND 1021-11, artículo 29 El CUFD se extenderá hasta 72 horas');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('3', 'TIPO_EVENTO', 'INGRESO A ZONAS SIN INTERNET', '15' , current_date, current_date, 'RND 1021-11, artículo 29 El CUFD se extenderá hasta 15 dias');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('4', 'TIPO_EVENTO', 'VENTA EN LUGARES SIN INTERNET', '15' , current_date, current_date, 'RND 1021-11, artículo 29 El CUFD se extenderá hasta 15 dias');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('5', 'TIPO_EVENTO', 'CORTE DE SUMINISTRO DE ENERGIA ELECTRICA', '0' , current_date, current_date, 'RND 1021-11, se debe de reportar la contigencia hasta 48 horas posteriores a la finlaizada la contingencia');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('6', 'TIPO_EVENTO', 'VIRUS INFORMÁTICO O FALLA DE SOFTWARE', '0' , current_date, current_date, 'RND 1021-11, se debe de reportar la contigencia hasta 48 horas posteriores a la finlaizada la contingencia');

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('7', 'TIPO_EVENTO', 'CAMBIO DE INFRAESTRUCTURA DEL SISTEMA INFORMÁTICO', '0' , current_date, current_date, 'RND 1021-11, se debe de reportar la contigencia hasta 48 horas posteriores a la finlaizada la contingencia');


insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('1', 'CODIGO_MODALIDAD', 'Electrónica en línea', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('2', 'CODIGO_MODALIDAD', 'Computarizada en línea', null , current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('1', 'TIPO_PUNTO_VENTA', 'Punto Venta Comisionista', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('2', 'TIPO_PUNTO_VENTA', 'Punto Venta Ventanilla de Cobranza', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('3', 'TIPO_PUNTO_VENTA', 'Punto de Venta Móviles', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('4', 'TIPO_PUNTO_VENTA', 'Punto de Venta YPFB', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('5', 'TIPO_PUNTO_VENTA', 'Punto de Venta Cajeros', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('6', 'TIPO_PUNTO_VENTA', 'Punto de Venta Conjunta', null, current_date, current_date, null);


insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('1', 'CODIGO_AMBIENTE', 'Producción', null, current_date, current_date, null);

insert into ge_constant (code, code_group, description, value, created_at, updated_at, observation)
values('2', 'CODIGO_AMBIENTE', 'Pruebas y Piloto', null, current_date, current_date, null);



insert into eb_system(id, system_code, business, modality_code, created_at, updated_at, status, image, nit)
values(nextval('eb_system_id_seq'), '776EDD90B3B4CF5AE09CAD7', 'GUZMAN CARTAGENA ROGER', 1, current_date, current_date, 'ACTIVE', null, 4514158014);


insert into eb_token(id, token, created_at, updated_at, system_id, expiration_at, start_at)
values(nextval('eb_token_id_seq'), 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZ3V6bWFuYyIsImNvZGlnb1Npc3RlbWEiOiI3NzZFREQ5MEIzQjRDRjVBRTA5Q0FENyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETXhOVFF4TkxVd01EUUJBQ3c0aGFNS0FBQUEiLCJpZCI6MzAxNjc3MywiZXhwIjoxNzMzOTYxNjAwLCJpYXQiOjE3MDI0NzY4NzgsIm5pdERlbGVnYWRvIjo0NTE0MTU4MDE0LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.vqrf_cnNmtLT0HY6ISE0C123pwz1uUsao8-3BYtVu3kbsXYGXmKrepFIYB4MSVemlxgWQIYao_8QdE86lsF-gw',
current_date, current_date, currval('eb_system_id_seq'), '2024-12-12 00:00:00.172', '2023-12-13 00:00:00.172');

insert into eb_sucursal(id, sucursal_code, description, modality_code, address, phone, municipality, city, status, created_at, updated_at, system_id)
values(nextval('eb_sucursal_id_seq'), '0', 'CASA MATRIZ', '1', 'CALLE LA PAZ', '777777', 'Cochabamba', null, 'ACTIVE', current_date, current_date,  currval('eb_system_id_seq'));

insert into eb_bill_status values(0, 'Nuevo');
insert into eb_bill_status values(1, 'Enviado sin confirmar');
insert into eb_bill_status values(2, 'Enviado');
insert into eb_bill_status values(3, 'Anulado');
insert into eb_bill_status values(4, 'Error');
insert into eb_bill_status values(5, 'Error validacion');

insert into eb_package_bill(package_id,  bill_status_id, nit_emitter, sucursal_code, sale_point_code, emitte_type, modality_code, sector_document_code,  system_code, created_at, document_tax_code)
values(-1, 0, 0, 0, 0, 1, 1, 1,  '776EDD90B3B4CF5AE09CAD7', current_date , 1);

insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec, document_tax_code)
values ('1', 'Factura Compra Venta', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl', 'facturaElectronicaCompraVenta','facturaComputarizadaCompraVenta',  'wsFacturacionCompraVentaService', 'wsFacturacionCompraVentaService', 1);

insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec)
values ('11', 'Factura Sector Educativos', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionElectronica?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionComputarizada?wsdl', 'facturaElectronicaCompraVenta','facturaComputarizadaCompraVenta',  'wsFacturacionElectronicaService', 'wsFacturacionElectronicaService', 1);

insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec)
values ('13', 'Factura de Servicios Basicos', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionServicioBasico?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionServicioBasico?wsdl', 'facturaElectronicaCompraVenta','facturaComputarizadaCompraVenta',  'wsFacturacionElectronicaService', 'wsFacturacionElectronicaService', 1);

insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec)
values ('28', 'Factura Comercial de Exportación de Servicios', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionElectronica?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionComputarizada?wsdl', 'facturaElectronicaComercialExportacionServicio','facturaComputarizadaComercialExportacionServicio',  'wsFacturacionElectronicaService', 'wsFacturacionElectronicaService', 2);


insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec)
values ('24', 'Nota de Crédito - Débito', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl', 'notaElectronicaDebitoCredito','notaComputarizadaDebitoCredito',  'wsFacturacionDocumentoAjusteService', 'wsFacturacionDocumentoAjusteService', 3);

insert into eb_sector_document (sector_code, description,url_ws, url_ws_fec, method_fe, method_fec, service_fe, service_fec)
values ('47', 'Nota Crédito Débito Descuentos', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl', 'https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionDocumentoAjuste?wsdl', 'notaElectronicaDebitoCreditoDescuento','notaComputarizadaDebitoCreditoDescuento',  'wsFacturacionDocumentoAjusteService', 'wsFacturacionDocumentoAjusteService', 3);