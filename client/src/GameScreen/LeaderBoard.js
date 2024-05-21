import React from 'react';
import './LeaderBoardStyle.css'
import {useTranslation} from "react-i18next";

const LeaderBoard = ({ sortedUserData, playerName }) => {
    const { t, i18n } = useTranslation('global');
    return (
        <div className='leaderBoard'>
            <h2>{t("Game.leaderboard")}</h2>
            {sortedUserData.map(data => (
                <div className="leaderboardItem" key={data.id}>
                    <img
                        className={`${data.name === playerName ? 'flicker' : ''} ${
                            data.strategy === 'Safeline' ? 'piecesafeline' :
                                data.strategy === 'Lunar' ? 'piecelunar' :
                                    data.strategy === 'Domino House' ? 'piecedomino' :
                                        data.strategy === 'Klaphatten' ? 'pieceklaphatten' :
                                            data.strategy === 'Top of the World' ? 'pieceworld' :
                                                data.strategy === 'Jysk Telepartner' ? 'piecejysk' : ''}`
                        }
                        alt=""
                    />
                    <div
                        className={`${data.name === playerName ? 'flicker' : ''} ${
                            data.strategy === 'Safeline' ? 'piecered' :
                                data.strategy === 'Lunar' ? 'pieceyellow' :
                                    data.strategy === 'Domino House' ? 'pieceblue' :
                                        data.strategy === 'Klaphatten' ? 'piecepurple' :
                                            data.strategy === 'Top of the World' ? 'piecegreen' :
                                                data.strategy === 'Jysk Telepartner' ? 'pieceorange' : ''}`
                        }>{data.name}
                    </div>
                    <div
                        className={`${data.name === playerName ? 'flicker pointsLeaderboard' : 'pointsLeaderboard'} ${
                            data.strategy === 'Safeline' ? 'piecered' :
                                data.strategy === 'Lunar' ? 'pieceyellow' :
                                    data.strategy === 'Domino House' ? 'pieceblue' :
                                        data.strategy === 'Klaphatten' ? 'piecepurple' :
                                            data.strategy === 'Top of the World' ? 'piecegreen' :
                                                data.strategy === 'Jysk Telepartner' ? 'pieceorange' : ''}`
                        }>
                        {data.points}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LeaderBoard;
