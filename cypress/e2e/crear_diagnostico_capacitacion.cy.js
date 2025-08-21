
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Capacitación', () => {

  // --- PREPARACIÓN (Se ejecuta ANTES de CADA prueba 'it') ---
  beforeEach(() => {
    // Todos los pasos para llegar hasta el formulario de diagnóstico
    cy.log('--- Iniciando preparación: Login y navegación ---');
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

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('.p-dropdown-trigger')
      .click();

    cy.wait(300);
    cy.contains('li', 'Laboral').click();

    cy.wait(300);
    cy.contains('div.p-togglebutton', 'Capacitación').click();

    cy.contains('Añadir capacitación').click();
    cy.log('--- Preparación finalizada: El formulario está visible ---');

  });

// --- CASO DE PRUEBA 1: GUARDAR EL DIAGNÓSTICO ---
  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {
    cy.log('--- Ejecutando prueba: GUARDAR diagnóstico ---');

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");

    cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "laboral");
    cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "forestal");
    cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "sence");
    cy.selectDateByField('Fecha de inicio', dayjs().format('2025-07-31')); // Formato de fecha AAAA/MM/DD (poner la que quieras)
    cy.selectDateByField('Fecha de término', dayjs().format('2025-08-01')); // Formato de fecha AAAA/MM/DD (poner la que quieras)
    

// --- Rellenar el campo "Horas Curso" ---

// 1. Buscamos el label que contiene el texto "Horas Curso".
cy.contains('label', 'Horas Curso')
  .closest('.flex-col') 
  .find('input')
  .type('40'); // número horas del curso

// --- Rellenar el campo "Observaciones" ---
cy.contains('label', 'Observaciones')
  .closest('.flex-col')
  // En este caso, buscamos una etiqueta <textarea> en lugar de <input>.
  .find('textarea')
  .type('Prueba 3 aaaaaa');

cy.chooseInComplexSelector("div:nth-of-type(12) span", "fndr");
cy.chooseInComplexSelector("div:nth-of-type(13) span", "egresado sin título");

cy.contains('button', 'Guardar').click();

cy.log('Verificando la notificación de éxito (toast)...');

    // 1. Buscamos el CONTENEDOR de la notificación de éxito.
    //    Le damos un timeout más largo por si la respuesta del servidor tarda.
    //    El selector '.p-toast-message-success' es una suposición, ¡ajústalo con lo que encuentres!
    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible') // Verificamos que el contenedor de la alerta sea visible
      .within(() => {
        // 2. Usando .within(), ahora solo buscamos DENTRO de la notificación.
        //    Esto evita confundir el texto con cualquier otro en la página.

        // Verificamos el título del toast (si lo tiene) (no tiene por eso lo comenté)
        //cy.get('.p-toast-summary').should('contain.text', 'Éxito');

        // Verificamos el mensaje detallado del toast
        cy.get('.p-toast-detail').should('contain.text', 'Capacitación guardada correctamente');
      });

    cy.log('¡Notificación validada exitosamente y discapacidad creada!');

  });


  // --- CASO DE PRUEBA 2: CANCELAR LA CREACIÓN DEL DIAGNÓSTICO ---
  it('debería cancelar la creación del diagnóstico y verificar que no se haya creado', () => {
    cy.log('--- Ejecutando prueba: CANCELAR creación del diagnóstico ---');

cy.contains('button', 'Cancelar').click();

    cy.log('Verificando que no se haya creado el diagnóstico...');
    // Verificamos que no haya un diagnóstico con la fecha actual


    cy.wait(500); // Esperamos un poco para asegurarnos de que la página se haya actualizado
    const fechaFormateada = dayjs().format('DD/MM/YYYY'); // Formato de fecha DD/MM/YYYY
    const textoEsperado = `Diagnostico Capacitación - ${fechaFormateada}`;
    cy.contains(textoEsperado).should('not.exist'); 
    

    cy.log('--- Cancelación validada exitosamente, no se creó el diagnóstico.');
    // Agregar notificación de cancelación cuando se implemente

  })
  // --- CASO DE PRUEBA 3: Ver datos personales del NNA ---
      it('debería mostrar los datos personales del NNA', () => {
    // Cypress ya ejecutó beforeEach, así que estamos en la página de detalle
    cy.log('--- Ejecutando prueba: Datos personales NNA ---');


    cy.contains('button', 'Datos personales NNA').click();

    // Verificación: 
    // Usamos el selector exacto que descubrimos al inspeccionar el elemento.
    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');

    cy.log('¡Modal de datos personales y su título validados correctamente!');


  });


  });




