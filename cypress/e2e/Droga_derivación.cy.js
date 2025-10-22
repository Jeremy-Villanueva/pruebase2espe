import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Abuse Diagnosis Creation Flow', () => {

  beforeEach(() => {
    cy.log('--- Starting preparation: Login and navigation ---');
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
    cy.get('input[type="email"]').type('francisco@asimov.cl');
    cy.get('input[type="password"]').type('Of3M4uV23QISQi');
    cy.contains('button', 'Ingresar').click();

    cy.contains('Niños');
    cy.get('input[placeholder="Buscar..."]')
      .click()
      .type('ANTONELLA{enter}');
    
  cy.wait(2000);

    cy.contains('2096071')
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

  it.only('Creando diagnóstico instrumento crafft', () => {
    cy.log('--- Running test: SAVE diagnosis ---');
    cy.wait(2000)
        cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
      cy.contains('a', 'Añadir nuevo hecho judicial').click();
      cy.wait(3000);
      cy.selectFromDropdown('Seleccione un instrumento', 'Instrumento Crafft - 7');

      cy.contains('Fecha aplicación').should('be.visible');
      cy.contains('Resultado CRAFFT').should('be.visible');
      cy.contains('Puntaje').should('be.visible');
      cy.contains('Profesional/ Técnico').should('be.visible');
      cy.contains('Email Profesional').should('be.visible');
      cy.contains('Diagnóstico sospecha de consumo de alcohol y otras drogas').should('be.visible');
      cy.contains('Datos del Centro de Atención').should('be.visible');

      cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE ÑUBLE');
      
      cy.wait(2000);

      cy.selectDropdownByField('Centro', 'Megasalud Chillán');

      cy.selectDateByField('Fecha de derivación', dayjs().format('2025-10-05'));

        cy.get('[placeholder="Incluya observaciones de la derivación"]').type('Pruebaaaa creación completa');


      cy.contains('button', 'Guardar').click();
    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Derivación creada exitosamente');
    cy.log('----- Derivation creation completed -----');

  })
  it('Cancelando creación de diagnóstico instrumento crafft', () => {
    cy.log('--- Running test: CANCEL diagnosis creation ---');
    cy.wait(2000);
        cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
      cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();
      
      cy.wait(3000);
      cy.selectFromDropdown('Seleccione un instrumento', 'Instrumento Crafft - 7');

      cy.contains('Fecha aplicación').should('be.visible');
      cy.contains('Resultado CRAFFT').should('be.visible');
      cy.contains('Puntaje').should('be.visible');
    cy.contains('button', 'Cancelar').click();

   cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Creación de derivación de citación de consumo cancelada');
    cy.log('----- Derivation creation cancelled -----');
  });
it('Debería mostrar alerta de campos obligatorios al intentar guardar sin completar', () => {
    cy.log('--- Running test: VALIDATION ALERTS for mandatory fields ---');
    cy.wait(2000)
        cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
      cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();

      cy.contains('button', 'Guardar').click();

        cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Fecha de derivación es requerida');
        cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Centro es requerido');
        cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Región es requerida');
        cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Instrumento es requerido');
        cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Fecha de derivación es requerida');

        cy.contains('Seleccione una región').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Región es requerida');
        cy.get('label').contains('Centro').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Centro es requerido');
        cy.get('label').contains('Fecha de derivación').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Fecha de derivación es requerida');
        cy.get('label').contains('Instrumento').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Instrumento es requerido');
        cy.get('small.text-error').should('have.length.at.least', 4);

    cy.log('----- Validation alerts displayed successfully -----');
  });


 it('debería mostrar la sección de datos personales del NNA desde el diagnóstico derivación', () => {

   cy.wait(2000)
        cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
      cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();
cy.wait(2000);
      cy.get('.p-button-label').contains('Datos personales NNA').click();

      cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
    })   
    
it('debería mostrar el contador de caracteres y validar el límite de 50 caracteres en observaciones', () => {
   cy.wait(2000)
        cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
      cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();
      cy.wait(3000);

      cy.selectFromDropdown('Seleccione un instrumento', 'Instrumento Crafft - 7');
cy.wait(2000);
      cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE ÑUBLE');
      
      cy.wait(2000);

      cy.selectDropdownByField('Centro', 'Megasalud Chillán');

      cy.selectDateByField('Fecha de derivación', dayjs().format('2025-10-05'));

cy.wait(1000);
    cy.contains('label', 'Observación')
      .closest('.flex-col')
      .find('textarea')
      .type('Hola mundo');

    cy.contains('10/50 caracteres máximo').should('be.visible');

    cy.contains('label', 'Observación')
      .closest('.flex-col')
      .find('textarea')
      .clear();

    cy.contains('label', 'Observación')
      .closest('.flex-col')
      .find('textarea')
      .type('a'.repeat(50));

    cy.contains('50/50 caracteres máximo').should('be.visible');

    cy.contains('label', 'Observación')
      .closest('.flex-col')
      .find('textarea')
      .clear();

    cy.contains('label', 'Observación')
      .closest('.flex-col')
      .find('textarea')
      .type('a'.repeat(51));

    cy.contains('51/50 caracteres máximo').should('be.visible');

    cy.contains('button', 'Guardar').click();

    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Las observaciones no pueden exceder 50 caracteres');
  
})

it('Editar un diagnóstico ya creado', () => {
  cy.wait(2000);
  cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
  cy.wait(2000);

cy.clickVerDetalleLastRow('Derivación')
  cy.wait(3000);

  cy.contains('button', 'Editar').click();
  cy.wait(2000);

      cy.selectDateByField('Fecha de derivación', dayjs().format('2025-10-10'));
        cy.get('textarea').clear().type('Diagnóstico editado - prueba automatizada');
      cy.contains('button', 'Actualizar').click();
    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Derivación actualizada exitosamente');

cy.log('----- Derivation edition completed -----');
})

// ========== PRUEBAS NEGATIVAS ==========

it('Debería limpiar el centro al cambiar la región', () => {
  cy.log('--- Validando que el centro se limpia al cambiar región ---');
  cy.wait(2000);
  cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
  cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();
  cy.wait(3000);

  cy.selectFromDropdown('Seleccione un instrumento', 'Instrumento Crafft - 7');

  cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE ÑUBLE');
  cy.wait(2000);
  cy.selectDropdownByField('Centro', 'Megasalud Chillán');

  cy.get('label').contains('Centro')
    .closest('.flex.flex-col')
    .find('.p-dropdown-label')
    .should('contain', 'Megasalud Chillán');

  cy.clearDropdown('REGIÓN DE ÑUBLE');
  cy.wait(500);
  cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE LOS LAGOS');
  cy.wait(2000);

  cy.get('label').contains('Centro')
    .closest('.flex.flex-col')
    .find('.p-dropdown-label')
    .should('contain', 'Seleccione establecimiento');

  cy.log('----- Validación completada: Centro se limpió al cambiar región -----');
});

it('Debería permitir caracteres especiales en observaciones', () => {
  cy.log('--- Validando caracteres especiales en observaciones ---');
  cy.wait(2000);
  cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
  cy.contains('Resumen de antecedentes').parent().contains('Añadir nuevo registro').click();
  cy.wait(3000);

  cy.selectFromDropdown('Seleccione un instrumento', 'Instrumento Crafft - 7');
  cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE ÑUBLE');
  cy.wait(2000);
  cy.selectDropdownByField('Centro', 'Megasalud Chillán');
  cy.selectDateByField('Fecha de derivación', dayjs().format('2025-10-05'));

  const textoEspecial = '¡Hola! ¿Cómo estás? Ñoño, José, María887';

  cy.get('[placeholder="Incluya observaciones de la derivación"]').type(textoEspecial);

  cy.contains('button', 'Guardar').click();

  cy.get('.text-gray-700.text-sm.leading-relaxed')
    .should('be.visible')
    .and('contain', 'Derivación creada exitosamente');

  cy.log('----- Validación completada: Caracteres especiales aceptados -----');
});

it('Debería cancelar la edición sin guardar cambios', () => {
  cy.log('--- Validando cancelar edición sin guardar ---');
  cy.wait(2000);
  cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();
  cy.wait(2000);

  cy.clickVerDetalleLastRow('Derivación');
  cy.wait(3000);

  cy.contains('button', 'Editar').click();
  cy.wait(2000);

  cy.get('label').contains('Fecha de derivación')
    .closest('.flex.flex-col')
    .find('input')
    .invoke('val')
    .as('fechaOriginal');

  cy.get('textarea')
    .invoke('val')
    .as('textoOriginal');

  cy.selectDateByField('Fecha de derivación', dayjs().format('2025-10-20'));
  cy.get('textarea').clear().type('Texto modificado para prueba de cancelación');

  cy.contains('button', 'Cancelar').click();
  cy.wait(2000);

  cy.get('main').contains('button', 'Volver').click();
  cy.wait(2000);

  cy.clickVerDetalleLastRow('Derivación');
  cy.wait(2000);

  cy.get('@fechaOriginal').then((fechaOriginal) => {
    if (fechaOriginal) {
      const [year, month, day] = fechaOriginal.split('-');
      const fechaFormateada = `${day}/${month}/${year}`;

      cy.get('label').contains('Fecha de derivación')
        .parent()
        .should('contain.text', fechaFormateada);
    }
  });

  cy.get('@textoOriginal').then((textoOriginal) => {
    cy.get('body').should('not.contain.text', 'Texto modificado para prueba de cancelación');

    if (textoOriginal && textoOriginal.trim()) {
      cy.contains('Observación')
        .parent()
        .should('contain.text', textoOriginal);
    }
  });
  cy.log('----- Validación completada: Cambios no guardados al cancelar -----');
});

});