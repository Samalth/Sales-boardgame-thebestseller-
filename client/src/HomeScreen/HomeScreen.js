import { useNavigate } from 'react-router-dom';
import './startStyle.css';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';
import {useTranslation} from "react-i18next";
import {useState} from "react";

export function HomeScreen() {
    const navigate = useNavigate();
    const {t,i18n} = useTranslation('global');
    const [language, setLanguage] = useState('en')

    const handleChangeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    }

    const handleCreateGame = () => {
        navigate('/configuration');
    };

    const handleJoinGame = () => {
        navigate('/joinGame')
    }

    const handleGuide = () => {
        const guideMapping = {
            en: '/GuideEN.pdf',
            nl: '/GuideNL.pdf',
            dk: '/GuideDK.pdf',
        }
        const pdfPath = guideMapping [language]
        window.open(pdfPath, '_blank')
    }

    return (
        <div className='wrapper'>
            <div className="row" id="data-container">
                <img className="logoGif" src='/Logo.gif' alt='Logo'/>
                <input
                    type="button"
                    className="Qbutton"
                    value="?"
                    onClick={handleGuide}
                />
            </div>
            <div className="row">
                <input type="submit" className="button game" value={t("HomeScreen.join")} onClick={handleJoinGame}/>
                <input type="submit" className="button game" value={t("HomeScreen.create")} onClick={handleCreateGame}/>
            </div>
            <div className="row languages">
                <img className='flagImg' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')}/>
                <img className='flagImg' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')}/>
                <img className='flagImg' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')}/>
            </div>
        </div>
    );
}