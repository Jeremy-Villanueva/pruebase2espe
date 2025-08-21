

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

beforeEach(() => {
  cy.log('--- Iniciando preparación: Login y navegación ---');
  cy.visit('https://mejorninez-frontend.9.asimov.cl/auth/login');
  cy.get('input[type="email"]').type('francisco@asimov.cl');
  cy.get('input[type="password"]').type('Of3M4uV23QISQi');
  cy.contains('button', 'Ingresar').click();

    cy.wait(3000); 

 // Abrir el primer desplegable y esperar a que sea visible
  cy.get('.p-dropdown').first().should('be.visible').click();
  cy.wait(2000); 
// Esperar un segundo para que el dropdown se abra
  
  // desplegable visible y hacer clic en él
  cy.get('.p-dropdown .p-dropdown-label.p-inputtext').first()
  .should('be.visible').click();

  // Esperamos que el campo de búsqueda esté visible y hacemos clic en él
  cy.get('.p-dropdown-filter.p-inputtext').first().should('be.visible').click();

  // Escribir en el campo de búsqueda
  cy.get('.p-dropdown-filter.p-inputtext').first().type('FUNDACIÓN PRODERE', { force: true }).should('have.value', 'FUNDACIÓN PRODERE');
  
  // Seleccionar la deseada
  cy.contains('FUNDACIÓN PRODERE').first().click();
  

  // -------MOSTRAR POR PROYECTO-----------------

// Abrir el tercer desplegable para "Mostrar por proyecto"
cy.wait(2000); // Esperar un segundo para que el dropdown se abra
  cy.get('.p-dropdown').eq(1).click();
  
cy.wait(2000); // Esperar un segundo para que el dropdown se abra
  // Esperar a que el campo de búsqueda "Mostrar por proyecto" sea visible
  cy.get('.p-dropdown-filter.p-inputtext').should('be.visible').click({ force: true });

  // Escribir "DCE" en el campo de búsqueda
  cy.get('.p-dropdown-filter.p-inputtext').first().type('DCE', { force: true }).should('have.value', 'DCE');
  
  // Seleccionar la opción "DCE" de la lista
  cy.contains('DCE').first().click({ force: true });


cy.wait(3000)
  
//seleccionamos un NNA y damos clic en ver detalle
cy.get('table').find('tr') // Encuentra todas las filas
  .contains('2091597') // Busca la fila con el código NNA
  .parent() // Selecciona la fila completa
  .contains('Ver detalle') // Encuentra el enlace "Ver detalle" dentro de esa fila
  .click(); // Realiza el clic

 cy.contains('button', 'Agregar DCE').click();

// llegamos a la creación del DCE antes de la primera prueba
});


//-----------------CASO DE PRUEBA 1-----------------

it.only('debería crear un DCE y verificar su creación con la fecha actual', () => {
    cy.log('--- Ejecutando prueba 1: CREAR DCE ---');
    
    // Rellenamos el formulario

    //validamos que estemos en el paso correcto

    cy.contains('h2', 'Datos modificables del NNA')
  .should('be.visible')

  cy.log('----Estás en el paso N1----');

cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Sin escolaridad");

cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Sin grado - Sin escolaridad");
cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "REGIÓN DE ATACAMA");
cy.wait(3000)
cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "No existe en el listado");
cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "FONASA");

cy.contains('button', 'Siguiente paso').click();

cy.log('Abriendo el dropdown de Usuario...');
  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N2-----');
cy.wait(2000)
    // Ahora que la página está cargada, interactuamos con el desplegable.
    // Usamos el comando personalizado para mantener el código limpio.
cy.wait(2000)
    cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');
    

    // Verificación:
    cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

cy.log('-----Profesional agregado-------')
//validamos que profesional se agregó

//AGREGAMOS AL PROFESIONAL A RESUMEN PROFESIONALES
cy.contains('button', 'Agregar').click()

