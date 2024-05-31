import React, { useState, useEffect } from 'react';
import '../PlayerScreen/GameStyle.css';
import '../App.css';
import {socket} from '../client'
import DiceContainer from '../GameScreen/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard";
import ModeratorPopUps from "../GameScreen/ModeratorPopUps";
import BoardGrid from "../GameScreen/BoardGrid";
import {useTranslation} from "react-i18next";
import { useLanguageManager } from '../Translations/LanguageManager';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';

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
    const { handleChangeLanguage, handleGuide } = useLanguageManager();

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

    useEffect(() => {

        const socketHandlers = {
            'set_dice': (data) => {
                setDiceValue(data);
            },
            'rounds': (data) => {
                setTotalRounds(data.totalRounds)
                setCurrentRound(data.currentRound)
                setRoundText(t("Game.setRoundText", {data}))
            },
            'players_name': (data) => {
                setPlayerName(data)
            },
            'data_leaderboard': (jsonData) => {
                setData(jsonData)
                socket.emit('get_current','mod')
            },
            'set_current_player': (data)=> {
                try {
                    const pawn = document.querySelector('#' + data)
                    setSelectedPawn(pawn)
                } catch (TypeError) {
                    socket.emit('pawns_request_failed', '')
                }
            },
            'mod-pause': (data)=> {
                setShowPopup(true);
                setQuestion(data.questionText);
                setColor(data.color);
                setUserColor(data.userColor);
                setAnswer(data.answer);
            },
            'receive_answer': (data)=> {
                setAnswer(data);
            },
            'submitted_answer': (data)=> {
                setSubmittedAnswer(data.text)
            }
        }

        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })

        return () => {
            Object.keys(socketHandlers).forEach(event =>{
                socket.off(event, socketHandlers[event])
            })
        };
    }, []);


    return (
        <>
            <div className={showPopup ? 'appBlurred' : 'playboard'}>
                <button className="Qbutton2" onClick={handleGuide}>?</button>
                <div className='roundscounter'>{roundText}</div>
                <BoardGrid
                    moveMade={moveMade}
                    setMoveMade={setMoveMade}
                    setPosition={setPosition}
                    selectedPawn={selectedPawn}
                    setSelectedPawn={setSelectedPawn}
                    modView={true}/>
                <DiceContainer
                    setMoveMade={setMoveMade}
                    position={position}
                    diceValue={diceValue}
                    isModeratorScreen={true}/>
                <LeaderBoard
                    sortedUserData={sortedUserData}
                    playerName={playerName}/>
                <div><img className='flagImg6' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')} /></div>
                <div><img className='flagImg7' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')} /></div>
                <div> <img className='flagImg8' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')} /></div>
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