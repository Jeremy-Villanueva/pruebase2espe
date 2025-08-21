import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Detalle de NNA', () => {

  // --- PREPARACIÓN (Se ejecuta ANTES de CADA prueba 'it') ---
  beforeEach(() => {
    cy.log('--- Iniciando preparación: Login y navegación al detalle del niño ---');
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
    cy.get('input[type="email"]').type('francisco@asimov.cl');
    cy.get('input[type="password"]').type('Of3M4uV23QISQi');
    cy.contains('button', 'Ingresar').click();

    cy.contains('Niños');
    cy.get('input[placeholder="Buscar..."]')
      .click()
      .type('Román{enter}');

    cy.contains('2096074')
      .parents('div')
      .contains('Ver detalle')
      .click();
      
    // Verificamos que llegamos a la página de detalles antes de que cada 'it' comience
    cy.contains('Información NNA', { timeout: 10000 }).should('be.visible');
    cy.log('--- Preparación finalizada: Ya estamos en la página de detalle ---');
  });

  // --- PRUEBA 1: Editar un Diagnóstico ---
  it('debería editar un diagnóstico de maltrato y guardarlo', () => {
    cy.log('--- Ejecutando Prueba 1: Editar diagnóstico ---');

    cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('div', 'Salud mental').click();
    
  
  cy.clickVerDetalleEnFila(1) 

    cy.wait(2000);
    cy.contains('button', 'Editar').click();
    cy.wait(2000);

    // Rellenar el formulario
    cy.selectDateByField('Fecha diagnóstico', '2025-07-23'); // Usaste una fecha fija aquí
    cy.selectRadioByField('Presenta maltrato', 1);
    cy.chooseInComplexSelector("div:nth-of-type(5) span", "abandono");
    cy.chooseInComplexSelector("div:nth-of-type(6) span", "abandono");
    cy.selectRadioByField('Conoce presunto maltratador', 0);
    cy.chooseInComplexSelector("div:nth-of-type(8) span", "padre");
    cy.selectRadioByField('Vive con el agresor', 0);
    cy.selectRadioByField('Existe querella', 1);

    const dropdownProfesionalSelector = "div:nth-of-type(12) > div.p-dropdown > span";
    const nombreProfesional = 'yerko gutiérrez espinoza';
    cy.chooseInSearchableDropdown(dropdownProfesionalSelector, nombreProfesional);

    cy.get('textarea')
      .should('exist')
      .clear({ force: true })
      .type('Edición de prueba maltratooooooo1', { force: true });

    cy.contains('button', 'Guardar').click();

    // Verificaciones finales
    cy.log('Verificando que el diagnóstico editado sea visible...');
    cy.contains('Diagnostico Maltrato', { timeout: 10000 }).should('be.visible');
    cy.log('¡Verificación exitosa! El diagnóstico y el nombre del NNA son visibles.');

    cy.get('.p-toast-message-success', { timeout: 10000 });
    cy.get('.p-toast-detail').should('contain.text', 'Diagnóstico de maltrato guardado correctamente');
    cy.log('¡Notificación validada exitosamente y diagnóstico actualizado!');
    cy.timeout(5000); // Espera para ver el resultado antes de que la prueba termine
  });

  // --- PRUEBA 2: Ver Datos Personales ---
  it('debería mostrar los datos personales del NNA', () => {
    // Cypress ya ejecutó beforeEach, así que estamos en la página de detalle
    cy.log('--- Ejecutando prueba: Datos personales NNA ---');


    cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('div', 'Salud mental').click();
    
    //
  cy.clickVerDetalleEnFila(1) 


    cy.contains('button', 'Datos personales NNA').click();

    // Verificación: 
    // Usamos el selector exacto que descubrimos al inspeccionar el elemento.
    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');

    cy.log('¡Modal de datos personales y su título validados correctamente!');




  });

  // --- PRUEBA 3: Cancelar edición ---
it('debería cancelar la edición', () => {
    // Cypress ya ejecutó beforeEach, así que estamos en la página de detalle
    cy.log('--- Ejecutando prueba: Cancelar edición ---');


    cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('div', 'Salud mental').click();
    
    //
  cy.clickVerDetalleEnFila(1) 

cy.wait(2000);
    // Hacemos clic en el botón "Editar"
    cy.contains('button', 'Editar').click();
    cy.wait(2000);  
    cy.contains('button', 'Cancelar').click();

    // Verificación:

       // Verificaciones finales
    cy.log('Verificando que el diagnóstico cancelado sea visible...');
    cy.contains('Diagnostico Maltrato', { timeout: 10000 }).should('be.visible');
    cy.log('¡Verificación exitosa! El diagnóstico ese canceló.');


})



});

    



