import React, { useState, useEffect } from 'react';
import '../PlayerScreen/GameStyle.css';
import '../App.css';
import {socket} from '../client'
import DiceContainer from '../GameScreen/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard";
import ModeratorPopUps from "../GameScreen/ModeratorPopUps";
import {useTranslation} from "react-i18next";


const BoardGrid = ({ moveMade, setMoveMade, setSelectedPawn, selectedPawn, setPosition }) => {
    const [validPositions, setValidPositions] = useState([]);
    const [startPieces, setStartPieces] = useState([]);
    const [updatedPieces, setUpdatedPieces] = useState(false);
    const [joinedColors, setJoinedColors] = useState([]);

    const tileInfo = [
        'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
        'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
        'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
        'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
        'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
        'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
        'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
        'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
        'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
    ];
    const tileInfo2 = [
        'sales','color1','color5','megatrends','rainbow','color4','chance', 'color2', 'color1', 'sales','rainbow', 'color3','megatrends','color4','color2',
        'color3','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
        'chance','blank','blank','blank','blank','blank', 'blank', 'color5', 'blank','blank','blank', 'blank', 'blank','blank','color5',
        'color5','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank','rainbow',
        'rainbow','sales','color2','chance', 'color1','megatrends', 'color4', 'start', 'rainbow', 'sales','color4', 'megatrends', 'color1','color3', 'sales',
        'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'color5',
        'color4','blank', 'blank', 'blank', 'blank','blank', 'blank', 'color3', 'blank', 'blank','blank','blank','blank','blank','color4',
        'color5', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
        'sales', 'rainbow', 'color5', 'chance', 'color2','color1', 'megatrends', 'rainbow', 'color5', 'sales','color2','color3', 'chance', 'rainbow', 'color5'
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
            socket.emit('get_pieces', 'mod')
            setUpdatedPieces(true);
        }
        return startPieces.map((piece, index) => (
            <div key={index} className={`startpieces piece${piece} ${selectedPawn && selectedPawn.id !== piece ? 'black-border-piece' : ''}`} id={`${piece}`}>
                {selectedPawn && selectedPawn.id === piece && <div className="gradient-background round-border"></div>}
            </div>
        ));
    };

    useEffect(() => {
        socket.on("update_valid_positions", (data) => {
            setValidPositions(data);
        });

        socket.on("add_piece", (data) => {
            let joinedColorsArray = [];
            const colorMap = {
                "world": "green",
                "lunar": "yellow",
                "domino": "blue",
                "jysk": "orange",
                "klaphatten": "purple",
                "safeline": "red"
            }
            joinedColorsArray = data.map(color => colorMap[color]);
            
            setStartPieces(data)
            setJoinedColors(joinedColorsArray);
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


    }, [moveMade, validPositions, selectedPawn, setMoveMade, setPosition, setSelectedPawn]);

    const totalTiles = tileInfo.length;

    for (let i = 0; i < totalTiles; i++) {
        const position = possiblePositions[i];
        const isHighlighted = validPositions.includes(position);
        let totalColors = joinedColors.length;
        let currentColor = joinedColors[0];
        let colorRanges = {
            0: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            1: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            2: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]],
            3: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],
            4: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]],
            5: [[1, 2, 3, 4, 5]],
            6: [[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]]
        }
        let currentTileInfo = (totalColors === 5) ? tileInfo2 : tileInfo;

        if (currentTileInfo[i].startsWith('color')) {
            let temp = parseInt(currentTileInfo[i].replace('color', ''));
            for (let range = 0; range < colorRanges[totalColors].length; range++) {
                if (colorRanges[totalColors][range].includes(temp)) {
                    currentColor = joinedColors[range];
                    break;
                }
            }
        } else {
            currentColor = currentTileInfo[i];
        }
        const tileClass = `tile ${currentColor} ${isHighlighted ? 'blink' : ''}`
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

export function ModView() {
    const { t, i18n } = useTranslation('global');
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [moveMade, setMoveMade] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [color, setColor] = useState('')
    const [userColor, setUserColor] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [selectedPawn , setSelectedPawn] = useState()
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState("8-5")
    const [submittedAnswer, setSubmittedAnswer] = useState(t("Game.modWait"))
    const [diceValue, setDiceValue] = useState(1);
    const [selectedPoints, setSelectedPoints] = useState(null);
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')

    useEffect(() =>{
        socket.on('rounds', (data) => {
            setTotalRounds(data.totalRounds)
            setCurrentRound(data.currentRound)
            setRoundText(`Round ${data.currentRound} of ${data.totalRounds}`)
        })
    })

    useEffect(() => {
        const numPlayers = sortedUserData.length;
        const heightScoreboard = 95 * numPlayers;
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
            socket.emit('get_current', 'mod')
        });
        return () => {
            socket.off('data_leaderboard');
        };
    }, []);

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
            setQuestion(data.questionText);
            setColor(data.color);
            setUserColor(data.userColor);
            setAnswer(data.answer);
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
            setSubmittedAnswer(data.text)
        });
        return () => {
            socket.off('submitted_answer');
        };
    })

    useEffect(() => {
        socket.on('set_current_player', (data) => {
            try {
                const pawn = document.querySelector('#' + data)
                setSelectedPawn(pawn)
            } catch (TypeError) {
                socket.emit('pawns_request_failed', '')
            }
        })
    },[]);

    const handleUpdatePoints = (points) => {
        setSelectedPoints(points);
    };

    const handleSubmitPoints = () => {
        if (submittedAnswer !== t("Game.modWait")) {
            setShowPopup(false)
            socket.emit("submit_points", { points: selectedPoints, color: userColor});
            setSubmittedAnswer(t("Game.modWait"));
            setSelectedPoints([]);
        }
    };

    return (
        <>
            <div className={showPopup ? 'appBlurred' : 'playboard'}>
                <div className='roundscounter'>{roundText}</div>
                <BoardGrid
                    moveMade={moveMade}
                    setMoveMade={setMoveMade}
                    setPosition={setPosition}
                    selectedPawn={selectedPawn}
                    setSelectedPawn={setSelectedPawn}/>
                <DiceContainer
                    setMoveMade={setMoveMade}
                    position={position}
                    diceValue={diceValue}
                    isModeratorScreen={true}/>
                <LeaderBoard
                    sortedUserData={sortedUserData}
                    playerName={playerName}/>
            </div>
                <ModeratorPopUps
                    answer={answer}
                    color={color}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    question={question}
                    submittedAnswer={submittedAnswer}
                    selectedPoints={selectedPoints}
                    handleSubmitPoints={handleSubmitPoints}
                    handleUpdatePoints={handleUpdatePoints}
                />
        </>
    );
}