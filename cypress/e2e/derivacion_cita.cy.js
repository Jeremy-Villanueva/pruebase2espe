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


  it('Creando cita derivación', () => {
    cy.log('--- guardando cita con campos bloqueados ---');

cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();

cy.contains('.p-datatable-tbody span', 'Asignar Cita').first().click();

  cy.get('.p-dialog').should('be.visible');

  cy.selectDateByField('Fecha Asignada', '2025-10-14');
  cy.wait(2000);    
    cy.selectDateByField('Fecha Evaluación', '2025-10-17');
  cy.get('.p-dialog input[type="radio"]').eq(1).check({ force: true });
    cy.get('textarea[placeholder="Escriba una observación"]').type('Observación de prueba');
    cy.contains('button', 'Guardar cita').click();

    cy.get('.flex-1.min-w-0').should('be.visible')
    .should('be.visible')
    .and('contain', 'Éxito');

    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Cita guardada');
    cy.log('---Creación con campos bloqueados completa---');
  })
it('Creando cita derivación con campos completos al seleccionar "SÍ"', () => {

    cy.log('--- guardando cita con campos bloqueados ---');

cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();

cy.contains('.p-datatable-tbody span', 'Asignar Cita').first().click();

  cy.get('.p-dialog').should('be.visible');


  cy.selectDateByField('Fecha Asignada', '2025-10-14');
  cy.wait(2000);    
    cy.selectDateByField('Fecha Evaluación', '2025-10-17');

  cy.selectRadioInModal('Asiste a evaluación y confirmación diagnóstica', 0);
    cy.selectRadioInModal('Se confirma trastorno por consumo de sustancias', 0);
        cy.selectRadioInModal('Se deriva', 0);
    cy.wait(2000);
      cy.get('.p-dialog input[placeholder="Especifique"]').type('EN UNA PRUEBA');

    cy.get('textarea[placeholder="Escriba una observación"]').type('Observación de prueba SI ');
    cy.contains('button', 'Guardar cita').click();

    cy.get('.flex-1.min-w-0').should('be.visible')
    .should('be.visible')
    .and('contain', 'Éxito');

    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Cita guardada');
    cy.log('---Creación con campos derivación "SI" completa---');

})
it('Creando cita derivación con campos completos al seleccionar "NO" ', () => {

    cy.log('--- guardando cita con campos bloqueados ---');

cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();

cy.contains('.p-datatable-tbody span', 'Asignar Cita').first().click();

  cy.get('.p-dialog').should('be.visible');


  cy.selectDateByField('Fecha Asignada', '2025-10-14');
  cy.wait(2000);    
    cy.selectDateByField('Fecha Evaluación', '2025-10-17');

  cy.selectRadioInModal('Asiste a evaluación y confirmación diagnóstica', 0);
    cy.selectRadioInModal('Se confirma trastorno por consumo de sustancias', 0);
        cy.selectRadioInModal('Se deriva', 1);
    cy.wait(2000);
  cy.get('.p-dialog textarea[placeholder="Escriba el motivo"]').type('PORQ ES UNA PRUEBA');

    cy.get('textarea[placeholder="Escriba una observación"]').type('Observación de prueba NO');
    cy.contains('button', 'Guardar cita').click();

    cy.get('.flex-1.min-w-0').should('be.visible')
    .should('be.visible')
    .and('contain', 'Éxito');

    cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Cita guardada');
    cy.log('---Creación con campos derivación "NO" completa---');
})

it('Validar alertas de campos obligatorios en creación de derivación', () => {
  cy.log('--- Validando alertas de campos obligatorios al no seleccionar evaluación (DEBE FALLAR LA CREACIÓN) ---');

cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();

cy.contains('.p-datatable-tbody span', 'Asignar Cita').first().click();

cy.contains('button', 'Guardar cita').click();

 cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Verificar el formulario');
   
        cy.get('label').contains('Fecha Asignada').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido al asignar cita');
        cy.get('label').contains('Asiste a evaluación y confirmación diagnóstica').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido');
        cy.get('small.text-error').should('have.length.at.least', 2);

    cy.log('----- Validation alerts displayed successfully -----');

})
it('Validar alertas de campos obligatorios en creación de derivación al seleccionar SÍ', () => {
  cy.log('--- Validando alertas de campos obligatorios al no seleccionar evaluación (DEBE FALLAR LA CREACIÓN) ---');

cy.contains('[data-pc-name="togglebutton"]', 'Derivación').click();

cy.contains('.p-datatable-tbody span', 'Asignar Cita').first().click();

  cy.selectRadioInModal('Asiste a evaluación y confirmación diagnóstica', 0);


cy.contains('button', 'Guardar cita').click();

 cy.get('.text-gray-700.text-sm.leading-relaxed')
          .should('be.visible')
          .and('contain', 'Verificar el formulario');
   
        cy.get('label').contains('Fecha Asignada').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido al asignar cita');
        cy.get('label').contains('Se confirma trastorno por consumo de sustancias').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido');
        cy.get('label').contains('Fecha Evaluación').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido al asistir a evaluación');
        cy.get('label').contains('Se deriva').closest('.flex.flex-col').find('small.text-error').should('contain.text', 'Requerido');
        cy.get('small.text-error').should('have.length.at.least', 4);

    cy.log('----- Validación completada correctamente -----');

})




  });

