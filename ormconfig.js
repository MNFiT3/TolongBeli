var dir = 'src';
var extension = '.ts';
var env = process.env.NODE_ENV.trim();
var ormconfig = {
   "synchronize": true,
   "logging": false
}

if (env == 'production') {
   dir = 'build';
   extension = '.js';

   ormconfig["type"] = "mysql";
   ormconfig["host"] = process.env.DB_HOST;
   ormconfig["port"] = process.env.DB_PORT;
   ormconfig["username"] = process.env.DB_USERNAME;
   ormconfig["password"] = process.env.DB_PASSWORD;
   ormconfig["database"] = process.env.DB_NAME;
   //ormconfig["extra"] = { ssl: true };

}else{
   
   ormconfig["type"] = "mysql";
   ormconfig["host"] = process.env.DB_HOST;
   ormconfig["port"] = process.env.DB_PORT;
   ormconfig["username"] = process.env.DB_USERNAME;
   ormconfig["password"] = process.env.DB_PASSWORD;
   ormconfig["database"] = process.env.DB_NAME;
}

ormconfig["entities"] = [
   dir + "/entity/**/*" + extension
];
ormconfig["migrations"] = [
   dir + "/migration/**/*" + extension
];
ormconfig["subscribers"] = [
   dir + "/subscriber/**/*" + extension
];
ormconfig["cli"] = {
   "entitiesDir": dir + "/entity",
   "migrationsDir": dir + "/migration",
   "subscribersDir": dir + "/subscriber"
};

module.exports = ormconfig;