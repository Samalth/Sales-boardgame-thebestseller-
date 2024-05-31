import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './settings.css';
import './backButton.css'
import home from '../Assets/back-button.png'
import {socket} from '../client'
import {useTranslation} from "react-i18next";

export function ModSettings() {
  const [playerCount, setPlayerCount] = useState(6);
  const [roundsCount, setRoundsCount] = useState(5);
  const navigate = useNavigate();
  const {t,i18n} = useTranslation('global');

  const createRoom = () => {
    socket.emit("create_room", { playerCount, roundsCount });
  }
  const handleGame = () => {
    navigate('/Gamepin');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handlePlayerCountChange = (event) => {
    setPlayerCount(parseInt(event.target.value));
  };

  const handleRoundsCountChange = (event) => {
    setRoundsCount(parseInt(event.target.value));
  };

  const decrementPlayerCount = () => {
    if (playerCount > 2) {
      setPlayerCount(playerCount - 1);
    }
  };

  const incrementPlayerCount = () => {
    if (playerCount < 6) {
      setPlayerCount(playerCount + 1);
    }
  };

  const decrementRoundsCount = () => {
    if (roundsCount > 3) {
      setRoundsCount(roundsCount - 1);
    }
  };

  const incrementRoundsCount = () => {
    if (roundsCount < 30) {
      setRoundsCount(roundsCount + 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    createRoom()
    handleGame()
  };

  return (
      <div className="parent-container-settings">
        <form className='form-container-settings' onSubmit={handleSubmit}>
          <button className='Home' type="button" onClick={handleHome}>
            <img src={home} alt='Home' className='home-image'/>
          </button>

          <div className="playerRowSettings">
            <div className="settings text">{t("ModSettings.players")}</div>
            <div className="player minus" onClick={decrementPlayerCount}>-</div>
            <input id="playerCount" name="playerCount" className="player count" value={playerCount} onChange={handlePlayerCountChange}/>
            <div className="player plus" onClick={incrementPlayerCount}>+</div>
          </div>

          <div className="roundsRowSettings">
            <div className="settings text">{t("ModSettings.rounds")}</div>
            <div className="rounds minus" onClick={decrementRoundsCount}>-</div>
            <input id="roundsCount" name="roundsCount" className="rounds count" value={roundsCount}
                  onChange={handleRoundsCountChange}/>
            <div className="rounds plus" onClick={incrementRoundsCount}>+</div>
          </div>

          <div className="buttonRowSettings">
            <button type="submit" className="continueButton continueSettings" > {t("ModSettings.continue")} </button>
          </div>

        </form>
      </div>
  );
}