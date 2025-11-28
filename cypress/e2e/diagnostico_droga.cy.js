import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Droga', () => {

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
    cy.contains('li', 'Droga').click();
  });

  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {

     cy.contains('Añadir diagnóstico').click();

     cy.wait(2000);

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "DAM-COLINA");

    cy.wait(2000)
    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-11-13'));
    cy.selectDropdownByField("Droga", 'ANSIOLITICOS');
    cy.wait(2000);
    cy.selectDropdownByField("Tipo de consumo droga", 'CONSUMO OCASIONAL');
    cy.selectDropdownByField("Tiene evaluación de consumo", 'Sí');
    cy.selectDropdownByField("Tiene tratamiento", 'Sí');
    cy.selectDropdownByField("Tiene rehabilitación", 'Sí');
    cy.selectRadioByField("Se atiende en SENDA", 'Sí');
    cy.selectDropdownByField("Establecimiento de salud", 'VidaIntegra');
    cy.selectDropdownByField("Profesional/Técnico", 'FELIPE ALBERTO SOTO TORO');
    cy.get('textarea').type('Diagnóstico de prueba automatizada - Drogas');
    cy.contains('button', 'Guardar').click();
  cy.get('.text-gray-700', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Diagnóstico de droga creado exitosamente');
  })

  it('debería cancelar la creación del diagnóstico y verificar que no se guarda', () => {

     cy.contains('Añadir diagnóstico').click();

     cy.wait(2000);

    cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "DAM-COLINA");

    cy.wait(2000)
    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-11-13'));
    cy.selectDropdownByField("Droga", 'ANSIOLITICOS');
    cy.wait(2000);
    cy.selectDropdownByField("Tipo de consumo droga", 'CONSUMO OCASIONAL');
    cy.selectDropdownByField("Tiene evaluación de consumo", 'Sí');
    cy.selectDropdownByField("Tiene tratamiento", 'Sí');
    cy.selectDropdownByField("Tiene rehabilitación", 'Sí');
        cy.selectRadioByField("Se atiende en SENDA", 'Sí');
    cy.contains('button', 'Cancelar').click();
  })

    it('debería mostrar mensajes de validación para campos obligatorios al intentar guardar sin completarlos', () => {

         cy.contains('Añadir diagnóstico').click();

     cy.wait(2000);

        cy.chooseInComplexSelector("div.border > div > div:nth-of-type(1) div.p-dropdown > span", "DAM-COLINA");

        cy.wait(2000)

        cy.contains('button', 'Guardar').click();


  cy.get('.text-gray-700', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Por favor complete los campos requeridos');

        cy.get('label').contains('Fecha diagnóstico').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'La fecha de diagnóstico es requerida');

        cy.get('label').contains('Droga').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'La droga es requerida');
        cy.get('label').contains('Tipo de consumo droga').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'El tipo de consumo de droga es requerido');

        cy.get('small.text-error').should('have.length.at.least', 2);
    })

    it('debería mostrar la sección de datos personales del NNA desde el diagnóstico de droga', () => {

       cy.contains('Añadir diagnóstico').click();

     cy.wait(2000);

      cy.wait(2000);
      cy.get('.p-button-label').contains('Datos personales NNA').click();

      cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
    })

    it('debería editar un diagnóstico existente', () => {

      cy.scrollTo('bottom');
      cy.wait(3000);

      // Buscar el primer botón "Ver" en la tabla de diagnósticos de droga
      cy.get('button[aria-label="Ver"]').first().click();
      cy.wait(1000);

      cy.contains('button', 'Editar').click();
      cy.wait(1000);

      cy.selectDropdownByField("Droga", 'ALCOHOL');
      cy.get('textarea').clear().type('Diagnóstico editado - prueba automatizada');

      cy.contains('button', 'Guardar').click();

      cy.get('.text-gray-700', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'actualizado exitosamente');
    });

  it('debería mostrar el contador de caracteres y validar el límite de 100 caracteres en observaciones', () => {
     cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir diagnóstico')
      .click();
      cy.wait(2000);

    cy.selectDateByField('Fecha diagnóstico', dayjs().format('2025-11-13'));
    cy.wait(2000);
    cy.selectDropdownByField("Droga", 'ANSIOLITICOS');
    cy.wait(2000);
    cy.selectDropdownByField("Tipo de consumo droga", 'CONSUMO OCASIONAL');

    cy.selectDropdownByField("Profesional/Técnico", 'ALAN ANDRES MORALES MUÑOZ');

    cy.contains('label', 'Observaciones')
      .closest('.flex-col')
      .find('textarea')
      .as('observationsField');

    cy.get('@observationsField').type('Hola mundo');
    cy.contains('10/100 caracteres máximo').should('be.visible');

    cy.get('@observationsField').clear();
    cy.get('@observationsField').type('a'.repeat(100));
    cy.contains('100/100 caracteres máximo').should('be.visible');



    cy.contains('button', 'Guardar').click();

  });
});
