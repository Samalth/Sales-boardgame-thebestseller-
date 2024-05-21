import { useNavigate } from 'react-router-dom';
import './JoinScreenStyle.css';
import { useEffect, useState } from "react"
import {socket} from '../client'
import {useTranslation} from "react-i18next";

export function JoinGame() {
    const [gamepin, setGamepin] = useState("");
    const [username, setUsername] = useState("");
    const [strategy, setStrategy] = useState("");
    const [information, setInformation] = useState("");
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
        <div className="parent-container">
        <div className='joinscreen-row error'>{information}</div>
        <div className="joinscreen-row gamepin">
            <label>{t("JoinGame.gamepin")}</label>
            <input type="text" className='input' value={gamepin} placeholder={t("JoinGame.gamePlaceholder")} onChange={event => setGamepin(event.target.value)}/>
        </div>
        <div className="joinscreen-row strategy">
            <label htmlFor="strategy">{t("JoinGame.strategy")}</label>
            <select className={`${
                strategy === 'Lunar' ? 'dropyellow' :
                strategy === 'Top of the World' ? 'dropgreen' :
                strategy === 'Safeline' ? 'dropred' :
                strategy === 'Jysk Telepartner' ? 'droporange' :
                strategy === 'Domino House' ? 'dropblue' :
                strategy === 'Klaphatten' ? 'droppurple' : ''}`}
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
        <div className="joinscreen-row name">
            <label htmlFor="fullName">{t("JoinGame.username")}</label>
            <input type="text" id="fullName" className='input' name="fullName" value={username} placeholder={t("JoinGame.namePlaceholder")} onChange={event => setUsername(event.target.value)}/>
        </div>
        <div className="joinscreen-row">
            <input type="submit" className="startgame button" value={t("JoinGame.start")} onClick={() => setName(username, gamepin, strategy)}/>
            <input type="submit" className="back button" value={t("JoinGame.home")} onClick={handleHome}/>
        </div>
    </div>
    );
}