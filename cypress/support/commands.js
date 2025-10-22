import dayjs from 'dayjs'
import 'dayjs/locale/es'
import 'cypress-file-upload';
dayjs.locale('es')

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

Cypress.Commands.add('selectDateInFieldByIndex', (fieldLabel, calendarIndex = 0, isoDate) => {
  const target = dayjs(isoDate);
  const aria = target.format('D MMMM YYYY');

  // 1) Buscar la sección completa que contiene el fieldLabel
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .then($section => {
      // 2) Dentro de toda esa sección, buscar TODOS los calendarios
      cy.get('button.mantine-DatePickerInput-input[data-dates-input="true"]')
        .then($allCalendars => {
          // 3) Filtrar solo los calendarios que están dentro de esta sección
          const calendarsInSection = $allCalendars.filter((index, el) => {
            return $section[0].contains(el);
          });
          
          // 4) Seleccionar el calendario por índice
          if (calendarsInSection.length > calendarIndex) {
            cy.wrap(calendarsInSection[calendarIndex])
              .as('trigger')
              .click({ force: true });
          } else {
            throw new Error(`No se encontró calendario con índice ${calendarIndex} en la sección ${fieldLabel}`);
          }
        });
    });

  // 5) Capturar el pop-over real
  cy.get('@trigger')
    .invoke('attr', 'aria-controls')
    .then(id => cy.get(`#${id}`, { timeout: 10_000 }).as('dp'));

  // 6) Seleccionar la fecha
  function tryPick() {
    cy.get('@dp')
      .find(`button.mantine-DatePickerInput-day[aria-label="${aria}"]`)
      .then($btn => {
        if ($btn.length) {
          cy.wrap($btn).click({ force: true });
        } else {
          const dir = target.isBefore(dayjs(), 'month') ? 'previous' : 'next';
          cy.get('@dp')
            .find(`button[data-direction="${dir}"]`)
            .first()
            .click({ force: true })
            .then(tryPick);
        }
      });
  }

  tryPick();
});

