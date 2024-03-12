const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});
connection.connect();

async function databaseQuestion(number) {
    const query = 'SELECT QEnglish FROM questionstable where ID=?';

    // Wrap the query in a Promise
    return new Promise((resolve, reject) => {
        connection.query(query, [number], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

module.exports=databaseQuestion;