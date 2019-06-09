import React, { useState, useEffect } from "react";
import Search from "./Search";
import Card from "./Card";
import styles from "./styles";

const ENDPOINT = "http://localhost:3008/";

const Main = (props) => {

    const [players, setPlayers] = useState([]);

    const fetchPlayers = (teams) => {
        console.log(teams);
        fetch(ENDPOINT + 'players')
        .then(res => {
            return res.ok ? res.json(): Promise.reject(res);
        })
        .then(players => initializePlayers(teams, players))
        .catch(error => console.log(error));
    };

    const fetchTeams = () => {
        fetch(ENDPOINT + 'teams')
        .then(res => {
            return res.ok ? res.json(): Promise.reject(res);
        })
        .then(teams => initializeTeams(teams))
        .catch(error => console.log(error));
    };

    const initializeTeams = (teams) => {
        fetchPlayers(teams);
    };

    const initializePlayers = (teams, players) => {
        console.log('teams', teams);
        console.log('players', players);


        setPlayers(players.map((player) => {
            let filteredTeams = teams.filter(t => {
                return t.id === player.team
            })
            let team = null;
            if(filteredTeams.length > 0) {
                team = filteredTeams[0];
            }

            if(team != null) {
                player.teamName = team.name;
            } else {
                player.teamName = 'No Team';
            }
            return player;
        }));
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const cardList = () => {
        console.log(players);
        return players.map((player) => {
            let tempPlayer = {...player};
            tempPlayer.image = ENDPOINT + player.image;
            return <Card key={tempPlayer.name} player={tempPlayer}></Card>
        });
    }

    return (
        <div style={{ ...styles.container, ...props.style }}>
            <div style={styles.title}>NBA Interview</div>
            <Search style={styles.search} />
            {cardList()}
        </div>
    );
}

export default Main;
