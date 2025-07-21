describe ('login con correo', () => {
  it('inicia sesión usando el botón', () => {
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
  




  // seleccionar la opción del desplegable


cy.selectDropdownByField(
  '¿Con qué frecuencia recibe ayuda o asistencia para sus actividades diarias en el hogar o fuera de él debido a su salud?',
  'Siempre'


  
)

// Click en “Añadir nueva gestión”
    cy.contains('button', 'Añadir nueva gestión').click()

    // Espera que aparezca el modal y acota el scope
    cy.get('div.p-dialog', { timeout: 5000 })
      .should('be.visible')
      .within(() => {
        // 1) Escribir en el textarea de descripción
        cy.get('textarea')
          .should('exist')
          .type('Prueba2', { force: true })

        // 2) Click en el botón Guardar
        cy.contains('button', 'Guardar')
          .click()
      })



cy.contains('button', 'Guardar')
.click()



    // Verifica que se muestre la pantalla de inicio
    cy.contains('Información NNA').should('be.visible')

  







  })





 })



 
  

