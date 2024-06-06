import { useNavigate } from 'react-router-dom';
import './gamepinStyle.css';
import {socket} from '../client'
import React, { useEffect, useState } from "react"
import back from "../Assets/back-button.png";
import {useTranslation} from "react-i18next";
import den_flag from "../Assets/den_flag.png";
import uk_flag from "../Assets/uk_flag.png";
import nl_flag from "../Assets/nl_flag.png";
import { useLanguageManager } from '../Translations/LanguageManager';

export function Gamepin() {
    const [gamepin, setGamepin] = useState('');
    const navigate = useNavigate();
    const [playerCount, setPlayerCount] = useState(0);
    const [playerNeeded, setPlayerNeeded] = useState(0);
    const [errorCode, setErrorCode] = useState('‎ ');
    const {t,i18n} = useTranslation('global');
    const { handleChangeLanguage, handleGuide } = useLanguageManager();

    useEffect(() => {
        socket.on("send_gamepin", (data) => {
            setGamepin(data.room);
            setPlayerNeeded(data.playerTotal);
        });
        socket.on('add_user', () => {
            setPlayerCount(prevCount => prevCount + 1);
        });
        socket.on("delete_user", () => {
            setPlayerCount(prevCount => prevCount - 1);
        })
        return () => {
            socket.off("send_gamepin");
            socket.off("add_user");
        };
    }, []);

    const handleGame = () => {
        if (playerCount <= playerNeeded) {
            socket.emit('start_turn', 'data')
            navigate('/modview');
        } else if (playerCount < playerNeeded) {
            setErrorCode('Not enough players')
        } else {
            setErrorCode('Too many players')
        }

    };

    const handleHome = () => {
        navigate('/home')
        socket.emit('delete_mod', 'data')
    }

    const handleBack = () => {
        navigate('/configuration')
        socket.emit('delete_mod', 'data')
    }

    const handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
    };

    const copygamepin = (event) => {
        event.target.select();
        document.execCommand('copy');
        // alert('copied gamepin');
    };

    return (
        <div className="parent-container-gamepin">
            <button className="Qbutton" onClick={handleGuide}>?</button>
            <button className='Home' type="button" onClick={handleBack}>
                <img src={back} alt='Home' className='home-image'/>
            </button>
            <div className="gamepinGamepin">
                <label className='gamepinLabel'>{t("GamePin.gamepin")}</label>
                <input type="text" className='gamepinGenerate' value={gamepin} onClick={copygamepin} readOnly
                       onChange={event => setGamepin(event.target.value)}/>
            </div>
            <div className="playersJoinedGamepin">
                <label className='gamepinLabel'>{t("GamePin.players")}</label>
                <input id="playerCount" name="playerCount" className="joinedPlayers" value={playerCount} readOnly
                       onChange={handlePlayerCountChange}/>
            </div>
            <div className="buttonGamePin">
                <button type="submit" className="gamePinButton" onClick={handleGame} > {t("GamePin.start")} </button>
            </div>
            <div className="errorGamepin">{errorCode}</div>
            <div className="languageRow">
                <img className='flagImg4' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')} />
                <img className='flagImg4' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')} />
                <img className='flagImg4' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')} />
            </div>
        </div>
);
}
