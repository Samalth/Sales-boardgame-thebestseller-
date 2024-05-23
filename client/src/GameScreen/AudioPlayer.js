import {useEffect, useRef, useState} from "react";
import './Audio.css'
import musicOn from '../Assets/musicOn.png'
import musicOff from '../Assets/musicOff.png'

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2021/12/Melodic-ambient-electronic-music.mp3');
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
                <img
                    src={isPlaying ? musicOn : musicOff}
                    alt={isPlaying ? musicOn : musicOff}
                />
            </button>
        // </div>
    );
};

export default AudioPlayer;