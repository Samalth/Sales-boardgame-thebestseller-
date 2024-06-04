import React from 'react';
import { useNavigate } from 'react-router-dom';
import './startStyle.css';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';
import { useTranslation } from 'react-i18next';
import { useLanguageManager } from '../Translations/LanguageManager';

export function HomeScreen() {
    const navigate = useNavigate();
    const { t } = useTranslation('global');
    const { language, handleChangeLanguage, handleGuide } = useLanguageManager();

    const handleCreateGame = () => {
        navigate('/configuration');
    };

    const handleJoinGame = () => {
        navigate('/joinGame');
    };

    return (
        <div className='parent-container-home'>
            <div className="logoRow">
                <img className="logoGif" src='/Logo.gif' alt='Logo'/>
                <button className="Qbutton" onClick={handleGuide}>?</button>
            </div>
            <div className="homeButtonRow">
                <button type="submit" className="homeGameButton homeButtonLeft" onClick={handleJoinGame} > {t("HomeScreen.join")} </button>
                <button type="submit" className="homeGameButton homeButtonRight" onClick={handleCreateGame} > {t("HomeScreen.create")} </button>
            </div>
            <div className="languageRow">
                <img className='flagImg' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')} />
                <img className='flagImg' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')} />
                <img className='flagImg' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')} />
            </div>
        </div>
    );
}
