import React from "react";
import styles from "./styles";

const Card = props => {
    return (
        <div style={{ ...styles.container, ...props.style }}>
            <div style={styles.name}>{props.player.name}</div>
            <img src={props.player.image} style={styles.playerImage} alt="player_image" />
            <div>{props.player.teamName}</div>
        </div>
    );
};

export default Card;
