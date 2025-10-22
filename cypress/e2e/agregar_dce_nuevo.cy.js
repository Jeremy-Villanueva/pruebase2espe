import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Agregar DCE - Usando comando fillDCE', () => {

beforeEach(() => {
  cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
  cy.get('input[type="email"]').type('francisco@asimov.cl');
  cy.get('input[type="password"]').type('Of3M4uV23QISQi');
  cy.contains('button', 'Ingresar').click();

  cy.wait(3000);

  cy.get('.p-dropdown').first().should('be.visible').click();
  cy.wait(2000);

  cy.get('.p-dropdown .p-dropdown-label.p-inputtext').first()
  .should('be.visible').click();

  cy.get('.p-dropdown-filter.p-inputtext').first().should('be.visible').click();

  cy.get('.p-dropdown-filter.p-inputtext').first().type('FUNDACIÓN PRODERE', { force: true }).should('have.value', 'FUNDACIÓN PRODERE');

  cy.contains('FUNDACIÓN PRODERE').first().click();

  cy.wait(2000);
  cy.get('.p-dropdown').eq(1).click();

  cy.wait(2000);
  cy.get('.p-dropdown-filter.p-inputtext').should('be.visible').click({ force: true });

  cy.get('.p-dropdown-filter.p-inputtext').first().type('DCE', { force: true }).should('have.value', 'DCE');

  cy.contains('DCE').first().click({ force: true });

  cy.wait(3000)

  cy.get('table').find('tr')
    .contains('2091597')
    .parent()
    .contains('Ver detalle')
    .click();

  cy.contains('button', 'Agregar DCE').click();
});

it('debería crear un DCE completo usando el comando fillDCE', () => {
    cy.contains('h2', 'Datos modificables del NNA')
      .should('be.visible');

    cy.fillDCE();

    cy.contains('h2', 'Principales resultados de la evaluación según dimensiones', { timeout: 10000 }).should('be.visible');

    cy.contains('div.flex.justify-between', /Características del entorno/i)
      .find('span.p-badge')
      .should('contain.text', 'No completado')
      .and('have.class', 'p-badge-danger');

    cy.contains('div.flex.justify-between', /Capacidades de cuidado de la familia o cuidadores\/as/i)
      .find('span.p-badge')
      .should('contain.text', 'No completado')
      .and('have.class', 'p-badge-danger');

    cy.contains('div.flex.justify-between', /Situación del niño\/a o adolescente/i)
      .find('span.p-badge')
      .should('contain.text', 'No completado')
      .and('have.class', 'p-badge-danger');

    cy.contains('div.flex.justify-between', /Características de la situación de vulneración o violencia/i)
      .find('span.p-badge')
      .should('contain.text', 'No completado')
      .and('have.class', 'p-badge-danger');

    cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.selectFromDropdown('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA ', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 ', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Presencia de soportes intersectoriales/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 ', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Presencia de soportes intersectoriales hacia el niño/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 ', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Presencia de soportes comunitarios hacia la familia/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Presencia de soportes comunitarios hacia el niño/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 6', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.wait(2000);
    cy.contains('div.flex.justify-between', /Características del entorno/i)
      .find('span.p-badge')
      .should('contain.text', 'Completado')
      .and('have.class', 'p-badge-success');

    cy.contains('Capacidades de cuidado de la familia o cuidadores/a').should('be.visible');

    cy.contains('tr, div[role="row"]', /Disponibilidad hacia la intervención/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Sin desprotecçón');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 segundo bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Recursos a nivel familiar/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Sin desprotecçón');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 segundo bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia, a nivel familiar/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Sin desprotecçón');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 segundo bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia de la violencia, a nivel familiar./i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Sin desprotecçón');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 segundo bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', 'Capacidad de satisfacer las necesidades del niño/a o adolescente')
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Sin desprotecçón');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5 segundo bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.wait(2000);
    cy.contains('div.flex.justify-between', /Capacidades de cuidado/i)
      .find('span.p-badge')
      .should('contain.text', 'Completado')
      .and('have.class', 'p-badge-success');

    cy.contains('Situación del niño/a o adolescente').should('be.visible');

    cy.contains('tr, div[role="row"]', /Recursos a nivel individual/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 tercer bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia, a nivel individual/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });
    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 tercer bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia de la violencia, a nivel individual/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });
    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 tercer bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Impacto biopsicosocial de la violencia./i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });
    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 tercer bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', /Satisfacción de sus necesidades físicas, de seguridad, emocionales, sociales y cognitivas/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });
    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5 tercer bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.wait(2000);
    cy.contains('div.flex.justify-between', 'Situación del niño/a o adolescente')
      .find('span.p-badge')
      .should('contain.text', 'Completado')
      .and('have.class', 'p-badge-success');

    cy.contains('Características de la situación de vulneración o violencia').should('be.visible');

    cy.contains('tr, div[role="row"]', /Trayectoria de vulneración/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 cuarto bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.contains('tr, div[role="row"]', "Tipología de violencia/maltrato, nivel de gravedad según Valora Galicia adaptado")
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.changeDropdownInModal('Seleccione un nivel de desprotecçón', 'Avanzado');
    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 cuarto bloque', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();

    cy.wait(2000);
    cy.contains('div.flex.justify-between', 'Características de la situación de vulneración o violencia')
      .find('span.p-badge')
      .should('contain.text', 'Completado')
      .and('have.class', 'p-badge-success');

    cy.contains('button', 'Siguiente paso').click();

    cy.contains('h2', 'Medida de protección a tribunal', { timeout: 10000 }).should('be.visible');

    cy.selectRadioByField('Solicitud del proyecto de medida de protección a tribunal de familia ante detección de situación de riesgo', 0);

    cy.contains('button', 'Siguiente paso').click();

    cy.contains('h2', 'Conclusiones del diagnóstico', { timeout: 10000 }).should('be.visible');

    cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 11', { delay: 50 });

    cy.selectFromDropdown('Seleccione un nivel de desprotecçón detectado', 'Sin ningún nivel de desprotecçón, en todas las dimensiones');

    cy.contains('button', 'Enviar').click();
})

it('debería crear un DCE con datos personalizados usando fillDCE', () => {
    cy.contains('h2', 'Datos modificables del NNA')
      .should('be.visible');

    cy.fillDCE({
      escolaridad: 'Básica completa',
      region: 'REGIÓN DE VALPARAÍSO',
      comuna: 'VALPARAÍSO',
      observacionesDerivacion: 'Test personalizado para DCE',
      conclusiones: 'Conclusiones del test personalizado'
    });

    cy.contains('h2', 'Principales resultados de la evaluación según dimensiones', { timeout: 10000 }).should('be.visible');

    cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia/i)
      .scrollIntoView()
      .within(() => {
        cy.contains(/Completar/).click();
     });

    cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
      cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
    });

    cy.selectFromDropdown('Seleccione un nivel de desprotecçón', 'Intermedio');
    cy.get('textarea').type('Test de dimensión personalizada', { delay: 50 });
    cy.get("div.p-dialog-footer button").click();
})

});
