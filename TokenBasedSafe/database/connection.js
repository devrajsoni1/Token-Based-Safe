require("dotenv").config();
const Sequelize = require("sequelize");

/**
 * CONNECTING MYSQL DATABASE WITH NODEJS USING SEQUELIZE
 */
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    port: 3306,
    loggings: false,
    define: {
        timestamps: false
    }
});

// CHECKING CONNECTION STATUS OF DATABASE
sequelize.authenticate()
.then(() => {
    console.log("connection made with Sequelize");
})
.catch((err) => {
    console.log(err);
});

module.exports = sequelize;