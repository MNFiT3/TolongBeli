var dir = 'src';
if (process.env.NODE_ENV.trim() == 'production') {
   dir = 'build';
}

var env = process.env;
module.exports = {
   "type": "postgres",
   "host": env.DB_HOST,
   "port": env.DB_PORT,
   "username": env.DB_USER,
   "password": env.DB_PASS,
   "database": env.DB_NAME,
   extra: {
      ssl: true
   },
   "synchronize": true,
   "logging": false,
   "entities": [
      dir + "/entity/**/*.ts"
   ],
   "migrations": [
      dir + "/migration/**/*.ts"
   ],
   "subscribers": [
      dir + "/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": dir + "/entity",
      "migrationsDir": dir + "/migration",
      "subscribersDir": dir + "/subscriber"
   }
}