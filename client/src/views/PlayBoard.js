import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import io from 'socket.io-client'
// import '../CSS/diceScreen.css'

const socket = io.connect("http://localhost:3001")

const BoardGrid = () => {
    return (
        <div className="board-grid">
        {/* <!-- Top row --> */}
        <img src="../Mensen.png"/>
        <div className="tile pawn yellow"/>
        <div className="tile pawn red"/>
        <img src="../Wereld.png"/>
        <img src="../Rainbow.png"/>
        <div className="tile pawn blue"/>
        <img src="../Masker.png"/>
        <div className="tile pawn purple"/>
        <div className="tile pawn yellow"/>
        <img src="../Mensen.png"/>
        <img src="../Rainbow.png"/>
        <div className="tile pawn green"/>
        <img src="../Wereld.png"/>
        <div className="tile pawn blue"/>
        <div className="tile pawn purple"/>
        {/* <!-- first row --> */}
        <div className="tile pawn green"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Wereld.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Masker.png"/>
        {/* <!-- second row --> */}
        <img src="../Masker.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile pawn red"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile pawn orange"/>
        {/* <!-- third row --> */}
        <div className="tile pawn orange"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Masker.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Rainbow.png"/>
        {/* <!-- fourth and middle row--> */}
        <img src="../Rainbow.png"/>
        <img src="../Mensen.png"/>
        <div className="tile pawn purple"/>
        <img src="../Masker.png"/>
        <div className="tile pawn yellow"/>
        <img src="../Wereld.png"/>
        <div className="tile pawn blue"/>
        <div className="tile pawn start">
            START
        </div>
        <img src="../Rainbow.png"/>
        <img src="../Mensen.png"/>
        <div className="tile pawn blue"/>
        <img src="../Wereld.png"/>
        <div className="tile pawn yellow"/>
        <div className="tile pawn green"/>
        <img src="../Mensen.png"/>
        {/* <!-- fifth row--> */}
        <img src="../Wereld.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Mensen.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile pawn red"/>
        {/* <!-- sixth row --> */}
        <div className="tile pawn blue"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile pawn green"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile pawn blue"/>
        {/* <!-- seventh row --> */}
        <div className="tile pawn red"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Masker.png"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <div className="tile"/>
        <img src="../Wereld.png"/>
        {/* <!-- Bottom row --> */}
        <img src="../Mensen.png"/>
        <img src="../Rainbow.png"/>
        <div className="tile pawn orange"/>
        <img src="../Masker.png"/>
        <div className="tile pawn purple"/>
        <div className="tile pawn yellow"/>
        <img src="../Wereld.png"/>
        <img src="../Rainbow.png"/>
        <div className="tile pawn red"/>
        <img src="../Mensen.png"/>
        <div className="tile pawn purple"/>
        <div className="tile pawn green"/>
        <img src="../Masker.png"/>
        <img src="../Rainbow.png"/>
        <div className="tile pawn orange"/>
    </div>
    );
};
    
const DiceContainer = () => {
    const [diceValue, setDiceValue] = useState(1);
    const [question, setQuestion] = useState("");

    useEffect(() => {
        socket.on("receive_question", (data) =>{
            // console.log("question received")
            setQuestion(data);
        });
        return () => {
            socket.off('receive_question');
        };
    }, [socket]);

    const sendQuestionRequest = (number) => {
        socket.emit("send_question_request", { questionNumber: number });
    };
    
    const roll = () => {
        const images = ["../Dia1.JPG", "../Dia2.JPG", "../Dia3.JPG", "../Dia4.JPG", "../Dia5.JPG", "../Dia6.JPG"];
        const dice = document.querySelector(".diceImage");
        dice.classList.add("shake");
    
        let interval = setInterval(function() {
            let diceValue = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute("src", images[diceValue - 1]);
        }, 100);
    
        setTimeout(function(){
            clearInterval(interval);
            dice.classList.remove("shake");
            const newDiceValue = Math.floor(Math.random() * 6) + 1;
            setDiceValue(newDiceValue);
            dice.setAttribute("src", images[newDiceValue - 1]);
            sendQuestionRequest(newDiceValue); // Pass the new dice value directly
            // console.log(newDiceValue)
        }, 1000);
    };

    return (
        <div className="container">
            <div className="dice-wrapper">
                <img className="diceImage" src={`../Dia${diceValue}.JPG`} alt='#die-1' />
            </div>
            <button type='button' onClick={roll}>Roll the dice</button>
            <label className='total-text'>{question}</label>
        </div>
    );
};

export function PlayBoard() {
    return (
        <>
            <BoardGrid />
            <DiceContainer />
        </>
    );
};
