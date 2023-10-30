'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// Validate the use_env_variable property in the config object
if (!config.use_env_variable) {
  throw new Error('The use_env_variable property in the config object must not be null.');
}

// Validate the environment variables (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
const requiredEnvVariables = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
for (const envVar of requiredEnvVariables) {
  if (!process.env[envVar]) {
    throw new Error(`The ${envVar} environment variable must not be null.`);
  }
}

// Create a new Sequelize instance
sequelize = new Sequelize(
  process.env[config.use_env_variable], // Use the environment variable specified in config
  config
);

// Load all of the model files
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate the models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add the sequelize instance to the db object
db.sequelize = sequelize;

// Add the Sequelize constructor to the db object
db.Sequelize = Sequelize;

module.exports = db;
