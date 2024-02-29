// import { getQuestion } from "./dataBase.js"

let images = ["images/Dia1.JPG","images/Dia2.JPG","images/Dia3.JPG","images/Dia4.JPG","images/Dia5.JPG","images/Dia6.JPG"]

let dice = document.querySelector("#die-1")



function roll(){
    dice.classList.add("shake")
    
    let interval = setInterval(function() {
        let diceValue = Math.floor(Math.random() * 6);
        dice.setAttribute("src", images[diceValue]);
    }, 100);

    setTimeout(function(){
        clearInterval(interval)
        dice.classList.remove("shake")
        let diceValue = Math.floor(Math.random()*6)
        document.querySelector("#die-1").setAttribute("src", images[diceValue])
        document.querySelector("#total").innerHTML = "You rolled:  " + (diceValue + 1)
    }, 1000)
//+ (diceValue + 1) + getQuestion() + getQuestion();

}
