import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

beforeEach(() => {
  cy.visit('https://test-www.sis.mejorninez.cl/?mensaje=RWwgdXN1YXJpbyBvIGNvbnRyYXNlw7FhIHNvbiBpbmNvcnJlY3Rvcy4gQ29kOiAzMDI%3D&res=ZnJhY2Fzbw%3D%3D');
  cy.get('#usuario').clear().type('msantander@servicioproteccion.gob.cl', { log: false });
  cy.get('#password').clear().type('Mejor.2025', { log: false });
  cy.get('#ingresar').click();
  cy.wait(2000);

  cy.origin('https://test-senainfo.sis.mejorninez.cl', () => {
    cy.visit('/index.aspx');
    cy.viewport(1366, 768);

    cy.get('button.navbar-toggle, button.navbar-toggler')
      .then($b => { if ($b.is(':visible')) cy.wrap($b).click(); });

    cy.get('#menu_colgante_menu_menu > a.dropdown-toggle').click({ force: true });

    cy.contains('#menu_colgante_menu_menu a', 'Ficha del NNA (NUEVA VERSIÓN)')
      .should('have.attr', 'href', '/mod_fichaunica/ConectorSIS.aspx')
      .then($a => { $a[0].click(); });
  });

  cy.origin('https://qa2-app-newsis.servicioproteccion.gob.cl', () => {
    cy.contains('Niños').should('be.visible');
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
      .contains('2093138')
      .parent()
      .contains('Ver detalle')
      .click();

    cy.contains('button', 'Agregar DCE').click();
  });
});

