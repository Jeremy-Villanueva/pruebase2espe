describe ('Editar registro', () => {
  it('Edición registro', () => {
    cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login')
    cy.get ('input[type="email"]').type('luciano@asimov.cl')
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

    cy.contains('Resumen de antecedentes') // Encuentra el contenedor padre
  .parents('div')                     // Sube al div contenedor
  .find('.p-dropdown-trigger')        // Busca el trigger del desplegable dentro de ese contenedor
  .click()                            // Abre el desplegable

cy.wait(300) // Espera a que se despliegue el menú

cy.contains('div', 'Discapacidad').click() // Haz clic en la opción que quieras

cy.contains('Resumen de antecedentes')
  .parents('div')
  .find('div') // Busca todos los divs dentro del contenedor
  .contains('Discapacidad') // Encuentra el div que contiene "Discapacidad"
  .parents('div.p-dropdown') // Sube al contenedor del dropdown de Discapacidad
  .parent() // Sube un nivel si es necesario



// Espera fija
cy.wait(2000)

// Click en la fila que seleccione
cy.clickVerDetalleEnFila(2)






// Una vez estés en la vista del detalle seleccionamos el tipo "Button" con nombre "Editar"

cy.wait(2000) // Espera a que se cargue el modal

cy.contains('button', 'Editar')
  .click()  


  

  cy.selectRadioByField('Dificultades de salud permanente', 1);
  cy.selectRadioByField('¿Puede moverse/desplazarse solo(a) dentro de la casa?', 0)
  cy.selectRadioByField('¿Puede controlar completamente sus esfínteres? (3 años o más)', 0)
  cy.selectRadioByField('¿Puede bañarse, lavarse los dientes, peinarse o comer solo(a)? (6 años o más)', 0)
  cy.selectRadioByField('¿Puede salir solo(a) a la calle sin ayuda o compañía? (6 años o más)', 0)
  cy.selectRadioByField('¿Puede hacer compras o ir al médico solo(a), sin ayuda o compañía? (15 años o más)', 0)
  cy.selectRadioByField('¿Requiere de una persona que le ayude o asista con sus actividades diarias en su hogar o fuera de él debido a su salud?', 0)
  

  // editamos el seleccionable

cy.selectDropdownByField(
  '¿Con qué frecuencia recibe ayuda o asistencia para sus actividades diarias en el hogar o fuera de él debido a su salud?',
  'Casi nunca'


  
)

// Click en “ver detalle”
 cy.contains('button', 'Ver detalle')
  .click()

    // Espera que aparezca el modal y acota el scope
    cy.get('div.p-dialog', { timeout: 5000 })
      .should('be.visible')
      .within(() => {


   cy.contains('button', 'Editar gestión')
    .click()

    // editamos la descripción de la gestión

       cy.get('textarea')
  .should('exist')
  .clear({ force: true })
  .type('Edición de registro prueba', { force: true })


        // 2) Click en el botón Guardar
        cy.contains('button', 'Guardar')
          .click()
      })



cy.contains('button', 'Guardar')
.click()



    // Verifica que se muestre la pantalla edición
    cy.contains('Antecedentes discapacidad SIS').should('be.visible')

  







  })





 })



 
  