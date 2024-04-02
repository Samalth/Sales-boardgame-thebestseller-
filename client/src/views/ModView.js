// import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import {socket} from '../client'

const startPieces = ['lunar', 'world', 'safeline', 'jysk', 'domino', 'klaphatten'];
let selectedPawn = null;

const BoardGrid = ({ moveMade, setMoveMade, setSelectedPawn, selectedPawn, setPosition }) => {
    const boardWidth = 15;
    const boardHeight = 9;
    const totalTiles = boardWidth * boardHeight;
    const [validPositions, setValidPositions] = useState([]);

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
    const possiblePositions = [
        "1-9", "2-9", "3-9", "4-9", "5-9", "6-9", "7-9", "8-9", "9-9", "10-9", "11-9", "12-9", "13-9", "14-9", "15-9",
        "1-8", "", "", "", "", "", "", "8-8", "", "", "", "", "", "", "15-8",
        "1-7", "", "", "", "", "", "", "8-7", "", "", "", "", "", "", "15-7",
        "1-6", "", "", "", "", "", "", "8-6", "", "", "", "", "", "", "15-6",
        "1-5", "2-5", "3-5", "4-5", "5-5", "6-5", "7-5", "8-5", "9-5", "10-5", "11-5", "12-5", "13-5", "14-5", "15-5",
        "1-4", "", "", "", "", "", "", "8-4", "", "", "", "", "", "", "15-4",
        "1-3", "", "", "", "", "", "", "8-3", "", "", "", "", "", "", "15-3",
        "1-2", "", "", "", "", "", "", "8-2", "", "", "", "", "", "", "15-2",
        "1-1", "2-1", "3-1", "4-1", "5-1", "6-1", "7-1", "8-1", "9-1", "10-1", "11-1", "12-1", "13-1", "14-1", "15-1",
    ];

    const tiles = [];

    // Function to render start pieces
    const renderStartPieces = () => {
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`}/>
        ));
    };

    const sendQuestionRequest = (color) => {
        socket.emit("send_question_request", { questionColor: color });
    };

    const sendAnswerRequest = (color) => {
        socket.emit("send_answer_request", { answerColor: color });
    };

    useEffect(() => {
        socket.on("update_valid_positions", (data) => {
            setValidPositions(data);
        });

        const boardGrid = document.querySelector('.board-grid');

        const handleClick = event => {
            const targetTile = event.target.closest('.tile');
            console.log(targetTile)
            if (startPieces.includes(event.target.id)) {
                event.target.classList.add('highlight');
                setSelectedPawn(event.target);
            } else if (targetTile && validPositions.includes(targetTile.getAttribute('pos'))) {
                const newPosition = targetTile.getAttribute('pos');

                if (validPositions.includes(newPosition) && !moveMade) {
                    // Append the pawn to the new tile and update game state as necessary
                    event.target.appendChild(selectedPawn);

                    const color = targetTile.className.split(' ')[1];
                    sendQuestionRequest(color);
                    sendAnswerRequest(color);
                    setMoveMade(true);
                    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
                    // Update the pawn's position in your state
                    setPosition(newPosition); // Assuming setPosition updates the pawn's position state
                }
            }
        };
        boardGrid.addEventListener('click', handleClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            boardGrid.removeEventListener('click', handleClick);
        };
    }, [moveMade, validPositions, selectedPawn, setMoveMade, setPosition, setSelectedPawn]);

    for (let i = 0; i < totalTiles; i++) {
        const position = possiblePositions[i];
        const isHighlighted = validPositions.includes(position);
        const tileClass = `tile ${tileInfo[i]} ${isHighlighted ? 'blink' : ''}`
        if (tileInfo[i] === 'start') {
            // If the tile is a start tile, render start pieces
            tiles.push(
                <div key={i} className={tileClass} tile-id={i} pos={position}>
                    {renderStartPieces()}
                </div>
            );
        } else {
            // Otherwise, just render the tile
            tiles.push(<div key={i} className={tileClass} tile-id={i} pos={position}></div>);
        }
    }

    return (
        <div className='board-grid'>
            {tiles}
        </div>
    );
};

// end board


const DiceContainer = ({setSteps, setMoveMade, position}) => {
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
            socket.emit("send_dice_roll_and_position", { diceValue: newDiceValue, position: position });
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

export function ModView() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [moveMade, setMoveMade] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [selectedPawn , setSelectedPawn] = useState(startPieces[currentPlayer])
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState("8-5")
    const [submittedAnswer, setSubmittedAnswer] = useState('')

    useEffect(() => {
        socket.on("receive_question", (data) => {
            setQuestion(data);
        });
        return () => {
            socket.off('receive_question');
        };
    }, []);

    useEffect(() => {
        socket.on("receive_answer", (data) => {
            setAnswer(data);
        });
        return () => {
            socket.off('receive_answer');
        };
    }, []);
    useEffect(() => {
        socket.on("submitted_answer", (data) => {
            setSubmittedAnswer(data)
            console.log(data)
            console.log(submittedAnswer)
        });
        return () => {
            socket.off('submitted_answer');
        };
    })


    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleUpdatePoints = (buttonPoints) => {
        console.log(buttonPoints);
        socket.emit("send_points",{points: buttonPoints})
    };

    return (
        <>
            <BoardGrid moveMade={moveMade} setMoveMade= {setMoveMade}
                       setPosition={setPosition} selectedPawn={selectedPawn} setSelectedPawn={setSelectedPawn}/>
            <DiceContainer setMoveMade= {setMoveMade} position={position}/>

            <button onClick={togglePopup}>Points</button>
            {/* Popup container */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div className='questionpopup'>{question}</div>
                        <div className='answerpopup'>
                            <div className={''}>{submittedAnswer}</div>
                    </div>
                    <div className="button-container">
                            {/* Linking the updateDataInFile function to the button */}
                            <button className="button button-primary" onClick={() =>handleUpdatePoints(5)}>5 points</button>
                            <button className="button button-secondary" onClick={() =>handleUpdatePoints(10)}>10 points</button>
                            <button className="button button-derde" onClick={() =>handleUpdatePoints(15)}>15 points</button>
                            <button className="button button-secondary" onClick={() =>handleUpdatePoints(20)}>20 points</button>
                            <button className="button-submit"> Submit </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}