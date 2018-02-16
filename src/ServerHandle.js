const Settings = require("./Settings");

const { CommandList } = require("./commands/Commands");
const DefaultCommands = require("./commands/DefaultCommands");

const Stopwatch = require("./primitives/Stopwatch");
const Logger = require("./primitives/Logger");
const Ticker = require("./primitives/Ticker");

const Listener = require("./sockets/Listener");
const Player = require("./worlds/Player");
const World = require("./worlds/World");

// DEBUG
const FFA = require("./gamemodes/FFA");

class ServerHandle {
    /**
     * @param {Settings} settings
     */
    constructor(settings) {
        /** @type {Settings} */
        this.settings = Object.assign(Object.create(Settings), settings);

        /** @type {Gamemode} */
        this.gamemode = new FFA(this);
        this.commands = new CommandList(this);
        DefaultCommands(this.commands);

        this.running = false;
        /** @type {Date} */
        this.startTime = null;
        this.averageTickTime = NaN;
        this.tick = NaN;
        
        this.ticker = new Ticker(40);
        this.ticker.add(this._onTick.bind(this));
        this.stopwatch = new Stopwatch();
        this.logger = new Logger();
        
        this.listener = new Listener(this);
        /** @type {{[id: string]: World}} */
        this.worlds = { };
        /** @type {{[id: string]: Player}} */
        this.players = { };
    }

    start() {
        if (this.running) return false;
        this.logger.inform("starting");

        this.startTime = new Date();
        this.averageTickTime = this.tick = 0;
        this.running = true;

        this.listener.open();
        this.ticker.start();
        this.gamemode.onHandleStart();

        this.logger.inform("ticker begin");
        // DEBUG
        this.createWorld();
        return true;
    }

    stop() {
        if (!this.running) return false;
        this.logger.inform("stopping");

        this.ticker.stop();
        for (let id in this.worlds)
            this.removeWorld(id);
        this.gamemode.onHandleStop();
        this.listener.close();

        this.startTime = null;
        this.averageTickTime = this.tick = NaN;
        this.running = false;

        this.logger.inform("ticker stop");
        return true;
    }

    /** @returns {World} */
    createWorld() {
        let id = 0;
        while (this.worlds.hasOwnProperty(++id)) ;
        const newWorld = new World(this, id);
        this.worlds[id] = newWorld;
        this.gamemode.onNewWorld(newWorld);
        this.logger.debug(`added a world with id ${id}`);
        return newWorld;
    }

    /**
     * @param {Number} id
     * @returns {Boolean}
     */
    removeWorld(id) {
        if (!this.worlds.hasOwnProperty(id)) return false;
        this.gamemode.onWorldDestroy(this.worlds[id]);
        this.worlds[id].destroy();
        delete this.worlds[id];
        this.logger.debug(`removed world with id ${id}`);
        return true;
    }

    /**
     * @param {PlayingRouter} router
     * @returns {Player}
     */
    createPlayer(router) {
        let id = 0;
        while (this.players.hasOwnProperty(++id)) ;
        const newPlayer = new Player(this, id, router);
        this.players[id] = newPlayer;
        this.gamemode.onNewPlayer(newPlayer);
        return newPlayer;
    }

    /**
     * @param {Number} id
     * @returns {Boolean}
     */
    removePlayer(id) {
        if (!this.players.hasOwnProperty(id)) return false;
        this.gamemode.onPlayerDestroy(this.players[id]);
        this.players[id].destroy();
        this.players[id].exists = false;
        delete this.players[id];
        return true;
    }

    _onTick() {
        this.stopwatch.begin();
        this.tick++;
        for (let id in this.worlds) this.worlds[id].update();
        this.listener.update();
        this.gamemode.onHandleTick();
        this.averageTickTime = this.stopwatch.elapsed();
        this.stopwatch.stop();
    }
}

module.exports = ServerHandle;

const PlayingRouter = require("./primitives/PlayingRouter");
const Gamemode = require("./gamemodes/Gamemode");