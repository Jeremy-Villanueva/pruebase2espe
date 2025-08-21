

Cypress.Commands.add('selectRadioByField', (fieldLabel, optionIndex = 0) => {
  // 1) Encuentra el <label> que contiene el texto del field (sin anchors ni regex estrictos)
  cy.contains('label', fieldLabel, { matchCase: false })
    // 2) Sube hasta el contenedor .flex.flex-col de ese field
    .closest('div.flex.flex-col')
    // 3) Acota el scope a ese bloque
    .within(() => {
      // 4) Encuentra todas las opciones, elige la que corresponda y haz click en su label
      cy.get('div.flex.align-items-center')
        .eq(optionIndex)
        .find('label')
        .click({ force: true });
    });
});



Cypress.Commands.add('selectDropdownByField', (fieldLabel, optionText) => {
  // 1) Abrir el dropdown desde el field
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .find('.p-dropdown-trigger')
    .click()

  // 2) Pausar aquí para inspeccionar el overlay si es necesario
  // Descomenta la siguiente línea para entrar al inspector de Cypress
  // cy.pause()

  // 3) Busca el item en cualquier parte del body (overlay suele renderizarse fuera del contenedor original)
  cy.get('body')
    .find('li.p-dropdown-item, .p-dropdown-items li') // probamos ambas posibles estructuras
    .contains(optionText, { matchCase: false })
    .should('be.visible')
    .click({ force: true })
})



// cypress/support/commands.js
Cypress.Commands.add('clickVerDetalleEnFila', (rowIndex) => {
  cy.get('table tbody tr')
    .eq(rowIndex)
    .find('td')
    .last()
    .find('button[aria-label="Ver detalle"]')
    .click()
})

// cypress/support/commands.js
Cypress.Commands.add('editDatosPersonales', () => {
  cy.get('button[aria-label="Datos personales NNA"]')
    .closest('div.flex.items-center.justify-between')
    .find('button.p-button-icon-only[href*="/editar"]')
    .click()
})



// cypress/support/commands.js
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

Cypress.Commands.add('chooseInComplexSelector', (selector, optionText) => {
  // 1) Abre el dropdown
  cy.wait(3000)
  cy.get(selector).click();

  // 2) RegExp exacta, pero con flag i (case‑insensitive)
  const exactRe = new RegExp(`^\\s*${escapeRe(optionText)}\\s*$`, 'i');

  // 3) Busca y selecciona el ítem
  cy.get('div.p-dropdown-panel[data-pc-section="panel"]', { timeout: 1000 })
    // .should('be.visible')
    .contains('li[data-pc-section="item"]', exactRe)
    .click();
});
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

Cypress.Commands.add('selectDateByField', (fieldLabel, isoDate) => {
  const target = dayjs(isoDate)
  const aria   = target.format('D MMMM YYYY')  // p.ej. "9 julio 2025"

  // 1️⃣ Abrir el DatePicker
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .find('button[data-dates-input="true"]')
    .as('trigger')
    .click({ force: true })

  // 2️⃣ Capturar el pop‑over real
  cy.get('@trigger')
    .invoke('attr', 'aria-controls')
    .then(id => cy.get(`#${id}`, { timeout: 10_000 }).as('dp'))

  // 3️⃣ Intentar seleccionar el día, o navegar mes a mes hasta encontrarlo
  function tryPick() {
    cy.get('@dp')
      .find(`button.mantine-DatePickerInput-day[aria-label="${aria}"]`)
      .then($btn => {
        if ($btn.length) {
          // ¡lo encontramos! clic y terminamos
          cy.wrap($btn).click({ force: true })
        } else {
          // no está en este mes → decide hacia dónde navegar
          const dir = target.isBefore(dayjs(), 'month') ? 'previous' : 'next'
          cy.get('@dp')
            .find(`button[data-direction="${dir}"]`)
            .first()
            .click({ force: true })
            .then(tryPick)
        }
      })
  }

  tryPick()
})


Cypress.Commands.add('chooseInSearchableDropdown', (triggerSelector, searchText) => {
  cy.log(`Buscando en dropdown con buscador: ${searchText}`);
  
  // 1. Abrir el desplegable principal
  cy.get(triggerSelector).click();

  // 2. Encontrar el campo de búsqueda DENTRO del panel y escribir.
  //    El selector '.p-dropdown-filter' es una suposición común para estos componentes.
  //    ¡Inspecciona el buscador para verificarlo!
  cy.get('.p-dropdown-panel .p-dropdown-filter', { timeout: 10000 })
    .should('be.visible')
    .type(searchText, { delay: 100 }); // { delay: 100 } escribe más lento, ayuda con las búsquedas dinámicas

  // 3. Esperar un momento para que la lista se filtre
  cy.wait(1000);

  // 4. Hacer clic en la opción de la lista filtrada.
  //    Busca un item de la lista que contenga el texto que buscaste.
  cy.get('li.p-dropdown-item')
    .contains(searchText, { matchCase: false })
    .should('be.visible')
       .type(`${searchText}{enter}`, { delay: 100 });

});

Cypress.Commands.add('chooseInSearchableDropdown', (triggerSelector, searchText) => {
  // 1. Abre el desplegable
  cy.get(triggerSelector).click({ force: true });

  // 2. Escribe en el campo de búsqueda
  cy.get('.p-dropdown-panel .p-dropdown-filter', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(searchText, { delay: 80 });

  // 3. Selecciona la opción filtrada
  cy.get('li.p-dropdown-item')
    .contains(searchText, { matchCase: false })
    .should('be.visible')
    .click({ force: true });
});

/**
 * Selecciona una opción de un desplegable de PrimeReact por su texto.
 * @param {string} placeholderText - El texto visible en el desplegable cuando está cerrado.
 * @param {string} optionText - El texto de la opción que se quiere seleccionar.
 */
Cypress.Commands.add('selectFromDropdown', (placeholderText, optionText) => {
  cy.log(`Seleccionando '${optionText}' del desplegable '${placeholderText}'`);

  // 1. Abre el desplegable haciendo clic en su texto visible (placeholder).
  //    Usamos { force: true } para evitar problemas con elementos que se superponen.
  cy.contains('span.p-dropdown-label', placeholderText)
    .click({ force: true });


  // 2. Espera a que el panel de opciones sea visible.
  cy.get('.p-dropdown-panel', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      // 3. Dentro del panel, busca y haz clic en la opción con el texto deseado.
      cy.contains('li.p-dropdown-item', optionText)
        .click();
    });
});


// button dentro de un modal
Cypress.Commands.add('clickModalButton', (text, fallbackSelector) => {
  // 1) Intenta por texto dentro del modal visible
  cy.get('.p-dialog:visible', { timeout: 10000 }).then($dlg => {
    const $btn = $dlg.find('button, [role="button"]').filter((_, el) =>
      new RegExp(`^${text}$`, 'i').test((el.getAttribute('aria-label') || el.textContent || '').trim())
    );

    if ($btn.length) {
      cy.wrap($btn[0]).scrollIntoView().click();
      return;
    }

    // 2) Fallback: usa el selector del recorder a nivel global (si lo pasaron)
    if (fallbackSelector) {
      cy.get(fallbackSelector, { timeout: 10000 })
        .filter(':visible')
        .first()
        .scrollIntoView()
        .click();
    } else {
      // 3) Fallback genérico sobre la máscara visible
      cy.get('div.p-dialog-mask:visible', { timeout: 10000 })
        .contains('button, [role="button"]', text)
        .scrollIntoView()
        .click();
    }
  });
});


