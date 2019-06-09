import React, { useState, useEffect } from "react";
import styles from "./styles";

const ENDPOINT = "http://localhost:3008/";

const Card = props => {
    const [initalPlayerInfo, setInitialPlayerInfo] = useState(props.player);
    const [playerInfo, setPlayerInfo] = useState(props.player);
    const [editing, setEditing] = useState(false);
    const [teamName, setTeamName] = useState(null);
    const [favorite, setFavorite] = useState(props.favorite != null ? props.favorite : false);

    const findTeamName = () => {
        const filteredTeam = props.teams.filter(t => {
            return t.id === playerInfo.team
        });
        console.log(filteredTeam);
        if (filteredTeam.length) {
            setTeamName(filteredTeam[0].name);
        } else {
            setTeamName('No Team');
        }
    };

    useEffect(() => {
        console.log(playerInfo.name, 'favorite', favorite);
        findTeamName();
    }, [playerInfo]);

    const saveEdits = () => {
        console.log('save');
        setEditing(false);
        setInitialPlayerInfo(playerInfo);
        if (props.savePlayer) {
            props.savePlayer(playerInfo);
        }
    };

    const cancelEdits = () => {
        console.log('cancel');
        setEditing(false);
        setPlayerInfo(initalPlayerInfo);
    };

    const controlButtons = () => {
        return (
            editing ?
                <div>
                    <button onClick={() => cancelEdits()}>Cancel</button>
                    <button onClick={() => saveEdits()}>Save</button>
                </div> :
                <button onClick={() => setEditing(true)}>Edit</button>
        );
    };

    const editPlayer = (e) => {
        console.log(e.target.value, e.target.name);
        let player = { ...playerInfo };
        if(e.target.name === 'team') {
            player[e.target.name] = parseInt(e.target.value);
        } else {
            player[e.target.name] = e.target.value;
        }
        setPlayerInfo(player);
        console.log(player);
    };

    const updateFavorite = () => {
        console.log('updateFavorite');
        if(props.updateFavorites) {
            props.updateFavorites(playerInfo, !favorite);
        }
        setFavorite(!favorite);
    };

    const playerInfoElements = () => {
        return (
            editing ?
                <div>
                    <input placeholder='Position' type="text" name="position" value={playerInfo.position} onChange={(e) => editPlayer(e)} />
                    <input placeholder='College' type="text" name="college" value={playerInfo.college} onChange={(e) => editPlayer(e)} />
                    <select name="team" value={playerInfo.team} onChange={(e) => editPlayer(e)}>
                        {props.teams.map((team) => {
                            return <option key={team.id} value={team.id}>{team.name}</option>
                        })}
                    </select>
                </div> :
                <div>
                    <div>{playerInfo.position}</div>
                    <div>{playerInfo.college}</div>
                    <div>{teamName}</div>
                </div>
        );
    };

    return (
        <div style={{ ...styles.container, ...props.style }}>
            <input type="checkbox" checked={favorite} onChange={() => updateFavorite()}/>
            {controlButtons()}
            {editing ?
                <input placeholder='Name' name="name" type="text" value={playerInfo.name} onChange={(e) => editPlayer(e)} />
                :
                <div style={styles.name}>{playerInfo.name}</div>}
            <img src={ENDPOINT + playerInfo.image} style={styles.playerImage} alt="player_image" />
            {playerInfoElements()}
        </div>
    );
};

export default Card;
