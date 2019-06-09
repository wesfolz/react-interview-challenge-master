import React from "react";
import styles from "./styles";

const Search = props => {

    const handleChange = (e) => {
        if(props.search) {
            props.search(e.target.value);
        }
    };

    return (
        <div style={{ ...styles.container, ...props.style }}>
            <input placeholder="Search..." onChange={(e) => handleChange(e)}/>
        </div>
    );
};

export default Search;
