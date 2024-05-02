import React from "react";
import './PopUpStyle.css'

const ModeratorPopUps = ({showPopup, question, submittedAnswer, selectedPoints, setShowPopup, handleSubmitPoints, handleUpdatePoints}) => {
    return (
        <>
            {showPopup && (
                <div className='scorePopup'>
                    <div className='questionStrategyBox'>
                        <div className='strategyName2'> Strategy <br/> Logo </div>
                        <div className='questionLabel2'> Question: </div>
                        <div className='questionWhiteBox2'> {question} </div>
                        <div className='answerLabel'> Player's answer: </div>
                        <div className='questionWhiteBox3'> {submittedAnswer} </div>
                    </div>
                    <div className='assignScoreBox'>
                        <div className='correctAnswerText'> Correct answer: </div>
                        <div className='correctAnswerBox'></div>
                        <div className='assignScoreText'> Assign score: </div>
                        <div className='scoreButtons'>
                            <button className={selectedPoints.includes(0) ? 'selected points' : 'points'} onClick={() => handleUpdatePoints(0)}> 0 </button>
                            <button className={selectedPoints.includes(5) ? 'selected points' : 'points'} onClick={() => handleUpdatePoints(5)}> 5 </button>
                            <button className={selectedPoints.includes(10) ? 'selected points' : 'points'} onClick={() => handleUpdatePoints(10)}> 10 </button>
                            <button className={selectedPoints.includes(15) ? 'selected points' : 'points'} onClick={() => handleUpdatePoints(15)}> 15 </button>
                            <button className={selectedPoints.includes(20) ? 'selected points' : 'points'} onClick={() => handleUpdatePoints(20)}> 20 </button>
                        </div>
                        <button className='submitScoreButton' onClick={() => { setShowPopup(false); handleSubmitPoints(); }}>Submit</button>
                    </div>
                </div>
            )}
        </>
    )
}
export default ModeratorPopUps;