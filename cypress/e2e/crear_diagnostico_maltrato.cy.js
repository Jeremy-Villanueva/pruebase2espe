import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Maltrato', () => {

  beforeEach(() => {
    cy.log('--- Starting preparation: Login and navigation ---');
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
  });

  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {
    cy.log('--- Running test: SAVE diagnosis ---');
    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparation finished: Form is visible ---');

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.wait(2000)
    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-09-12'));
    cy.selectRadioByField('Presenta maltrato', 1);
    cy.chooseInComplexSelector("div:nth-of-type(5) span", "bullying");
    cy.chooseInComplexSelector("div:nth-of-type(6) span", "quemaduras");
    cy.selectRadioByField('Conoce presunto maltratador', 0);
    cy.chooseInComplexSelector("div:nth-of-type(8) span", "padre");
    cy.selectRadioByField('Vive con el agresor', 0);
    cy.selectRadioByField('Existe querella', 1);

    cy.contains('span', 'Seleccione un usuario/a').click({ force: true });

    cy.get('input.p-dropdown-filter')
      .type('FELIPE ALBERTO SOTO TORO');

    cy.contains('li', 'FELIPE ALBERTO SOTO TORO')
      .click({ force: true });

    cy.get('textarea').type('Prueba fila 1 guardado');

    cy.contains('button', 'Guardar').click();

    const formattedDate = dayjs().format('DD/MM/YYYY');
    const expectedText = `Diagnostico Maltrato - ${formattedDate}`;
    cy.contains(expectedText).should('be.visible');
    cy.log('Verifying success notification (toast)...');

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('.p-toast-detail').should('contain.text', 'Diagnóstico de maltrato guardado correctamente');
      });

    cy.log('¡Notificación validada exitosamente y diagnóstico creado!');
  });

  it('debería cancelar la creación y volver a la página de detalles del niño', () => {
    cy.log('--- Running test: CANCEL diagnosis ---');

    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparation finished: Form is visible ---');

    cy.contains('button', 'Cancelar').click();

    cy.contains('Información NNA').should('be.visible');
    cy.contains('Diagnostico Maltrato').should('not.exist');
  });

  it('debería mostrar toast "errores en el formulario" al dejar "Existe querella" vacío', () => {
    cy.log('--- Running test: VALIDATION "Existe querella" field ---');

    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparation finished: Form is visible ---');

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.wait(2000)
    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-09-12'));
    cy.selectRadioByField('Presenta maltrato', 1);
    cy.chooseInComplexSelector("div:nth-of-type(5) span", "bullying");
    cy.chooseInComplexSelector("div:nth-of-type(6) span", "quemaduras");
    cy.selectRadioByField('Conoce presunto maltratador', 0);
    cy.chooseInComplexSelector("div:nth-of-type(8) span", "padre");
    cy.selectRadioByField('Vive con el agresor', 0);

    cy.contains('span', 'Seleccione un usuario/a').click({ force: true });
    cy.get('input.p-dropdown-filter').type('FELIPE ALBERTO SOTO TORO');
    cy.contains('li', 'FELIPE ALBERTO SOTO TORO').click({ force: true });

    cy.get('textarea').type('Prueba de validación campo Existe querella');

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Existen errores en el formulario');

    cy.log('--- Test PASSED: Toast "errors in form" shown correctly ---');
  });

  it('debería mostrar la sección de datos personales del NNA desde el diagnóstico de maltrato', () => {
    cy.log('--- Running test: VIEW CHILD PERSONAL DATA ---');

    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparation finished: Form is visible ---');

    cy.wait(2000);
    cy.get('.p-button-label').contains('Datos personales NNA').click();

    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
    cy.log('¡Sección de datos personales mostrada correctamente!');
  })

  it('debería editar un diagnóstico de maltrato existente', () => {
    cy.log('--- Running test: EDIT DIAGNOSIS ---');

    cy.wait(1000);
    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Salud mental')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.get('button').contains('Ver detalle').click();
      })
    cy.wait(1000);

    cy.contains('button', 'Editar').click();
    cy.wait(1000);

    cy.selectRadioByField('Presenta maltrato', 0);

    cy.get('textarea')
      .should('exist')
      .clear()
      .type('Diagnóstico editado - prueba automatizada maltrato', { force: true })

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('contain.text', 'Diagnóstico de maltrato guardado correctamente');

    cy.log('--- Diagnóstico editado correctamente ---');
  });

  it.only('debería mostrar el contador de caracteres y validar el límite de 100 caracteres en observaciones', () => {
    cy.log('--- Running test: CHARACTER COUNTER ---');

    cy.contains('Añadir diagnóstico').click();
    cy.log('--- Preparation finished: Form is visible ---');

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.wait(2000)

    cy.get('textarea')
      .should('exist')
      .as('observationsField');

    cy.get('@observationsField').type('Hola mundo');
    cy.contains('10/100 caracteres máximo').should('be.visible');

    cy.get('@observationsField').clear();
    cy.get('@observationsField').type('a'.repeat(100));
    cy.contains('100/100 caracteres máximo').should('be.visible');

    cy.get('@observationsField').clear();
    cy.get('@observationsField').type('a'.repeat(115));

    cy.contains('115/100 caracteres máximo').should('be.visible');

    cy.contains('small.text-error', 'Las observaciones no pueden exceder los 100 caracteres')
      .should('be.visible');

    cy.log('--- Character counter validated correctly ---');

    cy.log('--- Validating that error appears when saving---');

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Existen errores en el formulario');
    cy.log('--- Test PASSED: Toast "errors in form" shown correctly ---')
  });
});
