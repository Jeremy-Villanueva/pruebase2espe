import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Edición y Verificación en Detalle del Niño', () => {

  // --- PREPARACIÓN (Se ejecuta ANTES de CADA una de las 3 pruebas 'it') ---
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

  // --- PRUEBA 1: Editar un Diagnóstico de Discapacidad ---
  it('debería editar un registro de discapacidad y guardarlo correctamente', () => {
    cy.log('--- Ejecutando Prueba 1: Editar diagnóstico ---');

    // Abre la sección de Discapacidad y el formulario de edición
    cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('li', 'Discapacidad').click();
    
    // seleccionamos un detalle específico
    cy.clickVerDetalleEnFila(2);

    cy.wait(2000);
    cy.contains('button', 'Editar').click();
    cy.wait(2000);

    // Rellena el formulario de edición
    cy.selectRadioByField('Dificultades de salud permanente', 1);
    cy.selectRadioByField('¿Puede moverse/desplazarse solo(a) dentro de la casa?', 0);
    cy.selectRadioByField('¿Puede controlar completamente sus esfínteres? (3 años o más)', 0);
    cy.selectRadioByField('¿Puede bañarse, lavarse los dientes, peinarse o comer solo(a)? (6 años o más)', 0);
    cy.selectRadioByField('¿Puede salir solo(a) a la calle sin ayuda o compañía? (6 años o más)', 0);
    cy.selectRadioByField('¿Puede hacer compras o ir al médico solo(a), sin ayuda o compañía? (15 años o más)', 0);
    cy.selectRadioByField('¿Requiere de una persona que le ayude o asista con sus actividades diarias en su hogar o fuera de él debido a su salud?', 0);
    cy.selectDropdownByField('¿Con qué frecuencia recibe ayuda o asistencia para sus actividades diarias en el hogar o fuera de él debido a su salud?', 'Casi nunca');

    // Interacción con el modal de "Editar gestión"
    cy.contains('button', 'Ver detalle').click();
    cy.get('div.p-dialog', { timeout: 5000 }).should('be.visible').within(() => {
        cy.contains('button', 'Editar gestión').click();
        cy.get('textarea').clear({ force: true }).type('Edición de registro prueba');
        cy.contains('button', 'Guardar').click();
    });

    // Clic en el botón Guardar final
    cy.contains('button', 'Guardar').click();

    // Verificaciones finales
    cy.contains('Antecedentes discapacidad SIS').should('be.visible');
    cy.get('.p-toast-message-success', { timeout: 10000 }).within(() => {
        cy.get('.p-toast-detail').should('contain.text', 'Discapacidad actualizada correctamente');
    });
    cy.log('¡Diagnóstico actualizado y notificación validada!');
  });

  // --- PRUEBA 2: Ver Datos Personales ---
  it('debería mostrar la sección de datos personales del NNA', () => {
    cy.log('--- Ejecutando Prueba 2: Ver Datos Personales ---');


cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('div', 'Discapacidad').click();

    cy.clickVerDetalleEnFila(1) 
    cy.contains('button', 'Datos personales NNA').click();

    // Verificación: Comprobamos que el título del modal/sidebar sea visible
    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
    cy.log('¡Sección de datos personales mostrada correctamente!');
  });

  //PRUEBA 3: Cancelar la Edición
  it('debería cancelar la edición del registro de discapacidad', () => {
    cy.log('--- Ejecutando Prueba 3: Cancelar edición ---');

    cy.contains('Resumen de antecedentes').parents('div').find('.p-dropdown-trigger').click();
    cy.wait(300);
    cy.contains('div', 'Discapacidad').click();
    

  cy.clickVerDetalleEnFila(1) 

cy.wait(2000);
    cy.contains('button', 'Editar').click();
    cy.wait(2000);  
    cy.contains('button', 'Cancelar').click();

    //verificación:

      
    cy.log('Verificando que el diagnóstico cancelado sea visible...');
    cy.contains('Antecedentes discapacidad SIS', { timeout: 10000 }).should('be.visible');
    cy.log('¡Verificación exitosa! El diagnóstico ese canceló.');


});


});
 
  