cy.contains('div.p-datatable', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

cy.log('----PROFESIONAL AGREGADO AL RESUMEN------')
//VAMOS AL PASO 3
cy.contains('button', 'Siguiente paso').click()
cy.contains('h2', 'Identificación de otros NNA que viven en el domicilio familiar', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N3-----');
cy.wait(2000)

cy.selectFromDropdown('Seleccione un niño', 'AMANDA CANTILLANA');

    // Verificación:
    cy.contains('span.p-chip-text', 'AMANDA CANTILLANA').should('be.visible');

cy.contains('button', 'Agregar').click()
    
const nombreProfesional = 'AMANDA CANTILLANA';

// 1. Busca la fila de la tabla (tr) que contiene el nombre del NIÑO.
cy.contains('tr', nombreProfesional).should('be.visible');
cy.log('---- NIÑO AGREGADO -------------')
cy.contains('button', 'Siguiente paso').click()

cy.log('-----PASAMOS AL PASO 4-------');
cy.contains('h2', 'Identificación figuras de cuidado', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N4-----');
cy.wait(2000)

cy.selectFromDropdown('Seleccione persona relacionada', 'DANIEL ALBERTO AVILES ASTUDILLO');

cy.contains('button', 'Completar los datos de la figura de cuidado seleccionada').click()


cy.get('input.p-inputtext.p-component')
  .eq(0) // si hay varios y quieres el primero
  .should('be.visible')
  .clear()
  .type('20789297-1', { delay: 50 });

cy.selectFromDropdown('Seleccione una región', 'REGIÓN DE LOS LAGOS');

cy.wait(2000);

cy.selectFromDropdown('Seleccione una comuna', 'OSORNO');

cy.get('input.p-inputtext.p-component')
  .eq(4) // el quinto
  .should('be.visible')
  .clear()
  .type('Santa ana 1591', { delay: 50 });
cy.wait(4000)
// Espera a que aparezca el menú y selecciona la primera opción
cy.get('div.pac-item') // Cambia el selector según el HTML real
  .first()
  .click({ force: true }, {delay: 50});


cy.get('input.p-inputtext.p-component')
  .eq(5) // el quinto
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


// Toma el modal visible
cy.contains('.p-dialog:visible .p-dialog-title', 'Editar persona relacionada', { timeout: 10000 })
  .closest('.p-dialog')
  .as('dlg');

// Scrollea el contenedor del modal hasta abajo (el scroll real suele estar en .p-dialog-content)
cy.get('@dlg').find('.p-dialog-content')
  .scrollTo('bottom', { ensureScrollable: true });

// Asegura que el botón esté habilitado y visible; evita submit implícito
cy.get('@dlg')
  .find('#form-field-multi-add, button[aria-label="Agregar"]')
  .first()
  .should('be.visible')
  .and('not.be.disabled')
  .invoke('attr', 'type', 'button')        // por si es submit por defecto
  .scrollIntoView({ block: 'center' })     // scroll dentro del modal, no en body
  .click('center');                        // clic centrado (evita borde/backdrop)
cy.wait(2000)
cy.get('#form-field-multi-add').click({force: true});
cy.wait(2000)
cy.contains('tr', 'CONSUMO PROBLEMÁTICO DE DROGAS').should('be.visible');
cy.contains('tr', 'CONSUMO PROBLEMÁTICO DE ALCOHOL').should('be.visible');
cy.log('----SITUACIONES AGREGADAS------')

 cy.get("div.p-dialog-footer span.p-button-icon").click();



//VAMOS AL PASO 5
cy.contains('button', 'Siguiente paso').click()
cy.contains('h2', 'Ubicación', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N5-----');
cy.wait(2000)

cy.selectFromDropdown('Seleccione una ubicación', 'Programa residencial');

cy.contains('button', 'Siguiente paso').click()


//VAMOS AL PASO 6
cy.contains('h2', 'Información de la derivación', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N6-----');
cy.wait(2000)
cy.chooseInComplexSelector("div.p-dropdown", "Tribunal de Familia");

cy.selectDateByField('Fecha Derivación', dayjs().format('2025-07-31')); // Formato de fecha AAAA/MM/DD (poner la que quieras)
cy.get('textarea').type('Pruebaaaaaaaa', { delay: 50 });

cy.contains('button', 'Siguiente paso').click();

//VAMOS AL PASO 7
cy.contains('h2', 'Metodología aplicada para levantar información para el diagnóstico', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N7-----');
cy.wait(2000)

cy.contains('button', 'Añadir metodología aplicada').click(); 

cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Con el niño, niña o adolescente");
cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Entrevista a niños, niñas y adolescentes.");
cy.selectDateByField('Fecha de aplicación', dayjs().format('2025-08-18')); // Formato de fecha AAAA/MM/DD (poner la que quieras)

cy.contains('button', 'Guardar').click();

cy.contains('button', 'Siguiente paso').click();




});


//------------------CASO DE PRUEBA 2-----------------

it('debería eliminar profesional seleccionado', () => {
    cy.log('--- Ejecutando prueba 2: ELIMINAR PROFESIONAL SELECCIONADO ---');
    
    // Rellenamos el formulario

    //validamos que estemos en el paso correcto

    cy.contains('h2', 'Datos modificables del NNA')
  .should('be.visible')

  cy.log('----Estás en el paso N1----');

cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Sin escolaridad");

cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Sin grado - Sin escolaridad");
cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "REGIÓN DE ATACAMA");
cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "No existe en el listado");
cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "FONASA");

cy.contains('button', 'Siguiente paso').click();



cy.log('Abriendo el dropdown de Usuario...');
  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N2-----');
cy.wait(2000)
    // Ahora que la página está cargada, interactuamos con el desplegable.
    // Usamos el comando personalizado para mantener el código limpio.
    cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');

    //Verificación:
    cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');


cy.log('Eliminando a un profesional específico de la lista...');

// Define el nombre del profesional que quieres eliminar
const nombreProfesionalAEliminar = 'CAMILA ALEJANDRA SALAZAR INOSTROZA';

cy.wait(2000)
// 1. Buscamos el componente 'chip' que contiene el nombre del profesional.
//    La clase '.p-chip' es una suposición común, si es diferente, ajústala.
cy.contains('div.p-chip', nombreProfesionalAEliminar)
  // 2. Dentro de ese chip, encontramos el ícono de remover por su atributo único.
  .find('svg[data-pc-section="removeicon"]')
  // 3. Hacemos clic en él.
  .click();

// Verificación:
// Asegúrate de que el chip con el nombre de ese profesional ya no exista.
cy.contains('div.p-chip', nombreProfesionalAEliminar).should('not.exist');

cy.log('----Profesional eliminado-----')


});

//---------------CASO DE PRUEBA 3---------------------
it('debería eliminar profesional agregado', () => {
    cy.log('--- Ejecutando prueba 3: ELIMINAR PROFESIONAL AGREGADO ---');
    
    // Rellenamos el formulario

    //validamos que estemos en el paso correcto

    cy.contains('h2', 'Datos modificables del NNA')
  .should('be.visible')

  cy.log('----Estás en el paso N1----');

cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Sin escolaridad");

cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Sin grado - Sin escolaridad");
cy.chooseInComplexSelector("div:nth-of-type(3) > div.p-dropdown > span", "REGIÓN DE ATACAMA");
cy.chooseInComplexSelector("div:nth-of-type(4) > div.p-dropdown > span", "No existe en el listado");
cy.chooseInComplexSelector("div:nth-of-type(5) > div.p-dropdown > span", "FONASA");

cy.contains('button', 'Siguiente paso').click();



cy.log('Abriendo el dropdown de Usuario...');
  cy.contains('h2', 'Trabajadores DCE', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N2-----');
cy.wait(2000)
    // Ahora que la página está cargada, interactuamos con el desplegable.
    // Usamos el comando personalizado para mantener el código limpio.
    cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');

    //Verificación:
    cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');


cy.contains('button', 'Agregar').click()

cy.contains('div.p-datatable', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

cy.log('----PROFESIONAL AGREGADO AL RESUMEN------')

cy.log('Buscando la fila de CAMILA y haciendo clic en su botón de eliminar...');

const nombreProfesional = 'CAMILA ALEJANDRA SALAZAR INOSTROZA';

// 1. Busca la fila de la tabla (tr) que contiene el nombre del profesional.
cy.contains('tr', nombreProfesional)
  // 2. Dentro de esa fila específica, busca el ícono del basurero.
  //    (La clase '.pi-trash' es muy común para estos íconos, ¡verifícala inspeccionando!)
  .find('.pi-trash')
  // 3. Sube al elemento <button> que contiene el ícono para asegurar el clic.
  .closest('button')
  // 4. Y finalmente, haz clic.
  .click();
cy.log(`Se ha hecho clic para eliminar a ${nombreProfesional}.`);

cy.log('----PRUEBA COMPLETADA------')
})

