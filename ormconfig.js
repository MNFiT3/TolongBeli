var dir = 'src';
if(process.env.NODE_ENV.trim() == 'production'){
   dir = 'build';
}

module.exports =  {
   "type": "sqlite",
   "database": "database.sqlite",
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