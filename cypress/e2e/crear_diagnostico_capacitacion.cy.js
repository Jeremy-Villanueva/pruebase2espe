import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Capacitación', () => {

  beforeEach(() => {
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
    cy.get('input[type="email"]').type('francisco@asimov.cl');
    cy.get('input[type="password"]').type('Of3M4uV23QISQi');
    cy.contains('button', 'Ingresar').click();

    cy.contains('Niños');
    cy.get('input[placeholder="Buscar..."]')
      .click()
      .type('Román{enter}');
    cy.wait(2000);
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
  });

  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");

    cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "laboral");
    cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "forestal");
    cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "sence");
    cy.selectDateByField('Fecha de inicio', dayjs().format('2025-09-11'));
    cy.selectDateByField('Fecha de término', dayjs().format('2025-09-12'));

    cy.contains('label', 'Horas Curso')
      .closest('.flex-col')
      .find('input')
      .type('40');

    cy.contains('label', 'Observaciones')
      .closest('.flex-col')
      .find('textarea')
      .type('Prueba 3 aaaaaa');

    cy.chooseInComplexSelector("div:nth-of-type(12) span", "fndr");
    cy.chooseInComplexSelector("div:nth-of-type(13) span", "egresado sin título");

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('.p-toast-detail').should('contain.text', 'Capacitación guardada correctamente');
      });
  });

  it('debería cancelar la creación del diagnóstico y verificar que no fue creado', () => {

    cy.contains('button', 'Cancelar').click();

    cy.wait(500);
    const formattedDate = dayjs().format('DD/MM/YYYY');
    const expectedText = `Diagnostico Capacitación - ${formattedDate}`;
    cy.contains(expectedText).should('not.exist');
  })

  it('debería mostrar los datos personales del NNA', () => {

    cy.contains('button', 'Datos personales NNA').click();

    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
  });

  it('debería mostrar mensajes de validación para campos obligatorios al intentar guardar sin completarlos', () => {

    cy.contains('button', 'Guardar').click();

    cy.contains('Este campo es obligatorio').should('be.visible');

    cy.get('small.text-error').should('have.length.at.least', 1);
  })

  it('debería editar un diagnóstico de capacitación existente', () => {

    cy.contains('button', 'Cancelar').click();
    cy.wait(1000);

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Laboral')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.get('button').contains('Ver detalle').click();
      })
    cy.wait(1000);

    cy.contains('button', 'Editar').click();
    cy.wait(1000);

    cy.contains('label', 'Horas Curso')
      .closest('.flex-col')
      .find('input')
      .clear()
      .type('60');

    cy.contains('label', 'Observaciones')
      .closest('.flex-col')
      .find('textarea')
      .clear()
      .type('Capacitación editada - prueba automatizada', { force: true })

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('contain.text', 'Capacitación guardada correctamente');
  });

  it.only('debería mostrar el contador de caracteres y validar el límite de 100 caracteres en observaciones', () => {

    cy.contains('label', 'Observaciones')
      .closest('.flex-col')
      .find('textarea')
      .as('observationsField');

    cy.get('@observationsField').type('Hola mundo');
    cy.contains('10/100 caracteres máximo').should('be.visible');

    cy.get('@observationsField').clear();
    cy.get('@observationsField').type('a'.repeat(100));
    cy.contains('100/100 caracteres máximo').should('be.visible');

    cy.get('@observationsField').clear();
    cy.get('@observationsField').type('a'.repeat(115));

    cy.contains('115/100 caracteres máximo').should('be.visible');

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Existen errores en el formulario');
  });
});
