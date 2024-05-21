import React, {useEffect, useState} from "react";
import { socket } from "../client";
import './Dice.css'
import Dice1 from '../Assets/Dia1.JPG';
import Dice2 from '../Assets/Dia2.JPG';
import Dice3 from '../Assets/Dia3.JPG';
import Dice4 from '../Assets/Dia4.JPG';
import Dice5 from '../Assets/Dia5.JPG';
import Dice6 from '../Assets/Dia6.JPG';
import {useTranslation} from "react-i18next";

const DiceContainer = (props) => {
    const { t, i18n } = useTranslation('global');
    const [diceValue, setDiceValue] = useState(1);
    const [playerName, setPlayerName] = useState('');
    const { position, setMyTurn, isModeratorScreen, myTurn } = props;
    const images = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

    const roll = () => {
        socket.emit("roll_dice");
        setMyTurn(false);
    };

    useEffect(() => {

        const setDice = (data) => {
            const dice = document.querySelector(".diceImage");
            dice.classList.add("shake");

            const interval = setInterval(() => {
                const diceValue = Math.floor(Math.random() * 6) + 1;
                dice.setAttribute("src", images[diceValue - 1]);
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                dice.classList.remove("shake");
                setDiceValue(data);
                dice.setAttribute("src", images[data - 1]);
                socket.emit("send_dice_roll_and_position", { diceValue: data, position: position });
            }, 1000);
        };

        socket.on("set_dice", setDice);
        socket.on("players_name", setPlayerName);

        return () => {
            socket.off("set_dice", setDice);
            socket.off("players_name", setPlayerName);
        };
    }, [position]);

    return (
        <div className="dice-container">
            <div className="dice-wrapper">
                <img className="diceImage" src={images[diceValue - 1]} alt="dice" />
            </div>
            {isModeratorScreen ?
                <div className="turnsModView"> {playerName} {t("Game.TurnText")}</div> :
                <div>
                    {myTurn && <button type='button' onClick={roll}>{t("Game.rollDice")}</button>}
                </div>
            }
        </div>
    );
};

export default DiceContainer;
