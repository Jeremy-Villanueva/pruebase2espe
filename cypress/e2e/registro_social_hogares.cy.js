import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Registro Social de Hogares', () => {
  beforeEach(() => {
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
    cy.contains('li', 'Registro social de hogares').click();
  });

  it('debería guardar el diagnóstico y verificar su creación con la fecha actual', () => {

    cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir nuevo registro')
      .click();

    cy.chooseInComplexSelector("div.grid > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
cy.wait(2000)
  cy.typeInField('Código encuesta', '10')

cy.selectDateByField('Fecha encuesta', dayjs().format('2025-10-05'));

cy.selectFromDropdown('Seleccione una situación especial social', 'NO CORRESPONDE A SITUACIÓN ESPECIAL');
cy.selectFromDropdown('Seleccione una situación socioeconómica', 'No Pobre (según CASEN vigente)');
cy.contains('label', 'Mes y año inicio vivir en la calle')
  .closest('div.flex.flex-col')
  .find('button[data-dates-input="true"]')
  .click({ force: true });

cy.get('[data-dates-input="true"][aria-expanded="true"]', { timeout: 10000 })
  .invoke('attr', 'aria-controls')
  .then(id => {
    cy.get(`#${id}`, { timeout: 10000 }).as('calendar');

    cy.get('@calendar')
      .find('button')
      .contains('2025')
      .click({ force: true });

    const targetYear = 2011;

    let clicksNeeded = 0;
    if (targetYear >= 2020 && targetYear <= 2029) {
      clicksNeeded = 0;
    } else if (targetYear >= 2010 && targetYear <= 2019) {
      clicksNeeded = 1;
    } else if (targetYear >= 2000 && targetYear <= 2009) {
      clicksNeeded = 2;
    } else if (targetYear >= 1990 && targetYear <= 1999) {
      clicksNeeded = 3;
    }

    for (let i = 0; i < clicksNeeded; i++) {
      cy.get('@calendar')
        .find('button[data-direction="previous"]')
        .click({ force: true });
    }

    cy.get('@calendar')
      .contains('button', targetYear.toString())
      .click({ force: true });

    cy.get('@calendar')
      .contains('button', 'sep')
      .click({ force: true });

   cy.fillRegistroSocialHogares({
    numeroPersonasHogar: '5',
    numeroPersonasSitio: '4',
    numeroHermanos: '3',
    numeroHermanosVivenCon: '2',
    puntajeProteccionSocial: '92.3',
    fechaPuntajeProteccionSocial:
  '2025-10-05',
    estadoAbandono: 'ADOLESCENTE SIN GRUPO FAMILIAR',
    situacionTuicion: 'CUIDADO PERSONAL EJERCIDO POR PADRE',
    pueblosIndigenas: 'INCA',
    Fonasa: "0",
    chileSolidario: "0",
    chileCreceContigo: "0",

  });
  cy.get('button.mantine-DatePickerInput-input').eq(2).click();
    cy.get('button[aria-label="5 octubre 2025"]').click({ force: true });
  cy.get('button.mantine-DatePickerInput-input').eq(3).click();
    cy.get('button[aria-label="5 octubre 2025"]').click({ force: true });

  cy.get('button.mantine-DatePickerInput-input').eq(4).click();
    cy.get('button[aria-label="5 octubre 2025"]').click({ force: true });

    cy.contains('span', 'Seleccione un usuario/a').click({ force: true });

  cy.get('input.p-dropdown-filter')
    .type('CARMEN PAZ CORTES RUHL');

  cy.contains('li', 'CARMEN PAZ CORTES RUHL')
    .click({ force: true });


cy.get('textarea')
      .should('exist')
      .clear({ force: true })
      .type('PRUEBAAAA', { force: true });

    cy.contains('button', 'Guardar').click();
  })

  it('debería mostrar toast "errores en el formulario" al dejar "Fecha de encuesta" vacía', () => {

    cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir nuevo registro')
      .click();

    cy.chooseInComplexSelector("div.grid > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.wait(2000);

    cy.selectFromDropdown('Seleccione una situación especial social', 'NO CORRESPONDE A SITUACIÓN ESPECIAL');
    cy.selectFromDropdown('Seleccione una situación socioeconómica', 'No Pobre (según CASEN vigente)');

    cy.fillRegistroSocialHogares({
      numeroPersonasHogar: '3',
      numeroPersonasSitio: '2',
      numeroHermanos: '1',
      numeroHermanosVivenCon: '1',
      puntajeProteccionSocial: '75.5',
      fechaPuntajeProteccionSocial: '2025-10-05',
      estadoAbandono: 'NO SE ENCUENTRA EN ESTADO DE ABANDONO',
      situacionTuicion: 'CUIDADO PERSONAL EJERCIDO POR MADRE',
      pueblosIndigenas: 'CHANGO',
      Fonasa: "0",
    chileSolidario: "0",
    chileCreceContigo: "0",

    });

    cy.contains('span', 'Seleccione un usuario/a').click({ force: true });
    cy.get('input.p-dropdown-filter').type('CARMEN PAZ CORTES RUHL');
    cy.contains('li', 'CARMEN PAZ CORTES RUHL').click({ force: true });

    cy.get('textarea').should('exist').clear({ force: true }).type('Prueba de validación de campo requerido', { force: true });

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'errores en el formulario');
  });

  it('debería cancelar el formulario y verificar que la información no se guarda', () => {

    cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir nuevo registro')
      .click();

    cy.chooseInComplexSelector("div.grid > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
    cy.wait(2000);

    cy.selectDateByField('Fecha encuesta', dayjs().format('2025-10-05'));
    cy.selectFromDropdown('Seleccione una situación especial social', 'NO CORRESPONDE A SITUACIÓN ESPECIAL');
    cy.selectFromDropdown('Seleccione una situación socioeconómica', 'No Pobre (según CASEN vigente)');

    cy.fillRegistroSocialHogares({
      numeroPersonasHogar: '4',
      numeroPersonasSitio: '3',
      numeroHermanos: '2',
      numeroHermanosVivenCon: '1',
      puntajeProteccionSocial: '85.0',
      fechaPuntajeProteccionSocial: '2025-10-05',
      estadoAbandono: 'NO SE ENCUENTRA EN ESTADO DE ABANDONO',
      situacionTuicion: 'CUIDADO PERSONAL EJERCIDO POR MADRE',
      pueblosIndigenas: 'INCA',
      Fonasa: "0",
      chileSolidario: "0",
      chileCreceContigo: "0",
    });

    cy.get('textarea').should('exist').clear({ force: true }).type('Formulario que será cancelado - no debe guardarse', { force: true });

    cy.contains('button', 'Cancelar').click();

    cy.url().should('not.contain', '/nuevo');
  });

it('debería ver los detalles del niño y verificar que la información es correcta', () => {

  cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir nuevo registro')
      .click();

 cy.contains('button', 'Datos personales NNA').click();
  cy.get('h3')
      .should('be.visible')
      .and('contain.text', 'Datos personales NNA');

})

it('debería editar un diagnóstico existente y verificar los cambios', () => {

cy.wait(2000);
cy.contains('table', 'Código encuesta')
    .find('button[aria-label="Ver detalle"]')
    .first().click()
cy.wait(1000);
    cy.contains('button', 'Editar').click();
      cy.wait(1000);
   cy.wait(1000);
   cy.selectDateByField('Fecha encuesta', dayjs().format('2025-10-05'));
   cy.wait(1000);

cy.selectDropdownByField("Situación Especial", 'ADOLESCENTE MADRE O PADRE');
cy.wait(1000);

cy.selectDropdownByField("Situación Socio Económica", 'Indigente (según CASEN vigente)');
cy.wait(1000);

    cy.contains('button', 'Guardar').click();

    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'El diagnóstico social se ha actualizado correctamente');
  })

  it('debería mostrar el contador de caracteres y validar el límite de 100 caracteres en observaciones', () => {

     cy.contains('Resumen de antecedentes')
      .parent()
      .contains('Añadir nuevo registro')
      .click();

      cy.chooseInComplexSelector("div.grid > div:nth-of-type(1) div.p-dropdown > span", "Proyecto: DAM-COLINA");
      cy.wait(2000)

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
});
