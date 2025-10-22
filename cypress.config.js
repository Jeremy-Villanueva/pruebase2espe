const { defineConfig } = require('cypress');
const pg = require('pg');

module.exports = defineConfig({
  projectId: "9zfoe8", // ← Movido aquí dentro del defineConfig
  
  viewportWidth: 1366,
  viewportHeight: 768,
  
  e2e: {
    setupNodeEvents(on, config) {
     
    },
    
  },
});

