const { defineConfig } = require('cypress');
const pg = require('pg');

module.exports = defineConfig({

  // --- AÑADE LAS DOS LÍNEAS AQUÍ ---
  viewportWidth: 1366,
  viewportHeight: 768,
  // ---------------------------------

  e2e: {
    setupNodeEvents(on, config) {
      // Mensaje para confirmar que esta función se ejecuta
      console.log('✅ setupNodeEvents se está ejecutando y registrando tareas.'); 

      on('task', {
        queryDb: (query) => {
          const pool = new pg.Pool(config.env.db);
          return pool.query(query);
        }
      });
    },
    env: {
      db: {    // 1. user: El nombre de usuario que usas en TablePlus.
        user: 'NewSisQA',

        // 2. password: La contraseña para ese usuario. Si no tiene, déjalo vacío ('').
        password: '',

        // 3. host: La dirección del servidor. Si la base de datos está en tu Mac, es 'localhost'.
        host: 'localhost',

        // 4. database: El nombre de la base de datos a la que te conectas (lo ves en TablePlus).
        database: 'newsisdev',

        // 5. port: El puerto de PostgreSQL. Casi siempre es 5432.
        port: 5432,
      },
    },
  },
});