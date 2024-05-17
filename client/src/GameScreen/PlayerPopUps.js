import React from 'react';
import './PopUpStyle.css'

const PlayerPopUps = ({ gamePaused, gamePaused2, question, textBoxContent, handleTextBoxChange, handleSubmitAnswer, popupColor, color, setPopupColor }) => {
    return (
        <>
            {gamePaused && (
                <div className='questionBoxPopup'>
                    <div className={`questionColorBox ${popupColor}`}>
                        <div className='rowpopup'>
                            <img className={`${
                                color === 'red' ? 'piecesafeline' :
                                color === 'yellow' ? 'piecelunar' :
                                color === 'blue' ? 'piecedomino' : 
                                color === 'purple' ? 'pieceklaphatten' :
                                color === 'green' ? 'pieceworld' :
                                color === 'orange' ? 'piecejysk' : ''}`}
                                 alt="" />
                            <div className='strategyName'>
                                {color === 'yellow' ? 'Lunar':
                                 color === 'green' ? 'Top of the World' :
                                 color === 'blue' ? 'Domino House' :
                                 color === 'purple' ? 'Klaphatten' :
                                 color === 'red' ? 'Safeline' :
                                 color === 'orange' ? 'Jysk Telepartner' :
                                 'strategy'} </div>
                        </div>
                        <div className='questionLabel'> <br/> Question: </div>
                        <div className="questionWhiteBox">{question}</div>

                    </div>
                    <div className="answerPopup">
                        <div className='answerText'> Your answer: </div>
                        <textarea className={'answerInput'} value={textBoxContent} placeholder='Enter your answer here...' onChange={handleTextBoxChange} />
                        <button className={'submitButton'} onClick={handleSubmitAnswer}>Submit answer</button>
                    </div>
                </div>
            )}
            {gamePaused2 && (
                <div className='waitingScreenPopup'>
                    <div className='waitingScreenText'> Waiting for moderator to assign points ... </div>
                </div>
            )}
        </>
    );
};

export default PlayerPopUps;