import React from "react";
import './PopUpStyle.css'
import {useTranslation} from "react-i18next";

const ModeratorPopUps = ({ setShowPopup, showPopup, question, submittedAnswer, selectedPoints, handleSubmitPoints, handleUpdatePoints, answer, color}) => {

    const { t, i18n } = useTranslation('global');

    return (
        <>
            {showPopup && (
                <div className='scorePopup'>
                    <div className={`questionColorBox ${color}`}>
                        <div className='rowpopup'>
                            <img className={`${
                                color === 'red' ? 'piecesafeline' :
                                color === 'yellow' ? 'piecelunar' :
                                color === 'blue' ? 'piecedomino' :
                                color === 'purple' ? 'pieceklaphatten' :
                                color === 'green' ? 'pieceworld' :
                                color === 'orange' ? 'piecejysk' : 
                                color === 'black1'? 'chance' :
                                color === 'black2'? 'sales' :
                                color === 'black3'? 'megatrends' : ''}`}
                                 alt="" />
                            <div className='strategyName2'>
                                {color === 'yellow' ? 'Lunar':
                                 color === 'green' ? 'Top of the World' :
                                 color === 'blue' ? 'Domino House' :
                                 color === 'purple' ? 'Klaphatten' :
                                 color === 'red' ? 'Safeline' :
                                 color === 'orange' ? 'Jysk Telepartner' :
                                 color === 'black1' ? 'Chance':
                                 color === 'black2' ? 'Sales' :
                                 color === 'black3' ? 'Megatrends' :
                                'strategy'}</div>
                        </div>
                        <div className='questionLabel2'> {t("PopUps.question")}</div>
                        <div className='questionWhiteBox2'> {question} </div>
                        <div className='answerLabel'> {t("PopUps.modAnswer")} </div>
                        <div className='questionWhiteBox3'> {submittedAnswer} </div>
                    </div>
                    <div className='assignScoreBox'>
                        <div className='correctAnswerText'> {t("PopUps.correct")} </div>
                        <div className='correctAnswerBox'>{answer}</div>
                        <div className='assignScoreText'> {t("PopUps.assign")} </div>
                        <div className='scoreButtons'>
                            <button className={selectedPoints === 0 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(0)}> 0
                            </button>
                            <button className={selectedPoints === 5 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(5)}> 5
                            </button>
                            <button className={selectedPoints === 10 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(10)}> 10
                            </button>
                            <button className={selectedPoints === 15 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(15)}> 15
                            </button>
                            <button className={selectedPoints === 20 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(20)}> 20
                            </button>
                            <button className={selectedPoints === 25 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(25)}> 25
                            </button>
                            <button className={selectedPoints === 30 ? 'selected points' : 'points'}
                                    onClick={() => handleUpdatePoints(30)}> 30
                            </button>
                        </div>
                        {/*<button className='submitScoreButton' onClick={() => { handleSubmitPoints(); }}>Submit</button>*/}
                        <button
                            className='submitScoreButton' onClick={() => {
                            if (selectedPoints !== null) {handleSubmitPoints();
                            } else {alert(t("PopUps.alert"));}
                        }}
                        >
                            {t("PopUps.submit")}
                        </button>
                    </div>
                </div>
                )}
                </>
    )
}
export default ModeratorPopUps;