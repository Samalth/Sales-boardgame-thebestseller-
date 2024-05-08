import React, { useState, useEffect } from 'react';
import {socket} from '../client'
import './GameStyle.css';
import BoardGrid from "../GameScreen/BoardGrid";
import DiceContainer from '../GameScreen/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard";
import PlayerPopUps from "../GameScreen/PlayerPopUps";
import PlayerTurns from "../GameScreen/PlayerTurns";

export function Game() {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("")
    const [steps, setSteps] = useState(0)
    const [moveMade, setMoveMade] = useState(true)
    const [currentPlayer, setCurrentPlayer] = useState ('')
    const [color, setColor] = useState('')
    const [popupColor, setPopupColor] = useState('')
    const [myTurn, setMyTurn] = useState(false)
    const [selectedPawn , setSelectedPawn] = useState(<div></div>)
    const [position, setPosition] = useState("8-5")
    const [gamePaused, setGamePaused] = useState(false)
    const [gamePaused2, setGamePaused2] = useState(false)
    const [textBoxContent, setTextBoxContent] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [turnText, setTurnText] = useState('Waiting for moderator to start game')
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')


    const handleTextBoxChange = (event) => {
        setTextBoxContent(event.target.value);
    };

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
            setTurnText(`It's ${data}'s turn to roll the dice and answer the question`)
        })
        socket.on('data_leaderboard', (jsonData) => {
            setData(jsonData);
        });
        return () => {
            socket.off('data_leaderboard');
        };
    }, []);

    useEffect(() => {
        socket.on("receive_question", (data) => {
            setPopupColor(data.color)
            setQuestion(data.questionText);
            setGamePaused(true);
        });
        return () => {
            socket.off('receive_question');
        };
    }, []);

    const handleSubmitAnswer = () => {
        setGamePaused(false);
        socket.emit('send_textbox_content', {text: textBoxContent, color: color})
        setTextBoxContent('')
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
                console.log(pawn)
                const parent = pawn.parentElement
                const parentPosition = parent.getAttribute('pos')
                setPosition(parentPosition)
                setSelectedPawn(pawn)
                if (currentPlayer === data) {
                    setMyTurn(true)
                    setMoveMade(false)
                } else {
                    setMyTurn(false)
                    setMoveMade(true)
                }
                socket.emit('get_data', 'leaderboard_update');
            } catch (TypeError) {
                socket.emit('pawns_request_failed', '')
            }
        })
    },[currentPlayer]);

    return (
    <>
        <div className={gamePaused || gamePaused2 ? 'playboard blurred' : 'playboard'}>
            <div className='roundscounter'>{roundText}</div>
            <BoardGrid
                steps={steps}
                moveMade={moveMade}
                setMoveMade={setMoveMade}
                selectedPawn={selectedPawn}
                setSelectedPawn={setSelectedPawn}
                setPosition={setPosition}
                setCurrentPlayer={setCurrentPlayer}
                currentPlayer={currentPlayer}
                color={color}
                setColor={setColor}/>
            <DiceContainer
                setSteps={setSteps}
                setMoveMade={setMoveMade}
                position={position}
                myTurn={myTurn}
                setMyTurn={setMyTurn}/>
            <LeaderBoard
                sortedUserData={sortedUserData}
                playerName={playerName}/>
            <PlayerTurns
                turnText={turnText}/>
            </div>
            <PlayerPopUps
                color={color}
                popUpColor={popupColor}
                gamePaused={gamePaused}
                gamePaused2={gamePaused2}
                question={question}
                textBoxContent={textBoxContent}
                handleTextBoxChange={handleTextBoxChange}
                handleSubmitAnswer={handleSubmitAnswer}
            />
        </>
    )
}

