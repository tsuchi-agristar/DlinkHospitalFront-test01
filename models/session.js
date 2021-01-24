
const Sequelize = require('sequelize');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const sequelize = new Sequelize('dlinkdbtest02', 'dlinkdb', 'Password!', {
// 	host: 'dlinkdb.database.windows.net',
// 	dialect: 'mssql',
// 	dialectOptions: { // MSSQL tedious用のオプション
// 		options: {
// 			 encrypt: true,
// 			 trustServerCertificate: true
// 		}
// 	},
// 	logging: false
// 	// pool: {
// 	// 	max: 5,
// 	// 	min: 0,
// 	// 	acquire: 30000,
// 	// 	idle: 10000
// 	// },
// 	// define: {
// 	// 	// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
// 	// 	// This was true by default, but now is false by default
// 	// 	timestamps: true
// 	// }
// });
const sequelize = new Sequelize(
	process.env.DB_DATABASE || 'dlinkdbtest02',
	process.env.DB_USERNAME || 'dlinkdb',
	process.env.DB_PASSWORD || 'Password!',
	{
		host: process.env.DB_HOST || 'dlinkdb.database.windows.net',
		dialect: process.env.DB_CONNECTION || 'mssql',
		dialectOptions: { // MSSQL tedious用のオプション
			options: {
				encrypt: true,
				trustServerCertificate: true
			}
		},
		logging: false
		// pool: {
		// 	max: 5,
		// 	min: 0,
		// 	acquire: 30000,
		// 	idle: 10000
		// },
		// define: {
		// 	// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
		// 	// This was true by default, but now is false by default
		// 	timestamps: true
		// }
	}
);


const Session = sequelize.define('Sessions', {
	sid: {
	  type: Sequelize.STRING,
	  primaryKey: true
	},
	expires: Sequelize.DATE,
	data: Sequelize.TEXT
});

exports.db = new SequelizeStore({
	db: sequelize,
	table: 'Sessions',
})
