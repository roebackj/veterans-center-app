import React from 'react';


const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search for veteran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setSearchTerm('')}>x</button>
        </div>
    );
};

export default Search;