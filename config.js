require("dotenv").config();
exports.creds = {

};


// If you want to use the mongoDB session store for session middleware; otherwise we will use the default
// session store provided by express-session.
// Note that the default session store is designed for development purpose only.
exports.useMongoDBSessionStore = false;

// If you want to use mongoDB, provide the uri here for the database.
exports.databaseUri = "mongodb://dlink-cosmos:Nur6K13v94nuHIGMczXh2VN36Hb2CztUqp0kaF6RTYQMgwqq634bzYsypwyXcdY9AQtFQKbc6qOwAmWZ8f39cw==@dlink-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@dlink-cosmos@";

// How long you want to keep session in mongoDB.
exports.mongoDBSessionMaxAge = 90 * 24 * 60 * 60; // 90 day (unit is second)

