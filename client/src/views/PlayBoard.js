// import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';

import {socket} from '../client'

const BoardGrid = () => {
    const boardWidth = 15;
    const boardHeight = 9;
    const totalTiles = boardWidth * boardHeight;

    const tileInfo = [
        'people','yellow','red','world','rainbow','blue','mask', 'purple', 'yellow', 'people','rainbow', 'green','world','blue','purple',
        'green','blank','blank','blank', 'blank','blank', 'blank', 'world', 'blank', 'blank','blank', 'blank', 'blank', 'blank','mask',
        'mask','blank','blank','blank','blank','blank', 'blank', 'red', 'blank','blank','blank', 'blank', 'blank','blank','orange',
        'orange','blank','blank','blank', 'blank','blank', 'blank', 'mask', 'blank', 'blank','blank', 'blank', 'blank','blank', 'rainbow',
        'rainbow','people','purple','mask', 'yellow','world', 'blue', 'start', 'rainbow', 'people','blue', 'world', 'yellow','green', 'people',
        'world','blank','blank', 'blank', 'blank','blank', 'blank', 'people', 'blank', 'blank','blank', 'blank', 'blank','blank', 'red',
        'blue','blank', 'blank', 'blank', 'blank','blank', 'blank', 'green', 'blank', 'blank','blank','blank','blank','blank','blue',
        'red', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'mask', 'blank', 'blank','blank', 'blank', 'blank','blank', 'world',
        'people', 'rainbow', 'orange', 'mask', 'purple','yellow', 'world', 'rainbow', 'red', 'people','purple','green', 'mask', 'rainbow', 'orange'
    ];

    const tiles = [];

    // Function to render start pieces
    const renderStartPieces = () => {
        const startPieces = ['lunar', 'world'];
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`} draggable={true}/>
        ));
    };

    useEffect(() => {
        const boardGrid = document.querySelector('.board-grid');

        const dragStart = event => {
            event.target.classList.add('dragging');
            event.dataTransfer.setData('text/plain', event.target.id);
        };

        const dragOver = event => {
            event.preventDefault();
        };

        const dragDrop = event => {
            event.preventDefault();
            event.stopPropagation();

            const targetTile = event.target.closest('.tile');

            console.log(targetTile.className)

            if (targetTile && targetTile.className !== 'tile blank') {
                targetTile.appendChild(document.getElementById(event.dataTransfer.getData('text/plain')));
            }
        };

        boardGrid.addEventListener('dragstart', dragStart);
        boardGrid.addEventListener('dragover', dragOver);
        boardGrid.addEventListener('drop', dragDrop);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            boardGrid.removeEventListener('dragstart', dragStart);
            boardGrid.removeEventListener('dragover', dragOver);
            boardGrid.removeEventListener('drop', dragDrop);
        };
    }, []);

    for (let i = 0; i < totalTiles; i++) {
        if (tileInfo[i] === 'start') {
            // If the tile is a start tile, render start pieces
            tiles.push(
                <div key={i} className={`tile ${tileInfo[i]}`} tile-id={i}>
                    {renderStartPieces()}
                </div>
            );
        } else {
            // Otherwise, just render the tile
            tiles.push(<div key={i} className={`tile ${tileInfo[i]}`} tile-id={i}></div>);
        }
    }

    return (
        <div className='board-grid'>
            {tiles}
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
    }, []);

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
