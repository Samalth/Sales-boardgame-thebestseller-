import React, {useEffect, useState} from "react";
import {socket} from "../client";
import Dia1 from '../Assets/Dia1.JPG';
import Dia2 from '../Assets/Dia2.JPG';
import Dia3 from '../Assets/Dia3.JPG';
import Dia4 from '../Assets/Dia4.JPG';
import Dia5 from '../Assets/Dia5.JPG';
import Dia6 from '../Assets/Dia6.JPG';

const DiceContainer = ({setSteps, setMoveMade, position}) => {
    const images = [Dia1, Dia2, Dia3, Dia4, Dia5, Dia6];
    const [diceValue, setDiceValue] = useState(1);
    const roll = () => {
        socket.emit("roll_dice")
    };

    useEffect(() => {
        socket.on("set_dice", (data) => {

            const dice = document.querySelector(".diceImage");
            dice.classList.add("shake");
            let interval = setInterval(function () {
                let diceValue = Math.floor(Math.random() * 6) + 1;
                dice.setAttribute("src", images[diceValue - 1]);
            }, 100);

            setTimeout(function () {
                clearInterval(interval);
                dice.classList.remove("shake");
                setDiceValue(data);
                dice.setAttribute("src", images[data - 1]);
                socket.emit("send_dice_roll_and_position", { diceValue: data, position: position });
                setMoveMade(false);
            }, 1000);
        })
    })

    return (
        <div className="dice-container">
            <div className="dice-wrapper">
                <img className="diceImage" src={images[diceValue]} alt={`#dice-${diceValue}`} />
            </div>
            <button type='button' onClick={roll}>Roll the dice</button>
        </div>
    );
}

export default DiceContainer;