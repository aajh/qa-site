const {createDb, migrate} = require('postgres-migrations');
require('dotenv').config()

const db_config = {
  database: process.env.DB_DATABASE,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT)
 };

const config = { logger: console.log };

(async function() {
  await createDb(db_config.database, db_config, config);
  await migrate(db_config, './migrations', config);  
})()
