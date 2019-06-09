import React, { useState, useEffect } from "react";
import Search from "./Search";
import Card from "./Card";
import styles from "./styles";

const ENDPOINT = "http://localhost:3008/";
const PLAYER_LIMIT = 10

const Main = (props) => {
    const [players, setPlayers] = useState([]);
    const [storedTeams, setStoredTeams] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [totalResults, setTotalResults] = useState(0);

    const editPlayer = (player) => {
        const url = ENDPOINT + 'players/' + player.id;
        fetch(url, {
            method: "PATCH",
            body: JSON.stringify(player),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            return res.ok ? res.text() : Promise.reject(res);
        })
        .then(responseText => console.log(responseText))
        .catch(error => console.log(error));
    };

    const fetchPlayers = (teams, page, searchText) => {
        let url = ENDPOINT + 'players?';
        if (searchText) {
            url += 'q=' + searchText + "&";
        }
        url += '_page=' + page + '&_limit=' + PLAYER_LIMIT;
        console.log(url);
        fetch(url)
            .then(res => {
                if (res.ok) {
                    res.headers.forEach(function (val, key) {
                        console.log(key + ' -> ' + val);
                        if (key === 'x-total-count') {
                            setTotalResults(val);
                        }
                    });
                    return res.json();
                } else {
                    return Promise.reject(res)
                }
            })
            .then(players => initializePlayers(teams, players))
            .catch(error => console.log(error));
    };

    const fetchTeams = () => {
        fetch(ENDPOINT + 'teams')
            .then(res => {
                return res.ok ? res.json() : Promise.reject(res);
            })
            .then(teams => initializeTeams(teams))
            .catch(error => console.log(error));
    };

    const initializeTeams = (teams) => {
        setStoredTeams(teams);
        fetchPlayers(teams);
    };

    const initializePlayers = (teams, players) => {
        setPlayers(players);
    };

    const previousPage = () => {
        fetchPlayers(storedTeams, pageNum - 1, searchText);
        setPageNum(pageNum - 1);
    };

    const nextPage = () => {
        fetchPlayers(storedTeams, pageNum + 1, searchText);
        setPageNum(pageNum + 1);
    };

    const search = (text) => {
        setSearchText(text);
        fetchPlayers(storedTeams, pageNum, text);
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const cardList = () => {
        return players.map((player) => {
            let tempPlayer = { ...player };
            // tempPlayer.image = ENDPOINT + player.image;
            return <Card key={tempPlayer.name} player={tempPlayer} teams={storedTeams} savePlayer={editPlayer}></Card>
        });
    }

    return (
        <div style={{ ...styles.container, ...props.style }}>
            <div style={styles.title}>NBA Interview</div>
            <Search style={styles.search} search={search} />
            <div>
                <button onClick={previousPage} disabled={pageNum <= 1}>Previous</button>
                <button onClick={nextPage} disabled={pageNum * PLAYER_LIMIT >= totalResults}>Next</button>
            </div>
            {cardList()}
        </div>
    );
}

export default Main;
