import React from 'react';
import './LeaderBoardStyle.css'

const LeaderBoard = ({ sortedUserData }) => {
    return (
        <div className='leaderBoard'>
            <h2>Leaderboard</h2>
            {sortedUserData.map(data => (
                <div className="leaderboardItem" key={data.id}>
                    <img className={data.strategy === 'Safeline' ? 'piecesafeline' :
                        data.strategy === 'Lunar' ? 'piecelunar' :
                            data.strategy === 'Domino House' ? 'piecedomino' :
                                data.strategy === 'Klaphatten' ? 'pieceklaphatten' :
                                    data.strategy === 'Top of the World' ? 'pieceworld' :
                                        data.strategy === 'Jysk Telepartner' ? 'piecejysk' : ""} alt="" />
                    <div>{data.name}</div>
                    <div className="pointsLeaderboard">{data.points}</div>

                </div>
            ))}
        </div>
    );
};

export default LeaderBoard;
