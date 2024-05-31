import React, {useEffect, useRef, useState} from "react";
import './Audio.css'
import musicOn from '../Assets/musicOn.png'
import musicOff from '../Assets/musicOff.png'
import { useLanguageManager } from '../Translations/LanguageManager';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { handleChangeLanguage, handleGuide } = useLanguageManager();

    useEffect(() => {
        audioRef.current = new Audio('https://cdn1.suno.ai/623df9ce-734e-4c6e-bae6-ba1e46034233.mp3');
        audioRef.current.onended = () => {
            setIsPlaying(false);
        };
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div>
            <button className="Qbutton2" onClick={handleGuide}>?</button>
            <button onClick={toggleAudio} className="audioButton">
                <img className="audioImage"
                    src={isPlaying ? musicOn : musicOff}
                    alt={isPlaying ? musicOn : musicOff}
                />
            </button>
            <div>
                <img className='flagImg5' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')} />
            </div>
            <div>
                <img className='flagImg5' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')} />
            </div>
            <div>
                <img className='flagImg5' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')} />
            </div>
        </div>


    );
};

export default AudioPlayer;