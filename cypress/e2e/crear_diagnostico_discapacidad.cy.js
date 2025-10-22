import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Flujo de Creación de Diagnóstico de Discapacidad', () => {

  beforeEach(() => {
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login')
    cy.get ('input[type="email"]').type('francisco@asimov.cl')
    cy.get('input[type="password"]').type('Of3M4uV23QISQi')
    cy.contains('button', 'Ingresar').click()

    cy.contains('Niños')
    cy.get ('input[placeholder="Buscar..."]')
    .click()
    .type('Román{enter}')
    cy.contains('2096074')
    .parents('div')
    .contains('Ver detalle')
    .click()

    cy.contains('Resumen de antecedentes')
    .parents('div')
    .find('.p-dropdown-trigger')
    .click()

    cy.wait(300)

    cy.contains('div', 'Discapacidad').click()
  })

  it('debería guardar el diagnóstico de discapacidad', () => {

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Discapacidad')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.contains('Añadir nuevo registro').click()
      })
    cy.selectRadioByField('Dificultades de salud permanente', 1);
    cy.selectRadioByField('¿Puede moverse/desplazarse solo(a) dentro de la casa?', 0)
    cy.selectRadioByField('¿Puede controlar completamente sus esfínteres? (3 años o más)', 1)
    cy.selectRadioByField('¿Puede bañarse, lavarse los dientes, peinarse o comer solo(a)? (6 años o más)', 1)
    cy.selectRadioByField('¿Puede salir solo(a) a la calle sin ayuda o compañía? (6 años o más)', 0)
    cy.selectRadioByField('¿Puede hacer compras o ir al médico solo(a), sin ayuda o compañía? (15 años o más)', 1)
    cy.selectRadioByField('¿Requiere de una persona que le ayude o asista con sus actividades diarias en su hogar o fuera de él debido a su salud?', 1)

    cy.selectDropdownByField(
      '¿Con qué frecuencia recibe ayuda o asistencia para sus actividades diarias en el hogar o fuera de él debido a su salud?',
      'Siempre')

    cy.contains('button', 'Añadir nueva gestión').click()

    cy.get('div.p-dialog', { timeout: 5000 })
      .should('be.visible')
      .within(() => {
        cy.get('textarea')
          .should('exist')
          .type('Prueba2', { force: true })

        cy.contains('button', 'Guardar')
          .click()
      })

    cy.contains('button', 'Guardar')
      .click()

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('.p-toast-detail').should('contain.text', 'Discapacidad agregada correctamente');
      });
  })

  it('debería cancelar la creación del diagnóstico y verificar que no se guarda', () => {

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Discapacidad')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.contains('Añadir nuevo registro').click()
      })

    cy.selectRadioByField('Dificultades de salud permanente', 1);
    cy.selectRadioByField('¿Puede moverse/desplazarse solo(a) dentro de la casa?', 0)
    cy.selectRadioByField('¿Puede controlar completamente sus esfínteres? (3 años o más)', 1)

    cy.contains('button', 'Cancelar').click();
  })

  it('debería mostrar mensajes de validación para campos obligatorios al intentar guardar sin completarlos', () => {

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Discapacidad')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.contains('Añadir nuevo registro').click()
      })

    cy.contains('button', 'Guardar').click();

    cy.contains('Este campo es obligatorio').should('be.visible');

    cy.get('small.text-error').should('have.length.at.least', 1);
  })

  it('debería mostrar la sección de datos personales del NNA desde el diagnóstico de discapacidad', () => {

    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Discapacidad')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.contains('Añadir nuevo registro').click()
      })

    cy.wait(2000);
    cy.get('.p-button-label').contains('Datos personales NNA').click();

    cy.get('h3.text-lg.font-bold', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');
  })

  it('debería editar un diagnóstico de discapacidad existente', () => {

    cy.wait(1000);
    cy.contains('Resumen de antecedentes')
      .parents('div')
      .find('div')
      .contains('Discapacidad')
      .parents('div.p-dropdown')
      .parent()
      .within(() => {
        cy.get('button').contains('Ver detalle').click();
      })
    cy.wait(1000);

    cy.contains('button', 'Editar').click();
    cy.wait(1000);

    cy.selectRadioByField('Dificultades de salud permanente', 1);

    cy.get('button').contains('Añadir nueva gestión').click();

    cy.get('div.p-dialog', { timeout: 5000 })
      .should('be.visible')
      .within(() => {
        cy.get('textarea')
          .should('exist')
          .clear()
          .type('Diagnóstico editado - prueba automatizada discapacidad', { force: true })

        cy.contains('button', 'Guardar').click()
      })

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('contain.text', 'actualizada correctamente');
  });
});
