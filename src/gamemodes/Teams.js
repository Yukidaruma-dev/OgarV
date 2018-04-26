const Gamemode = require("./Gamemode");
const Misc = require("../primitives/Misc");
const Messages = {
    UpdatePieBoard: require("../messages/UpdatePieBoard")
};

const teamColors = [
    { r: 204, g: 51, b: 51 },
    { r: 51, g: 204, b: 51 },
    { r: 51, g: 51, b: 204 }
];
const teamCount = teamColors.length;

/**
 * @param {Number} index
 */
function getTeamColor(index) {
    const random = ~~(Math.random() * 52);
    const highlight = 204 + random;
    const lowlight = 51 - random;
    return {
        r: teamColors[index].r === 204 ? highlight : lowlight,
        g: teamColors[index].g === 204 ? highlight : lowlight,
        b: teamColors[index].b === 204 ? highlight : lowlight
    };
}

class Teams extends Gamemode {
    /** @param {ServerHandle} handle */
    constructor(handle) {
        super(handle);
    }

    get gamemodeType() { return 1; }
    static get gamemodeName() { return "Teams"; }

    /**
     * @param {World} world
     */
    onNewWorld(world) {
        world.teams = { };
        for (let i = 0; i < teamCount; i++)
            world.teams[i] = [];
    }
    /**
     * @param {Player} player
     * @param {World} world
     */
    onPlayerJoinWorld(player, world) {
        let s = 0;
        for (let i = 0; i < teamCount; i++)
            s = world.teams[i].length < world.teams[s].length ? i : s;
        world.teams[s].push(player);
        player.team = s;
    }
    /**
     * @param {Player} player
     * @param {World} world
     */
    onPlayerLeaveWorld(player, world) {
        world.teams[player.team].splice(world.teams[player.team].indexOf(player), 1);
        player.team = null;
    }

    /**
     * @param {Player} player
     * @param {String} name
     */
    onPlayerSpawnRequest(player, name) {
        if (player.state === 0) return;
        const size = this.handle.settings.playerSpawnSize;
        player.world.spawnPlayer(player, getTeamColor(player.team), player.world.getSafeSpawnPos(size), size, name, null);
    }

    /**
     * @param {World} world
     */
    compileLeaderboard(world) {
        world.leaderboard = [];
        let sumAllSqSize = 0;
        for (let i = 0; i < teamCount; i++) {
            const sumSqSize =
                world.teams[i].length === 0 ? 0 :
                world.teams[i].map(v => {
                    if (v.ownedCells.length === 0) return 0;
                    const ret = v.ownedCells.reduce((a, b) => (a.squareSize || a) + b.squareSize);
                    return ret.squareSize || ret;
                }).reduce((a, b) => a + b);
            world.leaderboard.push(sumSqSize);
            sumAllSqSize += sumSqSize;
        }
        for (let i = 0; i < teamCount; i++)
            world.leaderboard[i] /= sumAllSqSize;
    }

    /** @param {Connection} connection */
    sendLeaderboard(connection) {
        connection.send(Messages.UpdatePieBoard(connection.player.world.leaderboard));
    }
}

module.exports = Teams;

const ServerHandle = require("../ServerHandle");
const World = require("../worlds/World");
const Connection = require("../sockets/Connection");
const Player = require("../worlds/Player");