Cypress.Commands.add('selectDropdownByField', (fieldLabel, optionText) => {
  // 1) Abrir el dropdown desde el field
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .find('.p-dropdown-trigger')
    .as('dropdownTrigger')
    .click()

  // 2) Esperar a que el panel sea visible
  cy.get('.p-dropdown-panel', { timeout: 10000 })
    .should('be.visible')

  // 3) Verificar si hay un campo de búsqueda/filtro disponible
  cy.get('body').then($body => {
    const $filter = $body.find('.p-dropdown-panel .p-dropdown-filter, .p-dropdown-panel input[type="text"]');

    if ($filter.length > 0) {
      // Si hay filtro, usarlo para buscar
      cy.log(`Usando filtro de búsqueda para: ${optionText}`);

      // Escribir letra por letra más lento para evitar re-renders
      cy.wrap($filter.first())
        .should('be.visible')
        .clear()
        .type(optionText, { delay: 100, force: true });

      // Esperar a que se filtre y seleccionar
      cy.wait(300);

      // Verificar si el panel sigue abierto, si no, reabrirlo
      cy.get('body').then($body => {
        if ($body.find('.p-dropdown-panel:visible').length === 0) {
          cy.log('Panel cerrado, reabriendo...');
          cy.get('@dropdownTrigger').click();
          cy.wait(300);
        }
      });

      cy.get('.p-dropdown-panel')
        .should('be.visible')
        .find('li.p-dropdown-item')
        .contains(optionText, { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    } else {
      // Si no hay filtro, buscar directamente en la lista
      cy.log(`Buscando directamente en lista para: ${optionText}`);

      // Primero intentar encontrar la opción visible
      cy.get('.p-dropdown-panel')
        .find('li.p-dropdown-item')
        .then($items => {
          const visibleItem = $items.filter((_, el) => {
            const text = el.textContent || '';
            return text.toLowerCase().includes(optionText.toLowerCase()) &&
                   Cypress.$(el).is(':visible');
          });

          if (visibleItem.length > 0) {
            // Si la opción está visible, hacer click
            cy.wrap(visibleItem.first()).click({ force: true });
          } else {
            // Si no está visible, hacer scroll hacia abajo hasta encontrarla
            cy.log(`Opción no visible, haciendo scroll para encontrar: ${optionText}`);

            function scrollAndSearch() {
              cy.get('.p-dropdown-panel')
                .find('li.p-dropdown-item')
                .then($currentItems => {
                  const matchingItem = $currentItems.filter((_, el) => {
                    const text = el.textContent || '';
                    return text.toLowerCase().includes(optionText.toLowerCase());
                  });

                  if (matchingItem.length > 0) {
                    cy.wrap(matchingItem.first()).click({ force: true });
                  } else {
                    // Hacer scroll hacia abajo
                    cy.get('.p-dropdown-panel')
                      .scrollTo('bottom')
                      .wait(300)
                      .then(() => {
                        // Verificar si hay más elementos después del scroll
                        cy.get('.p-dropdown-panel li.p-dropdown-item')
                          .then($newItems => {
                            if ($newItems.length > $currentItems.length) {
                              scrollAndSearch();
                            } else {
                              // No se encontró la opción
                              throw new Error(`No se pudo encontrar la opción: ${optionText}`);
                            }
                          });
                      });
                  }
                });
            }

            scrollAndSearch();
          }
        });
    }
  });
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

/**
 * Hace click en "Ver detalle" de una fila que contiene un texto específico en cualquier columna
 * @param {string} textToFind - Texto que debe contener la fila (instrumento, fecha, centro, etc.)
 * @example cy.clickVerDetalleByText('ASSIST')
 * @example cy.clickVerDetalleByText('Centro Médico y Dental Megasalud')
 */
Cypress.Commands.add('clickVerDetalleByText', (textToFind) => {
  cy.log(`Buscando fila con texto: ${textToFind}`);

  cy.contains('table tbody tr', textToFind)
    .should('be.visible')
    .within(() => {
      cy.contains('button', 'Ver detalle').click({ force: true });
    });
})

/**
 * Hace click en "Ver detalle" de la última fila de la tabla dentro de "Resumen de antecedentes"
 * Útil para editar el diagnóstico recién creado
 * @param {string} seccionName - Nombre de la sección (opcional, por defecto busca en toda la página)
 * @example cy.clickVerDetalleLastRow()
 * @example cy.clickVerDetalleLastRow('Derivación')
 */
Cypress.Commands.add('clickVerDetalleLastRow', (seccionName = null) => {
  cy.log('Haciendo click en Ver detalle de la última fila');

  if (seccionName) {
    cy.log(`Buscando en la sección: ${seccionName}`);

    // Para Derivación, buscar tabla que tenga la columna "Instrumento"
    if (seccionName === 'Derivación') {
      cy.contains('th', 'Instrumento')
        .parents('table')
        .first()
        .find('tbody tr')
        .last()
        .should('be.visible')
        .within(() => {
          cy.contains('button', 'Ver detalle').click({ force: true });
        });
    } else {
      // Para otras secciones, buscar por el texto del header de columna específico
      // Por ahora, intentar buscar cualquier tabla visible después del toggle
      cy.contains('[data-pc-name="togglebutton"]', seccionName)
        .should('be.visible')
        .parent()
        .parent()
        .find('table tbody tr')
        .last()
        .should('be.visible')
        .within(() => {
          cy.contains('button', 'Ver detalle').click({ force: true });
        });
    }
  } else {
    // Comportamiento original: buscar en cualquier tabla visible
    cy.get('table tbody tr')
      .last()
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Ver detalle').click({ force: true });
      });
  }
})

/**
 * Hace click en "Ver detalle" de una fila específica por instrumento
 * @param {string} instrumentName - Nombre del instrumento (ej: 'ASSIST', 'Instrumento Crafft - 7', 'No aplicado')
 * @example cy.clickVerDetalleByInstrument('ASSIST')
 */
Cypress.Commands.add('clickVerDetalleByInstrument', (instrumentName) => {
  cy.log(`Buscando fila con instrumento: ${instrumentName}`);

  cy.get('table tbody tr').each(($row) => {
    // Buscar en la primera columna (Instrumento)
    const instrumentoText = $row.find('td').first().text().trim();

    if (instrumentoText.toLowerCase().includes(instrumentName.toLowerCase())) {
      cy.wrap($row)
        .should('be.visible')
        .within(() => {
          cy.contains('button', 'Ver detalle').click({ force: true });
        });

      return false; // Detener el loop
    }
  });
})

/**
 * Hace click en "Ver detalle" de una fila que coincida con múltiples criterios
 * @param {Object} criteria - Objeto con criterios de búsqueda
 * @param {string} criteria.instrumento - Nombre del instrumento (opcional)
 * @param {string} criteria.fecha - Fecha de aplicación (opcional)
 * @param {string} criteria.centro - Centro de atención (opcional)
 * @param {string} criteria.profesional - Nombre del profesional (opcional)
 * @example cy.clickVerDetalleByCriteria({ instrumento: 'ASSIST', fecha: '13/09/2025' })
 */
Cypress.Commands.add('clickVerDetalleByCriteria', (criteria) => {
  cy.log(`Buscando fila con criterios:`, criteria);

  cy.get('table tbody tr').each(($row) => {
    let matches = true;
    const cells = $row.find('td');

    // Columna 0: Instrumento
    if (criteria.instrumento) {
      const instrumentoText = cells.eq(0).text().trim().toLowerCase();
      if (!instrumentoText.includes(criteria.instrumento.toLowerCase())) {
        matches = false;
      }
    }

    // Columna 1: Fecha de aplicación
    if (criteria.fecha && matches) {
      const fechaText = cells.eq(1).text().trim();
      if (!fechaText.includes(criteria.fecha)) {
        matches = false;
      }
    }

    // Columna 2: Profesional que realizó el tamizaje
    if (criteria.profesional && matches) {
      const profesionalText = cells.eq(2).text().trim().toLowerCase();
      if (!profesionalText.includes(criteria.profesional.toLowerCase())) {
        matches = false;
      }
    }

    // Columna 3: Centro de atención
    if (criteria.centro && matches) {
      const centroText = cells.eq(3).text().trim().toLowerCase();
      if (!centroText.includes(criteria.centro.toLowerCase())) {
        matches = false;
      }
    }

    // Si todas las condiciones coinciden, hacer click
    if (matches) {
      cy.wrap($row)
        .should('be.visible')
        .within(() => {
          cy.contains('button', 'Ver detalle').click({ force: true });
        });

      return false; // Detener el loop
    }
  });
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

  // 2) RegExp exacta, pero con flag i (case‑insensitive)
  const exactRe = new RegExp(`^\\s*${escapeRe(optionText)}\\s*$`, 'i');

  // 3) Busca y selecciona el ítem
  cy.get('div.p-dropdown-panel[data-pc-section="panel"]', { timeout: 1000 })
    // .should('be.visible')
    .contains('li[data-pc-section="item"]', exactRe)
    .click();
});

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

/**
 * Selecciona una opción de dropdown por el LABEL del campo (no necesitas saber el valor actual)
 * Útil para edición de formularios donde el dropdown ya tiene un valor
 * @param {string} fieldLabel - El texto del label del campo (ej: "Región", "Centro")
 * @param {string} optionText - El texto de la opción que se quiere seleccionar
 * @example cy.selectDropdownByFieldLabel('Región', 'REGIÓN DE ÑUBLE')
 */
Cypress.Commands.add('selectDropdownByFieldLabel', (fieldLabel, optionText) => {
  cy.log(`Seleccionando '${optionText}' en el campo '${fieldLabel}'`);

  // 1. Buscar el label del campo
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .within(() => {
      // 2. Hacer click en el trigger del dropdown (sin importar qué valor tenga)
      cy.get('.p-dropdown-trigger, .p-dropdown')
        .first()
        .click({ force: true });
    });

  // 3. Esperar a que el panel sea visible
  cy.get('.p-dropdown-panel', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      // 4. Seleccionar la opción
      cy.contains('li.p-dropdown-item', optionText)
        .should('be.visible')
        .click({ force: true });
    });
});

/**
 * Limpia un dropdown de PrimeReact haciendo click en el icono "X"
 * @param {string} placeholderText - El texto visible en el desplegable (puede ser el valor actual o el placeholder)
 * @example cy.clearDropdown('REGIÓN DE ÑUBLE')
 * @example cy.clearDropdown('Seleccione una región')
 */
Cypress.Commands.add('clearDropdown', (placeholderText) => {
  cy.log(`Limpiando dropdown: ${placeholderText}`);

  // Buscar el dropdown que contiene ese texto
  cy.contains('span.p-dropdown-label', placeholderText)
    .parents('.p-dropdown')
    .first()
    .within(() => {
      // Buscar el botón clear (icono X)
      cy.get('.p-dropdown-clear-icon')
        .should('be.visible')
        .click({ force: true });
    });
});

/**
 * Limpia un dropdown de PrimeReact por el label del campo (NO por su valor actual)
 * Útil cuando no sabes qué valor tiene el dropdown actualmente
 * @param {string} fieldLabel - El texto del label del campo (ej: "Región", "Centro")
 * @example cy.clearDropdownByLabel('Región')
 * @example cy.clearDropdownByLabel('Centro')
 */
Cypress.Commands.add('clearDropdownByLabel', (fieldLabel) => {
  cy.log(`Intentando limpiar dropdown del campo: ${fieldLabel}`);

  // Buscar el label del campo y subir al contenedor
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .then($container => {
      // Verificar si existe el botón clear (icono X)
      const $clearButton = $container.find('.p-dropdown-clear-icon');

      if ($clearButton.length > 0 && $clearButton.is(':visible')) {
        // Si existe y es visible, hacer click
        cy.log(`✅ Botón clear encontrado para: ${fieldLabel}`);
        cy.wrap($clearButton).click({ force: true });
      } else {
        // Si no existe o no es visible, solo loguearlo (no fallar)
        cy.log(`⚠️ No se encontró botón clear para: ${fieldLabel} (puede que ya esté vacío o no tenga showClear habilitado)`);
      }
    });
});

/**
 * Cambia el valor de un dropdown en modo edición (maneja dropdowns pre-cargados)
 * Es más robusto que selectDropdownByField para ediciones porque:
 * 1. Intenta limpiar el valor anterior si es posible
 * 2. Si no puede limpiar, simplemente abre y selecciona la nueva opción (sobrescribe)
 * @param {string} fieldLabel - El texto del label del campo
 * @param {string} optionText - El texto de la nueva opción a seleccionar
 * @example cy.changeDropdownValue('Región', 'REGIÓN DE ÑUBLE')
 */
Cypress.Commands.add('changeDropdownValue', (fieldLabel, optionText) => {
  cy.log(`Cambiando valor del campo '${fieldLabel}' a '${optionText}'`);

  // Buscar el contenedor del campo
  cy.contains('label', fieldLabel, { matchCase: false })
    .closest('div.flex.flex-col')
    .as('fieldContainer');

  // Intentar limpiar primero (si existe el botón clear)
  cy.get('@fieldContainer').then($container => {
    const $clearButton = $container.find('.p-dropdown-clear-icon');

    if ($clearButton.length > 0 && $clearButton.is(':visible')) {
      cy.log(`Limpiando valor anterior de '${fieldLabel}'`);
      cy.wrap($clearButton).click({ force: true });
      cy.wait(300);
    } else {
      cy.log(`No hay botón clear, se sobrescribirá el valor directamente`);
    }
  });

  // Abrir el dropdown - intentar múltiples selectores posibles
  cy.get('@fieldContainer').then($container => {
    // Intentar encontrar el dropdown por diferentes selectores
    let $trigger = $container.find('.p-dropdown-trigger');

    if ($trigger.length === 0) {
      // Si no encuentra .p-dropdown-trigger, buscar el dropdown completo
      $trigger = $container.find('.p-dropdown');
    }

    if ($trigger.length === 0) {
      // Si aún no lo encuentra, buscar por span.p-dropdown-label (el texto visible)
      $trigger = $container.find('span.p-dropdown-label').closest('.p-dropdown');
    }

    if ($trigger.length > 0) {
      cy.wrap($trigger).click({ force: true });
    } else {
      throw new Error(`No se pudo encontrar el dropdown para el campo: ${fieldLabel}`);
    }
  });

  // Esperar a que el panel sea visible
  cy.get('.p-dropdown-panel', { timeout: 10000 })
    .should('be.visible');

  // Verificar si hay campo de búsqueda/filtro
  cy.get('body').then($body => {
    const $filter = $body.find('.p-dropdown-panel .p-dropdown-filter, .p-dropdown-panel input[type="text"]');

    if ($filter.length > 0) {
      // Si hay filtro, usarlo
      cy.log(`Usando filtro de búsqueda para: ${optionText}`);
      cy.wrap($filter.first())
        .should('be.visible')
        .clear()
        .type(optionText, { delay: 100, force: true });

      cy.wait(300);

      // Verificar si el panel sigue abierto
      cy.get('body').then($body => {
        if ($body.find('.p-dropdown-panel:visible').length === 0) {
          cy.log('Panel cerrado, reabriendo...');
          cy.get('@fieldContainer').then($container => {
            const $trigger = $container.find('.p-dropdown, .p-dropdown-trigger, span.p-dropdown-label').first();
            cy.wrap($trigger).click({ force: true });
          });
          cy.wait(300);
        }
      });

      cy.get('.p-dropdown-panel')
        .should('be.visible')
        .find('li.p-dropdown-item')
        .contains(optionText, { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    } else {
      // Si no hay filtro, buscar directamente
      cy.log(`Buscando directamente en lista para: ${optionText}`);
      cy.get('.p-dropdown-panel')
        .find('li.p-dropdown-item')
        .contains(optionText, { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    }
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

Cypress.Commands.add('changeDropdownInModal', (labelTextOrPlaceholder, newValue) => {
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^\\s*${escapeRe(labelTextOrPlaceholder)}\\s*$`, 'i');

  // 1) Localizar el dropdown dentro del modal por label o por placeholder/valor visible
  cy.get('.p-dialog:visible', { timeout: 10000 }).then($modal => {
    // a) intentar por <label>
    let $dropdown = $modal
      .find('label')
      .filter((_, el) => re.test((el.textContent || '').trim()))
      .closest('.p-field, .field, .form-group, .flex, .flex-col, .grid, div')
      .find('.p-dropdown')
      .first();

    // b) si no hay label, intentar por el texto visible del dropdown
    if (!$dropdown.length) {
      $dropdown = $modal
        .find('.p-dropdown .p-dropdown-label')
        .filter((_, el) => re.test((el.textContent || '').trim()))
        .closest('.p-dropdown')
        .first();
    }

    // c) última opción: primer dropdown visible del modal
    if (!$dropdown.length) {
      $dropdown = $modal.find('.p-dropdown:visible').first();
    }

    expect($dropdown.length, `dropdown para "${labelTextOrPlaceholder}"`).to.be.greaterThan(0);
    cy.wrap($dropdown).as('modalDropdown');
  });

  // 2) Abrir el dropdown
  cy.get('@modalDropdown').find('.p-dropdown-trigger').click({ force: true });

  // 3) Seleccionar la opción (usar filtro si existe)
  cy.get('.p-dropdown-panel:visible', { timeout: 10000 })
    .should('be.visible')
    .then($panel => {
      const $filter = $panel.find('.p-dropdown-filter.p-inputtext');
      if ($filter.length) cy.wrap($filter[0]).clear().type(newValue, { force: true });
    });

  cy.get('.p-dropdown-panel:visible')
    .contains('.p-dropdown-item', new RegExp(`^\\s*${escapeRe(newValue)}\\s*$`, 'i'))
    .click({ force: true });
});

/**
 * Ingresa texto en un campo de entrada por su etiqueta/label.
 * @param {string} fieldLabel - El texto del label del campo.
 * @param {string} text - El texto a escribir en el campo.
 */
Cypress.Commands.add('typeInField', (fieldLabel, text) => {
  cy.log(`Escribiendo '${text}' en el campo '${fieldLabel}'`);
  
  cy.contains('label', fieldLabel)
    .closest('div.flex.flex-col')
    .find('input')
    .clear()
    .type(text);
});

/**
 * Selecciona una opción de dropdown por label del campo
 * @param {string} fieldLabel - El label del campo
 * @param {string} optionText - El texto de la opción a seleccionar
 */
Cypress.Commands.add('selectDropdownByLabel', (fieldLabel, optionText) => {
  cy.log(`Seleccionando '${optionText}' en el campo '${fieldLabel}'`);
  
  // Encontrar el dropdown por su label
  cy.contains('label', fieldLabel)
    .closest('div.flex.flex-col')
    .find('.p-dropdown-trigger')
    .click({ force: true });

  // Seleccionar la opción
  cy.get('.p-dropdown-panel', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.contains('li.p-dropdown-item', optionText)
        .click({ force: true });
    });
});


/**
 * Llena los campos específicos del formulario de Registro Social de Hogares
 * @param {Object} formData - Objeto con los datos para llenar el formulario
 */
Cypress.Commands.add('fillRegistroSocialHogares', (formData = {}) => {
  cy.log('Llenando campos del formulario de Registro Social de Hogares');
  
  const defaultData = {
    numeroPersonasHogar: '4',
    numeroPersonasSitio: '3',
    numeroHermanos: '2',
    numeroHermanosVivenCon: '1',
    puntajeProteccionSocial: '85.5',
    fechaPuntajeProteccionSocial: '2025-09-10',
    estadoAbandono: 'No',
    situacionTuicion: 'Con tuición legal',
    pueblosIndigenas: 'No pertenece',
    Fonasa: "Sí",
    chileSolidario: "Sí",
    chileCreceContigo: "Sí",
    ...formData
  };


  // Número de personas en el hogar
  if (defaultData.numeroPersonasHogar) {
    cy.typeInField('Número de personas en el hogar', defaultData.numeroPersonasHogar);
  }

  // Número de personas en el sitio
  if (defaultData.numeroPersonasSitio) {
    cy.typeInField('Número de personas en el sitio', defaultData.numeroPersonasSitio);
  }

  // Número hermanos
  if (defaultData.numeroHermanos) {
    cy.typeInField('Número hermanos', defaultData.numeroHermanos);
  }

  // Número hermanos viven con él
  if (defaultData.numeroHermanosVivenCon) {
    cy.typeInField('Número hermanos viven con él', defaultData.numeroHermanosVivenCon);
  }

  // Puntaje Protección Social
  if (defaultData.puntajeProteccionSocial) {
    cy.typeInField('Puntaje Protección Social', defaultData.puntajeProteccionSocial);
  }

  // Fecha Puntaje Protección Social
  if (defaultData.fechaPuntajeProteccionSocial) {
    cy.selectDateByField('Fecha Puntaje Protección Social', defaultData.fechaPuntajeProteccionSocial);
  }

  // Estado Abandono
  if (defaultData.estadoAbandono) {
    cy.selectDropdownByLabel('Estado Abandono', defaultData.estadoAbandono);
  }

  // Situación tuición
  if (defaultData.situacionTuicion) {
    cy.selectDropdownByLabel('Situación tuición', defaultData.situacionTuicion);
  }

  // Pueblos indígenas
  if (defaultData.pueblosIndigenas) {
    cy.selectDropdownByLabel('Pueblos indígenas', defaultData.pueblosIndigenas);
  }

  // Fonasa
  if (defaultData.Fonasa) {
    cy.selectRadioByField('Fonasa', defaultData.Fonasa);
  }

  if (defaultData.chileSolidario) {
    cy.selectRadioByField('Chile Solidario', defaultData.chileSolidario);
}

if (defaultData.chileCreceContigo) {
    cy.selectRadioByField('Chile crece contigo', defaultData.chileCreceContigo);
}
  

  cy.log('Campos del formulario completados');
});

/**
 * Llena los campos específicos del formulario DCE
 * @param {Object} formData - Objeto con los datos para llenar el formulario DCE
 */
Cypress.Commands.add('fillDCE', (formData = {}) => {
  cy.log('Llenando campos del formulario DCE');
  
  const defaultData = {
    // Paso 1: Datos modificables del NNA
    escolaridad: 'Sin escolaridad',
    grado: 'Sin grado - Sin escolaridad',
    region: 'REGIÓN DE ATACAMA',
    comuna: 'No existe en el listado',
    prevision: 'FONASA',
    
    // Paso 2: Trabajadores DCE
    profesional: 'CAMILA ALEJANDRA SALAZAR INOSTROZA',
    
    // Paso 3: Identificación de otros NNA
    otroNNA: 'AMANDA CANTILLANA',
    
    // Paso 4: Identificación figuras de cuidado
    personaRelacionada: 'DANIEL ALBERTO AVILES ASTUDILLO',
    rut: '20789297-1',
    regionFigura: 'REGIÓN DE LOS LAGOS',
    comunaFigura: 'OSORNO',
    direccion: 'Santa ana 1591',
    telefono: '955325744',
    tipoNacionalidad: 'EXTRANJERO(A)',
    nacionalidad: 'China',
    tipoRelacion: 'YERNO',
    escolaridadFigura: 'SE DESCONOCE',
    profesion: 'FOTOGRAFO(A)',
    situaciones: ['CONSUMO PROBLEMÁTICO DE DROGAS', 'CONSUMO PROBLEMÁTICO DE ALCOHOL'],
    
    // Paso 5: Ubicación
    ubicacion: 'Programa residencial',
    
    // Paso 6: Información de la derivación
    organismoDeriva: 'Tribunal de Familia',
    fechaDerivacion: '2025-09-09',
    observacionesDerivacion: 'Pruebaaaaaaaa',
    
    // Paso 7: Metodología aplicada
    conQuien: 'Con el niño, niña o adolescente',
    metodologia: 'Entrevista a niños, niñas y adolescentes.',
    fechaAplicacion: '2025-09-09',
    
    // Paso 8: Fuentes complementarias
    archivoAdjunto: 'Hola esto es una prueba.pdf',
    programaInstitucion: 'Prueba campo 1',
    contenidosAbordados: 'Prueba campo 2',
    
    // Paso 9: Dimensiones - Todos con nivel 'Intermedio' por defecto
    dimensiones: {
      factoresProtectoresRecurrencia: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA' },
      factoresRiesgoRecurrencia: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA 2' },
      soportesIntersectoriales: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA 3' },
      soportesIntersectorialesNino: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA 4' },
      soportesComunitariosFamilia: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA 5' },
      soportesComunitariosNino: { nivel: 'Intermedio', observacion: 'Pruebaaaaaaaa aAAAAA 6' },
      disponibilidadIntervencion: { nivel: 'Sin desprotección', observacion: 'Pruebaaaaaaaa aAAAAA 1 segundo bloque' },
      recursosFamiliares: { nivel: 'Sin desprotección', observacion: 'Pruebaaaaaaaa aAAAAA 2 segundo bloque' },
      factoresProtectoresFamilia: { nivel: 'Sin desprotección', observacion: 'Pruebaaaaaaaa aAAAAA 3 segundo bloque' },
      factoresRiesgoFamilia: { nivel: 'Sin desprotección', observacion: 'Pruebaaaaaaaa aAAAAA 4 segundo bloque' },
      capacidadSatisfacerNecesidades: { nivel: 'Sin desprotección', observacion: 'Pruebaaaaaaaa aAAAAA 5 segundo bloque' },
      recursosIndividuales: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 1 tercer bloque' },
      factoresProtectoresIndividual: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 2 tercer bloque' },
      factoresRiesgoIndividual: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 3 tercer bloque' },
      impactoBiopsicosocial: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 4 tercer bloque' },
      satisfaccionNecesidades: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 5 tercer bloque' },
      trayectoriaVulneracion: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 1 cuarto bloque' },
      tipologiaViolencia: { nivel: 'Avanzado', observacion: 'Pruebaaaaaaaa aAAAAA 2 cuarto bloque' }
    },
    
    // Paso 10: Medida de protección
    solicitudMedida: 0, // 0 = primera opción del radio
    
    // Paso 11: Conclusiones
    conclusiones: 'Pruebaaaaaaaa aAAAAA 11',
    nivelDesproteccion: 'Sin ningún nivel de desprotección, en todas las dimensiones',
    
    ...formData
  };

  // PASO 1: Datos modificables del NNA
  if (defaultData.escolaridad) {
    cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", defaultData.escolaridad);
  }
  
  if (defaultData.grado) {
    cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", defaultData.grado);
  }
  
  if (defaultData.region) {
    cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", defaultData.region);
    cy.wait(3000);
  }
  
  if (defaultData.comuna) {
    cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", defaultData.comuna);
  }
  
  if (defaultData.prevision) {
    cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", defaultData.prevision);
  }

  // Ir al siguiente paso
  cy.contains('button', 'Siguiente paso').click();

  // PASO 2: Trabajadores DCE
  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  if (defaultData.profesional) {
    cy.selectFromDropdown('Seleccione un usuario', defaultData.profesional);
    cy.contains('span.p-chip-text', defaultData.profesional).should('be.visible');
    cy.contains('button', 'Agregar').click();
    cy.contains('div.p-datatable', defaultData.profesional).should('be.visible');
  }

  // Ir al siguiente paso
  cy.contains('button', 'Siguiente paso').click();

  // PASO 3: Identificación de otros NNA
  cy.contains('h2', 'Identificación de otros NNA que viven en el domicilio familiar', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  if (defaultData.otroNNA) {
    cy.selectFromDropdown('Seleccione un niño', defaultData.otroNNA);
    cy.contains('span.p-chip-text', defaultData.otroNNA).should('be.visible');
    cy.contains('button', 'Agregar').click();
    cy.contains('tr', defaultData.otroNNA).should('be.visible');
  }

  // Ir al siguiente paso
  cy.contains('button', 'Siguiente paso').click();

  // PASO 4: Identificación figuras de cuidado
  cy.contains('h2', 'Identificación figuras de cuidado', { timeout: 10000 }).should('be.visible');
  cy.wait(3000);
  
  if (defaultData.personaRelacionada) {
    cy.selectFromDropdown('Seleccione persona relacionada', defaultData.personaRelacionada);
    cy.contains('button', 'Completar los datos de la figura de cuidado seleccionada').click();

    // Completar datos de la figura de cuidado
    if (defaultData.rut) {
      cy.get('input.p-inputtext.p-component').eq(0).should('be.visible').clear().type(defaultData.rut, { delay: 50 });
    }
    
    if (defaultData.regionFigura) {
      cy.selectFromDropdown('Seleccione una región', defaultData.regionFigura);
      cy.wait(2000);
    }
    
    if (defaultData.comunaFigura) {
      cy.selectFromDropdown('Seleccione una comuna', defaultData.comunaFigura);
    }
    
    if (defaultData.direccion) {
      cy.get('input.p-inputtext.p-component').eq(4).should('be.visible').clear().type(defaultData.direccion, { delay: 50 });
      cy.wait(4000);
      cy.get('div.pac-item').first().click({ force: true }, {delay: 50});
    }
    
    if (defaultData.telefono) {
      cy.get('input.p-inputtext.p-component').eq(5).should('be.visible').clear().type(defaultData.telefono, { delay: 50 });
    }
    
    if (defaultData.tipoNacionalidad) {
      cy.selectFromDropdown('Seleccione un tipo de nacionalidad', defaultData.tipoNacionalidad);
    }
    
    if (defaultData.nacionalidad) {
      cy.selectFromDropdown('Seleccione una nacionalidad', defaultData.nacionalidad);
    }
    
    if (defaultData.tipoRelacion) {
      cy.selectFromDropdown('Seleccione un tipo de relación', defaultData.tipoRelacion);
    }
    
    if (defaultData.escolaridadFigura) {
      cy.selectFromDropdown('Seleccione una escolaridad', defaultData.escolaridadFigura);
    }
    
    if (defaultData.profesion) {
      cy.selectFromDropdown('Seleccione profesión u oficio', defaultData.profesion);
    }
    
    // Agregar situaciones
    if (defaultData.situaciones && defaultData.situaciones.length > 0) {
      defaultData.situaciones.forEach(situacion => {
        cy.selectFromDropdown('Seleccione una situación', situacion);
      });
      cy.wait(5000);
      
      // Toma el modal visible y scrollea hasta abajo
      cy.contains('.p-dialog:visible .p-dialog-title', 'Editar persona relacionada', { timeout: 10000 })
        .closest('.p-dialog')
        .as('dlg');
      
      cy.get('@dlg').find('.p-dialog-content').scrollTo('bottom', { ensureScrollable: true });
      
      cy.get('@dlg')
        .find('#form-field-multi-add, button[aria-label="Agregar"]')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .invoke('attr', 'type', 'button')
        .scrollIntoView({ block: 'center' })
        .click('center');
      
      cy.wait(2000);
      cy.get('#form-field-multi-add').click({force: true});
      cy.wait(2000);
      
      // Verificar que las situaciones se agregaron
      defaultData.situaciones.forEach(situacion => {
        cy.contains('tr', situacion).should('be.visible');
      });
    }
    
    // Cerrar modal
    cy.get("div.p-dialog-footer span.p-button-icon").click();
  }

  // Ir al siguiente paso
  cy.contains('button', 'Siguiente paso').click();

  // PASO 5: Ubicación
  cy.contains('h2', 'Ubicación', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  if (defaultData.ubicacion) {
    cy.selectFromDropdown('Seleccione una ubicación', defaultData.ubicacion);
  }

  cy.contains('button', 'Siguiente paso').click();

  // PASO 6: Información de la derivación
  cy.contains('h2', 'Información de la derivación', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  if (defaultData.organismoDeriva) {
    cy.chooseInComplexSelector("div.p-dropdown", defaultData.organismoDeriva);
  }
  
  if (defaultData.fechaDerivacion) {
    cy.selectDateByField('Fecha Derivación', defaultData.fechaDerivacion);
  }
  
  if (defaultData.observacionesDerivacion) {
    cy.get('textarea').type(defaultData.observacionesDerivacion, { delay: 50 });
  }

  cy.contains('button', 'Siguiente paso').click();

  // PASO 7: Metodología aplicada
  cy.contains('h2', 'Metodología aplicada para levantar información para el diagnóstico', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  cy.contains('button', 'Añadir metodología aplicada').click();
  
  if (defaultData.conQuien) {
    cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", defaultData.conQuien);
  }
  
  if (defaultData.metodologia) {
    cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", defaultData.metodologia);
  }
  
  if (defaultData.fechaAplicacion) {
    cy.selectDateByField('Fecha de aplicación', defaultData.fechaAplicacion);
  }
  
  cy.get("div.p-dialog-footer span").click();
  cy.contains('button', 'Siguiente paso').click();

  // PASO 8: Fuentes complementarias de la información
  cy.contains('h2', 'Fuentes complementarias de la información', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);
  
  if (defaultData.archivoAdjunto) {
    cy.get('input[type="file"]').attachFile(defaultData.archivoAdjunto);
    cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('.p-toast-detail').should('contain.text', 'Documento adjuntado');
      });
    cy.contains('div', defaultData.archivoAdjunto).should('be.visible');
  }
  
  cy.contains('button', 'Añadir fuente de información').click();
  cy.contains('div', 'Crear fuente', { timeout: 10000 }).should('be.visible');
  
  if (defaultData.programaInstitucion) {
    cy.get('.p-dialog:visible textarea').eq(0).type(defaultData.programaInstitucion);
  }
  
  if (defaultData.contenidosAbordados) {
    cy.get('.p-dialog:visible textarea').eq(1).type(defaultData.contenidosAbordados);
  }
  
  cy.get("div.p-dialog-footer span").click();
  cy.contains('button', 'Siguiente paso').click();

  cy.log('Formulario DCE completado hasta el paso 8');
});

Cypress.Commands.add('selectRadioInModal', (fieldLabel, optionIndex) => {
    cy.log(`Seleccionando opción ${optionIndex} del campo '${fieldLabel}'`);

    // 1️⃣ Buscar el label del campo dentro del modal
    cy.contains('.p-dialog label', fieldLabel, { matchCase: false })
      .then($label => {
        // 2️⃣ Buscar en el contenedor más cercano que contiene el label y los radios
        const $container = $label.closest('.flex-col, .p-field, div');

        // 3️⃣ Buscar todos los radio buttons después del label
        let $radios = $container.find('input[type="radio"]');

        // 4️⃣ Si no encuentra radios en el contenedor, buscar en los hermanos siguientes
        if ($radios.length === 0) {
          $radios = $label.parent().nextAll().find('input[type="radio"]');
        }

        // 5️⃣ Si aún no encuentra, buscar en todo el grupo de campos
        if ($radios.length === 0) {
          $radios = $label.parent().parent().find('input[type="radio"]');
        }

        if ($radios.length === 0) {
          throw new Error(`No se encontraron radio buttons para el campo: ${fieldLabel}`);
        }

        // 6️⃣ Seleccionar el radio button por índice
        cy.wrap($radios.eq(optionIndex)).check({ force: true });
      });
  });



