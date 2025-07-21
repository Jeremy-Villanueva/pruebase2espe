
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


// cypress/support/commands.js
// cypress/support/commands.js
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





