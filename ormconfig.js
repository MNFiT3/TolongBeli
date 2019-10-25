var env = process.env;
var dir = 'src';

var ormconfig = {
   "synchronize": true,
   "logging": false
}

if (env.NODE_ENV.trim() == 'production') {
   dir = 'build';

   ormconfig["type"] = "postgres";
   ormconfig["host"] = env.DB_HOST;
   ormconfig["port"] = env.DB_PORT;
   ormconfig["username"] = env.DB_USER;
   ormconfig["password"] = env.DB_PASS;
   ormconfig["extra"] = { ssl: true };
}else{
   ormconfig["type"] = "sqlite";
   ormconfig["database"] = "database.sqlite";
}

ormconfig["entities"] = [dir + "/entity/**/*.ts"];
ormconfig["migrations"] = [dir + "/migration/**/*.ts"];
ormconfig["subscribers"] = [dir + "/subscriber/**/*.ts"];
ormconfig["cli"] = {
   "entitiesDir": dir + "/entity",
   "migrationsDir": dir + "/migration",
   "subscribersDir": dir + "/subscriber"
};

module.exports = ormconfig;