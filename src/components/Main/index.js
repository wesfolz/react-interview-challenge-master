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
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const deleteFavorite = (player) => {
        const url = ENDPOINT + 'favorites/' + player.id;
        fetch(url, {
            method: "DELETE",
        }).then(res => {
            return res.ok ? res.text() : Promise.reject(res);
        })
        .then(responseText => console.log(responseText))
        .catch(error => console.log(error));
    };

    const postFavorite = (player) => {
        const url = ENDPOINT + 'favorites'
        fetch(url, {
            method: "POST",
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

    const fetchFavorites = () => {
        let url = ENDPOINT + 'favorites';
        fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return Promise.reject(res)
                }
            })
            .then(favorites => initializeFavorites(favorites))
            .catch(error => console.log(error));
    };

    const fetchPlayers = (page, searchText) => {
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
            .then(players => initializePlayers(players))
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
    };

    const initializePlayers = (players) => {
        console.log(players);
        setPlayers(players);
    };

    const initializeFavorites = (favorites) => {
        setFavorites(favorites);
        setFavoriteCount(favorites.length);
        fetchPlayers(pageNum, searchText);
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

    const updateFavorites = (player, favorite) => {
        if(favorite) {
            setFavoriteCount(favoriteCount + 1);
            postFavorite(player);
        }
         else {
            setFavoriteCount(favoriteCount > 0 ? favoriteCount - 1 : 0);
            deleteFavorite(player);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchFavorites();
    }, []);

    const cardList = () => {
        return players.map((player) => {
            const filteredFavorites = favorites.filter(fav => {
                return fav.id === player.id;
            });
            const favorite = filteredFavorites.length > 0;
            console.log('favorites', favorite);
            // tempPlayer.image = ENDPOINT + player.image;
            return <Card key={player.name} player={player} teams={storedTeams} savePlayer={editPlayer} updateFavorites={updateFavorites} favorite={favorite}></Card>
        });
    }

    return (
        <div style={{ ...styles.container, ...props.style }}>
            <div style={styles.title}>NBA Interview</div>
            <p>{`Favorite Count: ${favoriteCount}`}</p>
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
