// import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import {socket} from '../client'

const startPieces = ['lunar', 'world', 'safeline', 'jysk', 'domino', 'klaphatten'];
let selectedPawn = null;

const BoardGrid = ({steps, moveMade, setMoveMade, currentPosition, setCurrentPosition, currentPlayer, setCurrentPlayer, selectedPawn, setSelectedPawn}) => {
    const boardWidth = 15;
    const boardHeight = 9;
    const totalTiles = boardWidth * boardHeight;
    const [validTiles, setValidTiles] = useState([])

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

    const pawnPath = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29,
            44, 59, 74, 89, 104, 119, 134, 133, 132, 131, 130, 129,
            128, 127, 126, 125, 124, 123, 122, 121, 120, 105, 90, 75,
            60, 45, 30, 15],
        [7, 22, 37, 52, 67, 82, 97, 112, 127],
        [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
    ];

    const tiles = [];

    // Function to render start pieces
    const renderStartPieces = () => {
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`}/>
        ));
    };

    const calcValidTiles = (currentPosition, steps) => {
        const validTiles = [];

        for (let newPosition = 0; newPosition < totalTiles; newPosition++) {
            if (Math.abs(newPosition - currentPosition) === steps ||
                Math.abs(newPosition - currentPosition) === steps * boardWidth) {
                validTiles.push(newPosition);
            }
        }
        return validTiles;
    }

    const sendQuestionRequest = (color) => {
        socket.emit("send_question_request", { questionColor: color });
    };

    useEffect(() => {
        const boardGrid = document.querySelector('.board-grid');

        const handleCLick = event => {
            const targetTile = event.target.closest('.tile');
        if (startPieces.includes(event.target.id)){
            event.target.classList.add('highlight');
            selectedPawn = event.target;
        } else if (selectedPawn && event.target.className !== 'tile blank' && !moveMade) {
            const currentPosition = parseInt(selectedPawn.parentElement.getAttribute('tile-id'));
            const newPosition = parseInt(event.target.getAttribute('tile-id'));
            const validTiles = calcValidTiles(currentPosition, steps);

            if (validTiles.includes(newPosition)){
                event.target.appendChild(selectedPawn);
                const words = targetTile.className.split(' ');
                const color = words[words.length - 1];
                sendQuestionRequest(color)
                setMoveMade(true);

            }
        }
    }
        boardGrid.addEventListener('click', handleCLick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            boardGrid.removeEventListener('click', handleCLick);
        };
    }, [steps, moveMade, currentPosition]);

    for (let i = 0; i < totalTiles; i++) {
//    const CurrentPosition = 67;
        const validTiles = calcValidTiles(currentPosition, steps);
        let style = {};
        if(validTiles.includes(i)){
            style = {backgroundColor: 'yellow'};
        }
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


const DiceContainer = ({setSteps, setMoveMade}) => {
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
            setSteps(newDiceValue);
            setMoveMade(false);
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
    const [steps , setSteps] = useState(0);
    const [moveMade, setMoveMade] = useState(false);
    const [currentPosition, setCurrentPosition] = useState (0)
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [selectedPawn , setSelectedPawn] = useState(startPieces[currentPlayer])
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
            <BoardGrid steps={steps} moveMade={moveMade} setMoveMade= {setMoveMade}
                       currentPosition={currentPosition} setCurrentPosition={setCurrentPosition} />
            <DiceContainer setSteps={setSteps} setMoveMade= {setMoveMade} />
            <div className='questionpopup'>{question}</div>
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