// import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import {socket} from '../client'



const BoardGrid = () => {
    const boardWidth = 15;
    const boardHeight = 9;
    const totalTiles = boardWidth * boardHeight;

    const tileInfo = [
        'sales','yellow','red','megatrends','rainbow','blue','chance', 'purple', 'yellow', 'sales','rainbow', 'green','megatrends','blue','purple',
        'green','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
        'chance','blank','blank','blank','blank','blank', 'blank', 'red', 'blank','blank','blank', 'blank', 'blank','blank','orange',
        'orange','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'rainbow',
        'rainbow','sales','purple','chance', 'yellow','megatrends', 'blue', 'start', 'rainbow', 'sales','blue', 'megatrends', 'yellow','green', 'sales',
        'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'red',
        'blue','blank', 'blank', 'blank', 'blank','blank', 'blank', 'green', 'blank', 'blank','blank','blank','blank','blank','blue',
        'red', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
        'sales', 'rainbow', 'orange', 'chance', 'purple','yellow', 'megatrends', 'rainbow', 'red', 'sales','purple','green', 'chance', 'rainbow', 'orange'
    ];

    const tiles = [];

    // Function to render start pieces
    const renderStartPieces = () => {
        const startPieces = ['lunar', 'world'];
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`} draggable={true}/>
        ));
    };

    const sendQuestionRequest = (color) => {
        socket.emit("send_question_request", { questionColor: color });
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

                const words = targetTile.className.split(' ');
                const color = words[words.length - 1];
                sendQuestionRequest(color)
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

// end board


const DiceContainer = () => {
    const [diceValue, setDiceValue] = useState(1);
    
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
            // console.log(newDiceValue)
        }, 1000);
    };

    return (
        <div className="dice-container">
            <div className="dice-wrapper">
                <img className="diceImage" src={`../Dia${diceValue}.JPG`} alt='#die-1' />
            </div>
            <button type='button' onClick={roll}>Roll the dice</button>
        </div>
    );
};

export function PlayBoard() {
    const [question, setQuestion] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        socket.on("receive_question", (data) => {
            setQuestion(data);
        });
        return () => {
            socket.off('receive_question');
        };
    }, []);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleUpdatePoints = (buttonPoints) => {
        // Call the updateDataInFile function to update points for Samuel
        console.log(buttonPoints);
        socket.emit("send_points",{points: buttonPoints})
        console.log("Log1");
       // updateDataInFile(filePath, newData);
    };

    return (
        <>
            <BoardGrid />
            <DiceContainer />
            <div>{question}</div>
            <button onClick={togglePopup}>Open Popup</button>
            {/* Popup container */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div className="button-container">
                            {/* Linking the updateDataInFile function to the button */}
                            <button className="button button-primary" onClick={() =>handleUpdatePoints(5)}>5 points</button>
                            <button className="button button-secondary" onClick={() =>handleUpdatePoints(10)}>10 points</button>
                            <button className="button button-derde" onClick={() =>handleUpdatePoints(15)}>15 points</button>
                            <button className="button button-secondary" onClick={() =>handleUpdatePoints(20)}>20 points</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};