const games = {
    GN: [
        { id: 0, name: "Lobby", key: "main" },
        { id: 1001, name: "Bac Ball 1", key: "bacball1" },
        { id: 1002, name: "Bac Ball 2", key: "bacball2" },
        { id: 1003, name: "Lucky Next 1", key: "luckynext1" },
        { id: 1004, name: "Lucky Next 2", key: "luckynext2" },
        { id: 1005, name: "Se Ball", key: "seball" },
        { id: 1006, name: "Lucky Three", key: "luckythree" },
        { id: 1007, name: "Sic Ball", key: "sicball" }
    ],
    HD: [
        { id: 1001, name: "Bac Ball 1", key: "bacball1" },
        { id: 1002, name: "Bac Ball 2", key: "bacball2" },
        { id: 1003, name: "Lucky Next 1", key: "luckynext1" },
        { id: 1004, name: "Lucky Next 2", key: "luckynext2" },
        { id: 1005, name: "Se Ball", key: "seball" },
        { id: 1006, name: "Lucky Three", key: "luckythree" },
        { id: 1007, name: "Sic Ball", key: "sicball" }
    ]
};

/**
 * Get all games from a specific system
 * @param {string} system - The system name (GN, HD)
 * @returns {Array} Array of games for the specified system, defaults to GN games if system not found
 */
export const getGamesBySystem = (system) => {
    return games[system] || games.GN;
};

/**
 * Get all games as a flat array
 * @returns {Array} Array of all games
 */
export const getAllGames = () => {
    return Object.values(games).flat();
};

export default games;
