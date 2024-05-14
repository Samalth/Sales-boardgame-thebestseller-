import { useNavigate } from 'react-router-dom';
import './startStyle.css';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';
import {useState} from "react";

export function HomeScreen() {
  const navigate = useNavigate();
  const [Language, setLanguage] = useState ('English');

  const handleCreateGame = () => {
      navigate('/configuration');
  };
  const handleJoinGame = () => {
    navigate('/joinGame')
  }

    function handleLanguage() {

    }

    return (
        <div className='wrapper'>
          <div className="row" id="data-container">
            <h1 className="yes">The Best Seller</h1>
            <input
              type="button"
              className="Qbutton"
              value="?"
            />
          </div>
          <div className="row">
            <input type="submit" className="button game" value="Join Game" onClick={handleJoinGame}/>
            <input type="submit" className="button game" value="Create Game" onClick={handleCreateGame}/>
          </div>
          <div className="row languages">
            <img className='flagImg' id='DEN' src={den_flag} alt='Danish' onClick={handleLanguage}/>
            <img className='flagImg' id='EN' src={uk_flag} alt='English' onClick={handleLanguage}/>
            <img className='flagImg' id='NL' src={nl_flag} alt='Dutch' onClick={handleLanguage}/>
          </div>
        </div>
    );
}