import React, { useState, useEffect } from 'react';
import '../CSS/playboardStyle.css';
import {socket} from '../client'

let selectedPawn = null;

const BoardGrid = ({ moveMade, setMoveMade, setSelectedPawn, selectedPawn, setPosition }) => {
    const boardWidth = 15;
    const boardHeight = 9;
    const totalTiles = boardWidth * boardHeight;
    const [startPieces, setStartPieces] = useState([]);
    const [validPositions, setValidPositions] = useState([]);
    const [updatedPieces, setUpdatedPieces] = useState(false);

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

    const renderStartPieces = () => {
        if (!updatedPieces){
            socket.emit('get_pieces', 'player')
            socket.emit('get_data', 'leaderboard_update');
            setUpdatedPieces(true);
        }
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece}`} id={`${piece}`}/>
        ));
    };

    const sendQuestionRequest = (color) => {
        socket.emit("send_question_request", { questionColor: color });
    };

    useEffect(() => {
        socket.on("update_valid_positions", (data) => {
            setValidPositions(data);
        });
        socket.on("add_piece", (data) => {
            setStartPieces(data)
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

        const handleClick = event => {
            const targetTile = event.target.closest('.tile');
            console.log(targetTile)
            if (startPieces.includes(event.target.id)) {
                event.target.classList.add('highlight');
                // setSelectedPawn(event.target);
                console.log(event.target)
            } else if (targetTile && validPositions.includes(targetTile.getAttribute('pos'))) {
                const newPosition = targetTile.getAttribute('pos');
                if (validPositions.includes(newPosition) && !moveMade) {
                    if (selectedPawn instanceof HTMLElement) {
                    event.target.appendChild(selectedPawn);
                    const color = targetTile.className.split(' ')[1];
                    sendQuestionRequest(color);
                    setMoveMade(true);
                    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'));
                    // setPosition(newPosition);
                    socket.emit("update_position", {newPosition: newPosition, selectedPawn: selectedPawn.id});
                    } else {
                        console.error("Selected pawn is not a valid DOM element");
                    }
                }
            }
        };
        boardGrid.addEventListener('click', handleClick);
        return () => {
            boardGrid.removeEventListener('click', handleClick);
        };
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

const DiceContainer = ({setSteps, setMoveMade, position}) => {
    const [diceValue, setDiceValue] = useState(1);
    const roll = () => {
        socket.emit("roll_dice")
    };

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
        <div className="dice-container">
            <div className="dice-wrapper">
                <img className="diceImage" src={`../Dia${diceValue}.JPG`} alt='#die-1' />
            </div>
            <button type='button' onClick={roll}>Roll the dice</button>
        </div>
    );
}

export function PlayBoard() {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("")
    const [steps, setSteps] = useState(0)
    const [moveMade, setMoveMade] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [selectedPawn , setSelectedPawn] = useState(<div></div>)
    const [position, setPosition] = useState("8-5")
    const [gamePaused, setGamePaused] = useState(false)
    const [gamePaused2, setGamePaused2] = useState(false)
    const [textBoxContent, setTextBoxContent] = useState('')
    const [playerName, setPlayerName] = useState('')
    const handleTextBoxChange = (event) => {
        setTextBoxContent(event.target.value);
    };

    useEffect(() => {
        const numPlayers = sortedUserData.length;
        const heightScoreboard = 105 * numPlayers;
        // Set the height of the leaderboard container
        const leaderboardContainer = document.querySelector('.leaderBoard');
        if (leaderboardContainer) {
            leaderboardContainer.style.height = `${heightScoreboard}px`;
        }
    }, [sortedUserData]);

    useEffect(() => {
        socket.on('players_name', (data) => {
            setPlayerName(data)
        })
        socket.on('data_leaderboard', (jsonData) => {
            setData(jsonData);
            console.log(jsonData)
        });
        return () => {
            socket.off('data_leaderboard');
        };
    }, []);

    useEffect(() => {
        socket.on("receive_question", (data) => {
            setQuestion(data);
            setGamePaused(true);
        });
        return () => {
            socket.off('receive_question');
        };
    }, []);

    const handleSubmitAnswer = () => {
        setGamePaused(false);
        socket.emit('send_textbox_content', textBoxContent)
        setGamePaused2(true)
    };

    useEffect(() => {
        socket.on("submitted_points", (data) => {
           setGamePaused2(false)
        });
        return () => {
            socket.off('submitted_points');
        };
    }, []);

    useEffect(() => {
        socket.on('players_turn', (data) => {
            try {
                const pawn = document.querySelector('#' + data)
                const parent = pawn.parentElement
                const parentPosition = parent.getAttribute('pos')
                setPosition(parentPosition)
                setSelectedPawn(pawn)
                socket.emit('get_data', 'leaderboard_update');
            } catch (TypeError) {
                socket.emit('pawns_request_failed', '')
            }
        })
    },[]);

    return (
    <>
        <div className={gamePaused || gamePaused2 ? 'playboard blurred' : 'playboard'}>
                <BoardGrid
                    steps={steps}
                    moveMade={moveMade}
                    setMoveMade={setMoveMade}
                    selectedPawn={selectedPawn}
                    setSelectedPawn={setSelectedPawn}
                    setPosition={setPosition}/>
                <DiceContainer
                    setSteps={setSteps}
                    setMoveMade={setMoveMade}
                    position={position}></DiceContainer>
        <div className='leaderBoard'>
            <h2>Leaderboard</h2>
            {sortedUserData.map(data => {
                return (
                    <div className="leaderboardItem" key={data.id}>
                        <img className={data.strategy === 'Safeline' ? 'piecesafeline' :
                            data.strategy === 'Lunar' ? 'piecelunar' :
                                data.strategy === 'Domino House' ? 'piecedomino' :
                                    data.strategy === 'Klaphatten' ? 'pieceklaphatten' :
                                        data.strategy === 'Top of the World' ? 'pieceworld' :
                                            data.strategy === 'Jysk Telepartner' ? 'piecejysk' : "../Dia1.JPG"} alt=""
                        />
                        <div>{data.name}</div>
                        <div className="pointsLeaderboard"> {data.points} </div>
                    </div>
                )
            })}
        </div>
            <div className='playerTurn'> {playerName} is rolling the dice </div>
        </div>
            {gamePaused && (
                <div className='questionBoxPopup'>
                    <div className="questionOrangeBox">
                        <div className='strategyName'>Strategie <br/> Logo </div>
                        <div className='questionLabel'> <br/> Question: </div>
                        <div className="questionWhiteBox">{question}</div>
                    </div>
                    <div className="answerPopup">
                        <div className='answerText'> Your answer: </div>
                        <textarea className={'answerInput'} value={textBoxContent} placeholder='Enter your answer here...' onChange={handleTextBoxChange} />
                        <button className={'submitButton'} onClick={handleSubmitAnswer}>Submit answer</button>
                    </div>
                </div>
                )}
        {gamePaused2 && (
            <div className='waitingScreenPopup'>
                <div className='waitingScreenText'> Waiting for moderator to assign points ... </div>
            </div>
        )}
        </>
    )
}

