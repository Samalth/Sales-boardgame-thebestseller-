import React from 'react';

const PlayerPopUps = ({ gamePaused, gamePaused2, question, textBoxContent, handleTextBoxChange, handleSubmitAnswer }) => {
    return (
        <>
            {gamePaused && (
                <div className='questionBoxPopup'>
                    <div className="questionOrangeBox">
                        <div className='strategyName'>Strategy <br /> Logo </div>
                        <div className='questionLabel'> <br /> Question: </div>
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