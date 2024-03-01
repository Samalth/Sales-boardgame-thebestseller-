var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});



con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT AnswerWord1 FROM questionstable WHERE ID = 10", function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    });
});

export function getQuestion(){
    return "het werkt"
}