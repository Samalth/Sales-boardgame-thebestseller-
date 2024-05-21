import { useNavigate } from 'react-router-dom';
import './startStyle.css';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';
import {useTranslation} from "react-i18next";

export function HomeScreen() {
    const navigate = useNavigate();
    const {t,i18n} = useTranslation('global');

    const handleChangeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    const handleCreateGame = () => {
        navigate('/configuration');
    };

    const handleJoinGame = () => {
        navigate('/joinGame')
    }

    return (
        <div className='wrapper'>
            <div className="row" id="data-container">
                <h1 className="yes"> {t("HomeScreen.header")}</h1>
                <input
                    type="button"
                    className="Qbutton"
                    value="?"
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