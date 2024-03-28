const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});
connection.connect();

/**/
async function modulePopUp(color, sort='question') {
    let number = 1
    switch (color){
        case 'yellow': // Lunar
            /*number = Math.floor(Math.random()*2) + 10;*/
            number = 9
            break
        case 'blue': // Domino House
            number = 1
            break
        case 'purple': // Klaphatten
            number = 1
            break
        case 'red': // Safeline
            /*number = Math.floor(Math.random()*2) + 14;*/
            number = 7
            break
        case 'green': // Top of the world
            /*number = Math.floor(Math.random()*2) + 12;*/
            number = 5
            break
        case 'orange': // jysk
            number = 1
            break
        case 'rainbow':
            number = 1
            break
        case 'chance':
            number = Math.floor(Math.random() * 3) + 7;
            break
        case 'sales':
            number = Math.floor(Math.random() * 3) + 1;
            break
        case 'megatrends':
            number = Math.floor(Math.random() * 3) + 4;
            break
    }

    switch (sort) {
        case 'question':
            queryMod = 'SELECT QEnglish FROM questionstable where ID=?';
            break
        case 'answer':
            queryMod = 'SELECT AnswerWord1 FROM questionstable where ID=?';
            break
    }
            // Wrap the queryQuestion in a Promise
            return new Promise((resolve, reject) => {
                connection.query(queryMod, [number], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                   // resolve(results);

                    const resultsString = JSON.stringify(results);

                    const textsQuestionEnglish = resultsString.replace(/["\[\]\/\n]/g, '');
                    resolve(textsQuestionEnglish);
                });
            });

}


/**/




module.exports=modulePopUp;
