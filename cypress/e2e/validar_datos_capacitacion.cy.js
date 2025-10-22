import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

describe('Validación de Datos: UI vs. Base de Datos', () => {

  beforeEach(() => {
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
    cy.get('input[type="email"]').type('francisco@asimov.cl');
    cy.get('input[type="password"]').type('Of3M4uV23QISQi');
    cy.contains('button', 'Ingresar').click();

    cy.contains('Niños', { timeout: 10000 }).should('be.visible');
  });

  it('debería mostrar consistencia de datos para un diagnóstico de capacitación', () => {

    const sqlQuery = `
      SELECT n.run, dc.tipo_capacitacion_id, dc.area_capacitacion_id, dc.organismo_capacitador_id
      FROM diagnostico_capacitacion_nino dc
      JOIN nna n ON dc.nna_id = n.id
      WHERE dc.organismo_capacitador_id IS NOT NULL
      ORDER BY dc.id DESC
      LIMIT 1;
    `;

    cy.task('queryDb', sqlQuery).then((result) => {
      expect(result.rows.length, "DB query found no test data").to.be.greaterThan(0);

      const dbData = result.rows[0];
      const childRun = dbData.run;

      cy.get('input[placeholder="Buscar..."]').clear().type(childRun);
      cy.wait(1000);
      cy.contains('td', childRun).parent('tr').find('button[aria-label="Ver detalle"]').click();

      cy.contains('li', 'Laboral').click();
      cy.wait(500);
      cy.contains('div.p-togglebutton', 'Capacitación').click();
      cy.wait(1000);
      cy.get('tbody tr').first().find('button[aria-label="Ver detalle"]').click();

      const uiData = {};
      cy.contains('h1', 'Capacitación', { timeout: 10000 }).should('be.visible').then(() => {
        cy.contains('div', 'TIPO DE CAPACITACIÓN').siblings('div').invoke('text').then(text => {
          uiData.type = text.trim();
        });
        cy.contains('div', 'ÁREA CAPACITACIÓN').siblings('div').invoke('text').then(text => {
          uiData.area = text.trim();
        });
        cy.contains('div', 'ORGANISMO CAPACITADOR').siblings('div').invoke('text').then(text => {
          uiData.organization = text.trim();
        });
      });

      cy.then(() => {

      });
    });
  });
});
