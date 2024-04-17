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

    useEffect(() => {
        socket.on("update_valid_positions", (data) => {
            setValidPositions(data);
        });

        socket.on("update_position", (data) => {
            const newPosition = data.newPosition;
            const selectedPawnName = data.selectedPawn;
            const selectedPawnElement = document.getElementById(selectedPawnName);

            if (selectedPawnElement && validPositions.includes(newPosition)) {
                const newTile = document.querySelector(`.tile[pos="${newPosition}"]`);
                newTile.appendChild(selectedPawnElement);
                setPosition(newPosition);
                document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
            }
        });

        const boardGrid = document.querySelector('.board-grid');

    }, [moveMade, validPositions, selectedPawn, setMoveMade, setPosition, setSelectedPawn]);

    for (let i = 0; i < totalTiles; i++) {
        const position = possiblePositions[i];
        const isHighlighted = validPositions.includes(position);
        const tileClass = `tile ${tileInfo[i]} ${isHighlighted ? 'blink' : ''}`
        if (tileInfo[i] === 'start') {
            tiles.push(
                <div key={i} className={tileClass} tile-id={i} pos={position}>
                    {renderStartPieces()}
                </div>
            );
        } else {
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

const DiceContainer = ({ setSteps, setMoveMade, position }) => {
    const [diceValue, setDiceValue] = useState(1);

    useEffect(() => {
        socket.on("set_dice", (data) => {
            const images = ["../Dia1.JPG", "../Dia2.JPG", "../Dia3.JPG", "../Dia4.JPG", "../Dia5.JPG", "../Dia6.JPG"];
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
        <div className='dice-container'>
            <div className='dice-wrapper'>
                <img className='diceImage' src={`../Dia${diceValue}.JPG`} alt='#die-1' />
            </div>
            <div className='turnsModView'> ... is rolling the dice </div>
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
    const [diceValue, setDiceValue] = useState(1);

    useEffect(() => {
        socket.on("set_dice", (data) => {
            setDiceValue(data);
        });
        return () => {
            socket.off('set_dice');
        };
    }, []);

    useEffect(() => {
        socket.on("mod-pause", (data) => {
            setShowPopup(true);
            setQuestion(data);
        });
        return () => {
            socket.off('mod-pause');
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

    const handleUpdatePoints = (buttonPoints) => {
        console.log(buttonPoints);
        socket.emit("send_points",{points: buttonPoints})
    };

    return (
        <>
        <div className={showPopup ? 'playboard blurred' : 'playboard'}>
            <BoardGrid moveMade={moveMade} setMoveMade= {setMoveMade}
                       setPosition={setPosition} selectedPawn={selectedPawn} setSelectedPawn={setSelectedPawn}/>
            <DiceContainer setMoveMade= {setMoveMade} position={position} diceValue={diceValue}/>
        </div>
            {showPopup && (
                <div className='scorePopup'>
                    <div className='questionStrategyBox'>
                        <div className='strategyName2'> Strategy <br/> Logo </div>
                        <div className='questionLabel2'> Question: </div>
                        <div className='questionWhiteBox2'> {question} </div>
                        <div className='answerLabel'> Player's answer: </div>
                        <div className='questionWhiteBox3'> {submittedAnswer} </div>
                    </div>
                    <div className='assignScoreBox'>
                        <div className='correctAnswerText'> Correct answer: </div>
                        <div className='correctAnswerBox'></div>
                        <div className='assignScoreText'> Assign score: </div>
                        <div className='scoreButtons'>
                            {/* Linking the updateDataInFile function to the button */}
                            <button className='points' onClick={() =>handleUpdatePoints(0)}> 0 </button>
                            <button className='points' onClick={() =>handleUpdatePoints(5)}> 5 </button>
                            <button className='points' onClick={() =>handleUpdatePoints(10)}> 10 </button>
                            <button className='points' onClick={() =>handleUpdatePoints(15)}> 15 </button>
                            <button className='points' onClick={() =>handleUpdatePoints(20)}> 20 </button>
                        </div>
                        <button className='submitScoreButton' onClick={()=>{setShowPopup(false)}} > Submit </button>
                    </div>
                </div>
            )}
        </>
    );
}