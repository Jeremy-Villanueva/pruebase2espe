

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
  .contains('2087618') 
  .parent() 
  .contains('Ver detalle') 
  .click(); 

 cy.contains('button', 'Agregar DCE').click();

});


//-----------------CASO DE PRUEBA 1-----------------

it.only('debería crear un DCE y verificar su creación con la fecha actual', () => {
    cy.log('--- Ejecutando prueba 1: CREAR DCE ---');
    
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
cy.wait(2000)
    cy.selectFromDropdown('Seleccione un usuario', 'CAMILA ALEJANDRA SALAZAR INOSTROZA');
        cy.contains('span.p-chip-text', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

cy.log('-----Profesional agregado-------')

cy.contains('button', 'Agregar').click()

cy.contains('div.p-datatable', 'CAMILA ALEJANDRA SALAZAR INOSTROZA').should('be.visible');

cy.log('----PROFESIONAL AGREGADO AL RESUMEN------')
cy.contains('button', 'Siguiente paso').click()
cy.contains('h2', 'Identificación de otros NNA que viven en el domicilio familiar', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N3-----');
cy.wait(2000)

cy.selectFromDropdown('Seleccione un niño', 'AMANDA CANTILLANA');

    cy.contains('span.p-chip-text', 'AMANDA CANTILLANA').should('be.visible');

cy.contains('button', 'Agregar').click()
    
const nombreProfesional = 'AMANDA CANTILLANA';
cy.contains('tr', nombreProfesional).should('be.visible');
cy.log('---- NIÑO AGREGADO -------------')
cy.contains('button', 'Siguiente paso').click()

cy.log('-----PASAMOS AL PASO 4-------');
cy.contains('h2', 'Identificación figuras de cuidado', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N4-----');
cy.wait(5000)

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

//cy.selectFromDropdown('Seleccione un tipo de nacionalidad', 'EXTRANJERO(A)');

//cy.selectFromDropdown('Seleccione una nacionalidad', 'China');
cy.selectFromDropdown('Seleccione un tipo de relación', 'YERNO');


//cy.selectFromDropdown('Seleccione una escolaridad', 'SE DESCONOCE');

//cy.selectFromDropdown('Seleccione profesión u oficio', 'FOTOGRAFO(A)');
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
cy.log('----SITUACIONES AGREGADAS------')

 cy.get("div.p-dialog-footer span.p-button-icon").click();

cy.contains('button', 'Siguiente paso').click()
cy.contains('h2', 'Ubicación', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N5-----');
cy.wait(2000)

cy.selectFromDropdown('Seleccione una ubicación', 'Programa residencial');

cy.contains('button', 'Siguiente paso').click()

cy.contains('h2', 'Información de la derivación', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N6-----');
cy.wait(2000)
cy.chooseInComplexSelector("div.p-dropdown", "Tribunal de Familia");

cy.selectDateByField('Fecha Derivación', dayjs().format('2025-10-05')); 
cy.get('textarea').type('Pruebaaaaaaaa', { delay: 50 });

cy.contains('button', 'Siguiente paso').click();

cy.contains('h2', 'Metodología aplicada para levantar información para el diagnóstico', { timeout: 10000 }).should('be.visible');
    cy.log('----Estás en el paso N7-----');
cy.wait(2000)

cy.contains('button', 'Añadir metodología aplicada').click(); 

cy.chooseInComplexSelector("div:nth-of-type(1) > div.p-dropdown > span", "Con el niño, niña o adolescente");
cy.chooseInComplexSelector("div:nth-of-type(2) > div.p-dropdown > span", "Entrevista a niños, niñas y adolescentes.");
cy.selectDateByField('Fecha de aplicación', dayjs().format('2025-09-09')); 
cy.get("div.p-dialog-footer span").click();

cy.contains('button', 'Siguiente paso').click();

cy.contains('h2', 'Fuentes complementarias de la información', { timeout: 10000 }).should('be.visible');

cy.log('----Estás en el paso N8-----');
cy.wait(2000)

cy.get('input[type="file"]')
    .attachFile('Hola esto es una prueba.pdf');


  cy.get('.p-toast-message-success', { timeout: 10000 })
      .should('be.visible') 
      .within(() => {
       
        cy.get('.p-toast-detail').should('contain.text', 'Documento adjuntado');
      });

    cy.log('¡Notificación validada exitosamente y documento adjuntado correctamente!');

  cy.contains('div', 'Hola esto es una prueba.pdf').should('be.visible');

cy.log('----DOCUMENTO ADJUNTADO------')

cy.log('Añadimos una fuente de información')

cy.contains('button', 'Añadir fuente de información').click();

cy.contains('div', 'Crear fuente', { timeout: 10000 }).should('be.visible');

cy.get('.p-dialog:visible textarea').eq(0).type('Prueba campo 1');         
cy.get('.p-dialog:visible textarea').eq(1).type('Prueba campo 2'); 

 cy.get("div.p-dialog-footer span").click();
cy.log('¡Fuente de información creada correctamente!');
cy.contains('button', 'Siguiente paso').click();

cy.log('----Estás en el paso N9-----')
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

cy.log('----DIMENSIONES NO COMPLETADAS------')

cy.log('Vamos a completar la primera dimensión')

cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});


cy.selectFromDropdown('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA ', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


cy.log('Vamos a completar la segunda dimensión')

cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 ', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


cy.log('Vamos a completar la tercera dimensión')

cy.contains('tr, div[role="row"]', /Presencia de soportes intersectoriales/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 ', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


cy.log('Vamos a completar la 4ta dimensión')

cy.contains('tr, div[role="row"]', /Presencia de soportes intersectoriales hacia el niño/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click();
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 ', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

cy.log('Vamos a completar la 5ta dimensión')

cy.contains('tr, div[role="row"]', /Presencia de soportes comunitarios hacia la familia/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

cy.log('Vamos a completar la 6ta dimensión')

cy.contains('tr, div[role="row"]', /Presencia de soportes comunitarios hacia el niño/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});


cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Intermedio');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 6', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

cy.wait(2000)
cy.contains('div.flex.justify-between', /Características del entorno/i)
  .find('span.p-badge')
  .should('contain.text', 'Completado')   
  .and('have.class', 'p-badge-success');      


cy.log('Vamos al segundo bloque')
cy.contains('Capacidades de cuidado de la familia o cuidadores/a').should('be.visible');

cy.log('Vamos a completar la primera dimensión del segundo bloque')

cy.contains('tr, div[role="row"]', /Disponibilidad hacia la intervención/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Sin desprotección');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 segundo bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

 //completamos la 2da dimensión del segundo bloque
cy.log('Vamos a completar la 2da dimensión del segundo bloque')

cy.contains('tr, div[role="row"]', /Recursos a nivel familiar/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); // admite ambos estados
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Sin desprotección');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 segundo bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


 //completamos la 3ra dimensión del segundo bloque
cy.log('Vamos a completar la 3ra dimensión del segundo bloque')

cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia, a nivel familiar/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); // admite ambos estados
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Sin desprotección');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 segundo bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

  //completamos la 4ta dimensión del segundo bloque
cy.log('Vamos a completar la 4ta dimensión del segundo bloque')

cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia de la violencia, a nivel familiar./i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); // admite ambos estados
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Sin desprotección');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 segundo bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


 //completamos la 5ta dimensión del segundo bloque
cy.log('Vamos a completar la 5ta dimensión del segundo bloque')

cy.contains('tr, div[role="row"]', 'Capacidad de satisfacer las necesidades del niño/a o adolescente')
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); // admite ambos estados
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Sin desprotección');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5 segundo bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

// verificar que se completó el segundo bloque
cy.wait(2000)
cy.contains('div.flex.justify-between', /Capacidades de cuidado/i)
  .find('span.p-badge')
  .should('contain.text', 'Completado')   
  .and('have.class', 'p-badge-success');      // o 'p-badge-success'

//-------------------------------------------------------
//verificamos que estamos en el tercer bloque
cy.log('Vamos al segundo bloque')
cy.contains('Situación del niño/a o adolescente').should('be.visible');

//completamos la 1 dimensión del tercer bloque
cy.log('Vamos a completar la primera dimensión del tercer bloque')

cy.contains('tr, div[role="row"]', /Recursos a nivel individual/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 tercer bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();





//completamos la 2 dimensión del tercer bloque
cy.log('Vamos a completar la segunda dimensión del tercer bloque')

cy.contains('tr, div[role="row"]', /Factores protectores de recurrencia, a nivel individual/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción
cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 tercer bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

//completamos la 3 dimensión del tercer bloque
cy.log('Vamos a completar la tercera dimensión del tercer bloque')

cy.contains('tr, div[role="row"]', /Factores de riesgo de recurrencia de la violencia, a nivel individual/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción
cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 3 tercer bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();


 // prueba 4 tercer bloque
 //completamos la 4 dimensión del tercer bloque
cy.log('Vamos a completar la cuarta dimensión del tercer bloque')

cy.contains('tr, div[role="row"]', /Impacto biopsicosocial de la violencia./i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción
cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 4 tercer bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

  //completamos la 5 dimensión del tercer bloque
cy.log('Vamos a completar la quinta dimensión del tercer bloque')

cy.contains('tr, div[role="row"]', /Satisfacción de sus necesidades físicas, de seguridad, emocionales, sociales y cognitivas/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción
cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 5 tercer bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

 // verificar que se completó el tercer bloque
cy.wait(2000)
cy.contains('div.flex.justify-between', 'Situación del niño/a o adolescente')
  .find('span.p-badge')
  .should('contain.text', 'Completado')   
  .and('have.class', 'p-badge-success');      // o 'p-badge-success'


  // vamos a la cuarta dimensión
  //-------------------------------------------------------
//verificamos que estamos en el cuarto bloque
cy.log('Vamos al cuarto bloque')
cy.contains('Características de la situación de vulneración o violencia').should('be.visible');

//completamos la 1 dimensión del cuarto bloque
cy.log('Vamos a completar la primera dimensión del cuarto bloque')

cy.contains('tr, div[role="row"]', /Trayectoria de vulneración/i)
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 1 cuarto bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

//completamos la 2 dimensión del cuarto bloque
cy.log('Vamos a completar la segunda dimensión del cuarto bloque')

cy.contains('tr, div[role="row"]', "Tipología de violencia/maltrato, nivel de gravedad según Valora Galicia adaptado")
  .scrollIntoView()
  .within(() => {
    cy.contains(/Completar/).click(); 
 })

 // Limpiamos el dropdown dentro del modal visible
cy.get('.p-dialog-mask:visible .p-dialog:visible').within(() => {
  cy.get('[aria-label="Limpiar"]').should('be.visible').click({ force: true });
});
//seleccionamos una opción

cy.changeDropdownInModal('Seleccione un nivel de desprotección', 'Avanzado');
cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 2 cuarto bloque', { delay: 50 });
 cy.get("div.p-dialog-footer button").click();

  // verificar que se completó el cuarto bloque
cy.wait(2000)
cy.contains('div.flex.justify-between', 'Características de la situación de vulneración o violencia')
  .find('span.p-badge')
  .should('contain.text', 'Completado')   
  .and('have.class', 'p-badge-success');      // o 'p-badge-success'

  cy.log('----TODAS LAS DIMENSIONES COMPLETADAS------')

  //vamos al siguiente paso
  cy.contains('button', 'Siguiente paso').click()


  cy.contains('h2', 'Medida de protección a tribunal', { timeout: 10000 }).should('be.visible');

  cy.selectRadioByField('Solicitud del proyecto de medida de protección a tribunal de familia ante detección de situación de riesgo', 0);

  cy.contains('button', 'Siguiente paso').click()
  

  cy.log('----Estás en el paso N11-----')
  cy.contains('h2', 'Conclusiones del diagnóstico', { timeout: 10000 }).should('be.visible');

  cy.get('textarea').type('Pruebaaaaaaaa aAAAAA 11', { delay: 50 });

  cy.selectFromDropdown('Seleccione un nivel de desprotección detectado', 'Sin ningún nivel de desprotección, en todas las dimensiones');

  cy.contains('button', 'Enviar').click()
  
})


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
