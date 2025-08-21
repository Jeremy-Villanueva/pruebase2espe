

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Maltrato', () => {

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
    cy.contains('li', 'Salud mental').click();
    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparación finalizada: El formulario está visible ---');
  });

  // --- CASO DE PRUEBA 1: GUARDAR EL DIAGNÓSTICO ---
  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {
    cy.log('--- Ejecutando prueba: GUARDAR diagnóstico ---');
    
    // Rellenamos el formulario
    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-07-21')); // Formato de fecha AAAA/MM/DD (poner la que quieras)
    cy.selectRadioByField('Presenta maltrato', 1);
    cy.chooseInComplexSelector("div:nth-of-type(5) span", "bullying");
    cy.chooseInComplexSelector("div:nth-of-type(6) span", "quemaduras");
    cy.selectRadioByField('Conoce presunto maltratador', 0);
    cy.chooseInComplexSelector("div:nth-of-type(8) span", "padre");
    cy.selectRadioByField('Vive con el agresor', 0);
    cy.selectRadioByField('Existe querella', 1);
    cy.chooseInComplexSelector("div:nth-of-type(12) > div.p-dropdown > span", "gaston yañez alvarez");
    cy.get('textarea').type('Prueba fila 1 guardado');

    // Acción: Hacemos clic en Guardar
    cy.contains('button', 'Guardar').click();

    // Verificación (Assert): Buscamos el diagnóstico creado con la fecha del día
    const fechaFormateada = dayjs().format('DD/MM/YYYY'); // Formato de fecha DD/MM/YYYY
    const textoEsperado = `Diagnostico Maltrato - ${fechaFormateada}`;
    cy.contains(textoEsperado).should('be.visible');
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
        cy.get('.p-toast-detail').should('contain.text', 'Diagnóstico de maltrato guardado correctamente');
      });

    cy.log('¡Notificación validada exitosamente y diagnóstico creado!');

  });




// --- CASO DE PRUEBA 2: CANCELAR LA CREACIÓN ---
  it('debería cancelar la creación y volver a la página de detalles del niño', () => {
    cy.log('--- Ejecutando prueba: CANCELAR diagnóstico ---');

    // No es necesario rellenar el formulario si solo vamos a cancelar.
    // Acción: Hacemos clic en Cancelar
    cy.contains('button', 'Cancelar').click();

    // Verificación (Assert): Comprobamos que volvimos a la página anterior
    // y vemos un texto que solo existe en la página de detalles, como "Información NNA".
    cy.contains('Información NNA').should('be.visible');
    cy.contains('Diagnostico Maltrato').should('not.exist'); // Verificamos que no se creó

    //para validar que se canceló (comentado porque aún no se agrega la alerta de cancelación)

     // 1. Buscamos el CONTENEDOR de la notificación de cancelación.
    //    Le damos un timeout más largo por si la respuesta del servidor tarda.
    //    El selector '.p-toast-message-success' es una suposición, ¡ajústalo con lo que encuentres!
   // cy.get('.p-toast-message-success', { timeout: 10000 })
   //   .should('be.visible') // Verificamos que el contenedor de la alerta sea visible
    //  .within(() => {
        // 2. Usando .within(), ahora solo buscamos DENTRO de la notificación.
        //    Esto evita confundir el texto con cualquier otro en la página.

        // Verificamos el título del toast (si lo tiene) (no tiene por eso lo comenté)
        //cy.get('.p-toast-summary').should('contain.text', 'Éxito');

        // Verificamos el mensaje detallado del toast
    //    cy.get('.p-toast-detail').should('contain.text', 'Diagnóstico de maltrato cancelado');
    //  });

    //cy.log('¡Notificación validada exitosamente y diagnóstico cancelado!');


  });

});