it.only('debería crear un DCE y verificar su creación con la fecha actual', () => {
  cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Sin escolaridad");

  cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Sin grado - Sin escolaridad");
  cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "REGIÓN DE ATACAMA");
  cy.wait(3000)
  cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "No existe en el listado");
  cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "FONASA");

  cy.contains('button', 'Siguiente paso').click();

  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)
  cy.wait(2000)
  cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');

  cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

  cy.contains('button', 'Agregar').click()

  cy.contains('div.p-datatable', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

  cy.contains('button', 'Siguiente paso').click()
  cy.contains('h2', 'Identificación de otros NNA que viven en el domicilio familiar', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)

  cy.selectFromDropdown('Seleccione un niño', 'AMANDA CANTILLANA');

  cy.contains('span.p-chip-text', 'AMANDA CANTILLANA').should('be.visible');

  cy.contains('button', 'Agregar').click()

  const childName = 'AMANDA CANTILLANA';

  cy.contains('tr', childName).should('be.visible');
  cy.contains('button', 'Siguiente paso').click()

  cy.contains('h2', 'Identificación figuras de cuidado', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)

  cy.selectFromDropdown('Seleccione persona relacionada', 'DANIEL ALBERTO AVILES ASTUDILLO');

  cy.contains('button', 'Completar los datos de la figura de cuidado seleccionada').click()

  cy.get('input.p-inputtext.p-component')
    .eq(0)
    .should('be.visible')
    .clear()
    .type('20789297-1', { delay: 50 });

  cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE LOS LAGOS');

  cy.wait(2000);

  cy.selectFromDropdown('Seleccione una comuna', 'OSORNO');

  cy.get('input.p-inputtext.p-component')
    .eq(4)
    .should('be.visible')
    .clear()
    .type('Santa ana 1591', { delay: 50 });
  cy.wait(4000)
  cy.get('div.pac-item')
    .first()
    .click({ force: true }, {delay: 50});

  cy.get('input.p-inputtext.p-component')
    .eq(5)
    .should('be.visible')
    .clear()
    .type('955325744', { delay: 50 });

  cy.selectFromDropdown('Seleccione un tipo de nacionalidad', 'EXTRANJERO(A)');

  cy.selectFromDropdown('Seleccione una nacionalidad', 'China');
  cy.selectFromDropdown('Seleccione un tipo de relación', 'YERNO');

  cy.selectFromDropdown('Seleccione una escolaridad', 'SE DESCONOCE');

  cy.selectFromDropdown('Seleccione profesión u oficio', 'FOTOGRAFO(A)');
  cy.selectFromDropdown('Seleccione una situación', 'CONSUMO PROBLEMÁTICO DE DROGAS');
  cy.selectFromDropdown('Seleccione una situación', 'CONSUMO PROBLEMÁTICO DE ALCOHOL');
  cy.wait(5000)

  cy.contains('.p-dialog:visible .p-dialog-title', 'Editar persona relacionada', { timeout: 10000 })
    .closest('.p-dialog')
    .as('dlg');

  cy.get('@dlg').find('.p-dialog-content')
    .scrollTo('bottom', { ensureScrollable: true });

  cy.get('@dlg')
    .find('#form-field-multi-add, button[aria-label="Agregar"]')
    .first()
    .should('be.visible')
    .and('not.be.disabled')
    .invoke('attr', 'type', 'button')
    .scrollIntoView({ block: 'center' })
    .click('center');
  cy.wait(2000)
  cy.get('#form-field-multi-add').click({force: true});
  cy.wait(2000)
  cy.contains('tr', 'CONSUMO PROBLEMÁTICO DE DROGAS').should('be.visible');
  cy.contains('tr', 'CONSUMO PROBLEMÁTICO DE ALCOHOL').should('be.visible');

  cy.get("div.p-dialog-footer span.p-button-icon").click();

  cy.contains('button', 'Siguiente paso').click()
  cy.contains('h2', 'Ubicación', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)

  cy.selectFromDropdown('Seleccione una ubicación', 'Programa residencial');

  cy.contains('button', 'Siguiente paso').click()

  cy.contains('h2', 'Información de la derivación', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)
  cy.chooseInComplexSelector("div.p-dropdown", "Tribunal de Familia");

  cy.selectDateByField('Fecha Derivación', dayjs().format('2025-07-31'));
  cy.get('textarea').type('Pruebaaaaaaaa', { delay: 50 });

  cy.contains('button', 'Siguiente paso').click();

  cy.contains('h2', 'Metodología aplicada para levantar información para el diagnóstico', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)

  cy.contains('button', 'Añadir metodología aplicada').click();

  cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Con el niño, niña o adolescente");
  cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Entrevista a niños, niñas y adolescentes.");
  cy.selectDateByField('Fecha de aplicación', dayjs().format('2025-08-18'));

  cy.get("div.p-dialog-footer span").click();

  cy.contains('button', 'Siguiente paso').click();

  cy.contains('h2', 'Fuentes complementarias de la información', { timeout: 10000 }).should('be.visible');

  cy.wait(2000)

  cy.get('input[type="file"]')
      .attachFile('Hola esto es una prueba.pdf');

  cy.get('.p-toast-message-success', { timeout: 10000 })
        .should('be.visible')
        .within(() => {
          cy.get('.p-toast-detail').should('contain.text', 'Documento adjuntado');
        });

  cy.contains('div', 'Hola esto es una prueba.pdf').should('be.visible');

  cy.contains('button', 'Añadir fuente de información').click();

  cy.contains('div', 'Crear fuente', { timeout: 10000 }).should('be.visible');

  cy.get('.p-dialog:visible textarea').eq(0).type('Prueba campo 1');
  cy.get('.p-dialog:visible textarea').eq(1).type('Prueba campo 2');

  cy.get("div.p-dialog-footer span").click();
  cy.contains('button', 'Siguiente paso').click();

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
   })

  cy.get('.p-dialog:visible').as('modal');

  cy.get('@modal')
    .contains('Editar resultado diagnostico')
    .should('be.visible');
    cy.get('@modal').within(() => {
  cy.contains('.p-dropdown-label', 'Inicial')
    .click({ force: true });
  cy.get('.p-dropdown-items-wrapper').last().contains('.p-dropdown-items', 'Intermedio').click();
    })

  });

it('debería eliminar el profesional seleccionado', () => {
  cy.contains('h2', 'Datos modificables del NNA')
    .should('be.visible')

  cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Sin escolaridad");

  cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Sin grado - Sin escolaridad");
  cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "REGIÓN DE ATACAMA");
  cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "No existe en el listado");
  cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "FONASA");

  cy.contains('button', 'Siguiente paso').click();

  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
  cy.wait(2000)
  cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');

  cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

  const professionalNameToRemove = 'CAMILA ALEJANDRA SALAZAR INOSTROZA';

  cy.wait(2000)
  cy.contains('div.p-chip', professionalNameToRemove)
    .find('svg[data-pc-section="removeicon"]')
    .click();

  cy.contains('div.p-chip', professionalNameToRemove).should('not.exist');
});
