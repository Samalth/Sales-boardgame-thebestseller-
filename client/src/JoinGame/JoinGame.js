import { useNavigate } from 'react-router-dom';
import './JoinScreenStyle.css';
import React, { useEffect, useState } from "react"
import {socket} from '../client'
import {useTranslation} from "react-i18next";
import home from "../Assets/back-button.png";

export function JoinGame() {
    const [gamepin, setGamepin] = useState("");
    const [username, setUsername] = useState("");
    const [strategy, setStrategy] = useState("");
    const [information, setInformation] = useState("‎ ");
    const navigate = useNavigate();
    const {t,i18n} = useTranslation('global');

    const setName = (username) => {
        if (!username) {
            setInformation("Please enter a name");
            return;
        }
        socket.emit("join_room", { name: username, room: gamepin, strategy: strategy});
    };

  useEffect(() =>{
    socket.on('join_succes', (data) => {
        if (data === 'available'){
            handleGame()
        } else {
            setInformation(data)
        }
    })
  })

  const handleGame = () => {
      navigate('/game');
  };

  const handleHome = () => {
    navigate('/home')
  }
    return (
        <div className="parent-container-joingame">
            <button className='Home' type="button" onClick={handleHome}>
                <img src={home} alt='Home' className='home-image'/>
            </button>

            <div className='errorJoingame'>{information}</div>

            <div className="gamepinJoingame">
                <label className='joingameLabel gamepinJoingameLabel'>{t("JoinGame.gamepin")}</label>
                <input type="text" className='inputJoingame gamepinJoingameInput' value={gamepin} placeholder={t("JoinGame.gamePlaceholder")}
                    onChange={event => setGamepin(event.target.value)}/>
            </div>

            <div className="strategyJoingame">
                <label className='joingameLabel strategyJoingameLabel' htmlFor="strategy">{t("JoinGame.strategy")}</label>
                <select className={`${
                    strategy === 'Lunar' ? 'dropyellow' :
                    strategy === 'Top of the World' ? 'dropgreen' :
                    strategy === 'Safeline' ? 'dropred' :
                    strategy === 'Jysk Telepartner' ? 'droporange' :
                    strategy === 'Domino House' ? 'dropblue' :
                    strategy === 'Klaphatten' ? 'droppurple' : ''} selectJoingame strategyJoingameSelect`}
                        name="strategy" id="strategy" onChange={event => setStrategy(event.target.value)}>
                    <option value="" hidden="hidden">{t("JoinGame.strategyPlaceholder")}</option>
                    <option className='dropyellow' value="Lunar">1. Lunar</option>
                    <option className='dropgreen' value="Top of the World">2. Top of the World</option>
                    <option className='dropred' value="Safeline">3. Safeline</option>
                    <option className='droporange' value="Jysk Telepartner">4. Jysk Telepartner</option>
                    <option className='dropblue' value="Domino House">5. Domino House</option>
                    <option className='droppurple' value="Klaphatten">6. Klaphatten</option>
                </select>
            </div>
            <div className="nameJoingame">
                <label className='joingameLabel nameJoingameLabel' htmlFor="fullName">{t("JoinGame.username")}</label>
                <input type="text" id="fullName" className='inputJoingame nameJoingameInput' name="fullName" value={username}
                    placeholder={t("JoinGame.namePlaceholder")} onChange={event => setUsername(event.target.value)}/>
            </div>
            <div className="buttonRowJoingame">
                <button type="submit" className="startgame button" onClick={() => setName(username, gamepin, strategy)}>{t("JoinGame.start")}</button>
            </div>
        </div>

    );
}