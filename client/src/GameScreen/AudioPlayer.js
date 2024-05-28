import {useEffect, useRef, useState} from "react";
import './Audio.css'
import musicOn from '../Assets/musicOn.png'
import musicOff from '../Assets/musicOff.png'

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
            <button onClick={toggleAudio} className="audioButton">
                <img className="audioImage"
                    src={isPlaying ? musicOn : musicOff}
                    alt={isPlaying ? musicOn : musicOff}
                />
            </button>
        // </div>
    );
};

export default AudioPlayer;