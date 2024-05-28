import React from 'react';
import './PopUpStyle.css'
import {useTranslation} from "react-i18next";

const PlayerPopUps = ({ gamePaused, gamePaused2, question, textBoxContent, handleTextBoxChange, handleSubmitAnswer, popupColor, setPopupColor }) => {
    const { t, i18n } = useTranslation('global');
    return (
        <>
            {gamePaused && (
                <div className='questionBoxPopup'>
                    <div className={`questionColorBox ${popupColor}`}>
                        <div className='rowpopup'>
                            <img className={`${
                                popupColor === 'red' ? 'popupsafeline' :
                                    popupColor === 'yellow' ? 'popuplunar' :
                                        popupColor === 'blue' ? 'popupdomino' :
                                            popupColor === 'purple' ? 'popupklaphatten' :
                                                popupColor === 'green' ? 'popupworld' :
                                                    popupColor === 'orange' ? 'popupjysk' :
                                                        popupColor === 'black1' ? 'chance' :
                                                            popupColor === 'black2' ? 'sales' :
                                                                popupColor === 'black3' ? 'megatrends' : ''}`}
                                 alt="" />
                            <div className='strategyName'>
                                {popupColor === 'yellow' ? 'Lunar':
                                    popupColor === 'green' ? 'Top of the World' :
                                        popupColor === 'blue' ? 'Domino House' :
                                            popupColor === 'purple' ? 'Klaphatten' :
                                                popupColor === 'red' ? 'Safeline' :
                                                    popupColor === 'orange' ? 'Jysk Telepartner' :
                                                            popupColor === 'black1' ? 'Chance':
                                                                popupColor === 'black2' ? 'Sales' :
                                                                    popupColor === 'black3' ? 'Megatrends' :
                                                        'strategy'} </div>
                        </div>
                        <div className='questionLabel'> <br/> {t("PopUps.question")} </div>
                        <div className="questionWhiteBox">{question}</div>

                    </div>
                    <div className="answerPopup">
                        <div className='answerText'> {t("PopUps.playerAnswer")} </div>
                        <textarea className={'answerInput'} value={textBoxContent} placeholder={t("PopUps.playerHolder")} onChange={handleTextBoxChange} />
                        <button className={'submitButton'} onClick={handleSubmitAnswer}>{t("PopUps.submitAns")}</button>
                    </div>
                </div>
            )}
            {gamePaused2 && (
                <div className='waitingScreenPopup'>
                    <div className='waitingScreenText'> {t("PopUps.wait")} </div>
                </div>
            )}
        </>
    );
};

export default PlayerPopUps;