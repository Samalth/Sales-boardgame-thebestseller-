import { useNavigate } from 'react-router-dom';
import './startStyle.css';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';

export function HomeScreen() {
  const navigate = useNavigate();

  const handleCreateGame = () => {
      navigate('/configuration');
  };
  const handleJoinGame = () => {
    navigate('/joinGame')
  }
    return (
        <div>
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
            <img className='flagImg' src={den_flag} alt='Danish'/>
            <img className='flagImg' src={uk_flag} alt='English'/>
            <img className='flagImg' src={nl_flag} alt='Dutch'/>
          </div>
        </div>
    );
}