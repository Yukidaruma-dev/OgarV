const { Command, genCommand } = require("./CommandList");
const { EOL } = require("os");

/**
 * @param {string} str
 * @param {string} pad
 * @param {number} len
 */
function padRight(str, pad, len) {
    return str + new Array(Math.max(len - str.length, 0)).fill(pad).join("");
}
/**
 * @param {string} str
 * @param {string} pad
 * @param {number} len
 */
function padLeft(str, pad, len) {
    return new Array(Math.max(len - str.length, 0)).fill(pad).join("") + str;
}

/**
 * @param {GenCommandTable} contents
 * @param {string} eol
 */
function table(contents, eol) {
    const columnSizes = [];
    let all = "",
        i, j, rowText, row, col, size;
    for (i = 0; i < contents.columns.length; i++) {
        col = contents.columns[i];
        size = col.text.length;
        for (j = 0; j < contents.rows.length; j++)
            size = Math.max(size, contents.rows[j][i] ? contents.rows[j][i].length : 0);
        columnSizes.push(size);
    }
    for (i = 0, rowText = ""; i < contents.columns.length; i++) {
        col = contents.columns[i];
        rowText += (i == 0 ? "" : col.separated ? " | " : " ") + padRight(col.text, col.headPad, columnSizes[i]);
    }
    all += rowText + eol;
    for (i = 0, rowText = ""; i < contents.rows.length; i++, rowText = "") {
        for (j = 0; j < contents.rows[i].length; j++) {
            row = contents.rows[i][j] || "";
            col = contents.columns[j];
            rowText += (j == 0 ? "" : col.separated ? " | " : " ") + padRight(row, row ? col.rowPad : col.emptyPad, columnSizes[j]);
        }
        for (; j < contents.columns.length; j++) {
            col = contents.columns[j];
            rowText += (j == 0 ? "" : col.separated ? " | " : " ") + padRight("", col.emptyPad, columnSizes[j]);
        }
        all += rowText + eol;
    }
    return all;
}

/**
 * @param {SettingIdType} id
 */
function splitSettingId(id) {
    let items = [],
        reg, i = 0;
    while ((reg = /([a-z]+)|([A-Z][a-z]+)|([A-Z])/.exec(id)) != null && ++i < 10) {
        const capture = reg[1] || reg[2] || reg[3];
        items.push(capture.toLowerCase()), id = id.replace(capture, "");
    }
    return items;
}
/**
 * @param {string[]} a
 * @param {string[]} b
 */
function getSplitSettingHits(a, b) {
    let hits = 0;
    for (let i = 0, l = b.length; i < l; i++)
        if (a.indexOf(b[i]) !== -1) hits++;
    return hits;
}

/** @param {number} value */
function prettyMemory(value) {
    const units = ["B", "kiB", "MiB", "GiB", "TiB"];
    let i = 0;
    for (; i < units.length && value / 1024 > 1; i++)
        value /= 1024;
    return `${value.toFixed(1)} ${units[i]}`;
}

/** @param {number} seconds */
function prettyTime(seconds) {
    seconds = ~~seconds;

    let minutes = ~~(seconds / 60);
    if (minutes < 1) return `${seconds} seconds`;
    if (seconds === 60) return `1 minute`;

    let hours = ~~(minutes / 60);
    if (hours < 1) return `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds % 60} second${seconds === 1 ? "" : "s"}`;
    if (minutes === 60) return `1 hour`;

    let days = ~~(hours / 24);
    if (days < 1) return `${hours} hour${hours === 1 ? "" : "s"} ${minutes % 60} minute${minutes === 1 ? "" : "s"}`;
    if (hours === 24) return `1 day`;
    return `${days} day${days === 1 ? "" : "s"} ${hours % 24} hour${hours === 1 ? "" : "s"}`;
}
/** @param {number} seconds */
function shortPrettyTime(milliseconds) {
    let seconds = ~~(milliseconds / 1000);
    if (seconds < 1) return `${milliseconds}ms`;
    if (milliseconds === 1000) return `1s`;

    let minutes = ~~(seconds / 60);
    if (minutes < 1) return `${seconds}s`;
    if (seconds === 60) return `1m`;

    let hours = ~~(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    if (minutes === 60) return `1h`;

    let days = ~~(hours / 24);
    if (days < 1) return `${hours}h`;
    if (hours === 24) return `1d`;
    return `${days}d`;
}

/**
 * @param {CommandList} commands
 * @param {CommandList} chatCommands
 */
module.exports = (commands, chatCommands) => {
    commands.register(
        genCommand({
            name: "help",
            args: "",
            desc: "display all registered commands and their relevant information",
            exec: (handle, context, args) => {
                const list = handle.commands.list;
                const keys = Object.keys(list).sort();
                handle.logger.print(table({
                    columns: [
                        { text: "NAME", headPad: " ", emptyPad: " ", rowPad: " ", separated: false },
                        { text: "ARGUMENTS", headPad: " ", emptyPad: " ", rowPad: " ", separated: false },
                        { text: "DESCRIPTION", headPad: " ", emptyPad: " ", rowPad: " ", separated: true }
                    ],
                    rows: keys.map(v => {
                        return [
                            list[v].name,
                            list[v].args,
                            list[v].description
                        ]
                    })
                }, EOL));
            }
        }),
        genCommand({
            name: "routers",
            args: "[router type]",
            desc: "display information about routers and their players",
            exec: (handle, context, args) => {
                if (args.length > 1)
                    return void handle.logger.print("too many arguments");
                const matchingType = args.length >= 1 ? args[0] : null;
                const routers = handle.listener.routers
                    .filter(v => matchingType === null || v.type == matchingType);
                handle.logger.print(table({
                    columns: [
                        { text: "INDEX", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "TYPE", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "SOURCE", headPad: " ", emptyPad: "/", rowPad: " ", separated: true },
                        { text: "ACTIVE", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "DORMANT", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "PROTOCOL", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "PID", headPad: " ", emptyPad: "/", rowPad: " ", separated: false }
                    ],
                    rows: routers.map((v, i) => [
                        i.toString(),
                        v.type,
                        v.type === "connection" ? v.remoteAddress : null,
                        shortPrettyTime(Date.now() - v.connectTime),
                        shortPrettyTime(Date.now() - v.lastActivityTime),
                        v.protocol ? v.protocol.subtype : null,
                        v.hasPlayer ? v.player.id.toString() : null,
                    ])
                }, EOL));
            }
        }),
        genCommand({
            name: "players",
            args: "[world id or \"any\"] [router type]",
            desc: "display information about players",
            exec: (handle, context, args) => {
                if (args.length > 2)
                    return void handle.logger.print("too many arguments");
                const worldId = args.length >= 1 ? parseInt(args[0]) || null : null;
                const routerType = args.length === 2 ? args[1] : null;
                const players = handle.listener.routers
                    .filter(v => v.hasPlayer && (routerType == null || v.type == routerType))
                    .map(v => v.player)
                    .filter(v => worldId == null || (v.hasWorld && v.world.id === worldId));
                handle.logger.print(table({
                    columns: [
                        { text: "ID", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "WORLD", headPad: " ", emptyPad: "/", rowPad: " ", separated: true },
                        { text: "FOLLOWING", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "STATE", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "SCORE", headPad: " ", emptyPad: "/", rowPad: " ", separated: false },
                        { text: "NAME", headPad: " ", emptyPad: "/", rowPad: " ", separated: false }
                    ],
                    rows: players.map((v) => {
                        let ret = [
                            v.id.toString(),
                            v.hasWorld ? v.world.id.toString() : null,
                        ];
                        if (v.type === "minion") ret.push(v.following.player.id.toString());
                        else if (v.hasWorld && v.state === 1) ret.push(v.world.largestPlayer.id.toString());
                        else ret.push(null);

                        switch (v.state) {
                            case -1:
                                ret.push("idle");
                                break;
                            case 0:
                                ret.push("alive");
                                ret.push(Math.round(v.score).toString());
                                ret.push(v.ownedCells[0].name);
                                break;
                            case 1:
                                ret.push("spec");
                                break;
                            case 2:
                                ret.push("roam");
                                break;
                        }
                        return ret;
                    })
                }, EOL));
            }
        }),
        genCommand({
            name: "setting",
            args: "<name> [value]",
            desc: "change/print the value of a setting",
            exec: (handle, context, args) => {
                if (args.length < 1)
                    return void handle.logger.print("no setting name provided");
                const settingName = args[0];
                if (!handle.settings.hasOwnProperty(settingName)) {
                    const settingIdSplit = splitSettingId(settingName);
                    const possible = Object.keys(handle.settings)
                        .map(v => { return { name: v, hits: getSplitSettingHits(splitSettingId(v), settingIdSplit) }; })
                        .sort((a, b) => b.hits - a.hits)
                        .filter((v) => v.hits > 0)
                        .filter((v, i, array) => array[0].hits === v.hits)
                        .map(v => v.name);
                    let printing = "no such setting";
                    if (possible.length > 0) {
                        printing += `; did you mean ${possible.slice(0, 3).join(", ")}`
                        if (possible.length > 3) printing += `, ${possible.length - 3} other`;
                        printing += "?"
                    }
                    return void handle.logger.print(printing);
                }
                if (args.length >= 2) {
                    const settingValue = eval(args.slice(1).join(" "));
                    const newSettings = Object.assign({}, handle.settings, {
                        settingName: settingValue
                    });
                    handle.setSettings(newSettings);
                }
                handle.logger.print(handle.settings[settingName]);
            }
        }),
        genCommand({
            name: "stop",
            args: "",
            desc: "close the server",
            exec: (handle, context, args) => {
                if (!handle.stop()) handle.logger.print("failed");
            }
        }),
        genCommand({
            name: "restart",
            args: "",
            desc: "restart the server",
            exec: (handle, context, args) => {
                if (!handle.stop()) return void handle.logger.print("failed");
                handle.start();
            }
        }),
        genCommand({
            name: "start",
            args: "",
            desc: "start the server",
            exec: (handle, context, args) => {
                if (!handle.start()) handle.logger.print("failed");
            }
        }),
        genCommand({
            name: "eval",
            args: "",
            desc: "evaluate javascript code in a function bound to server handle",
            exec: (handle, context, args) => {
                handle.logger.print(
                    (function() {
                        try { return eval(args.join(" ")); } catch (e) { return !e ? e : (e.toString() || e); }
                    }).bind(handle)()
                );
            }
        }),
        genCommand({
            name: "test",
            args: "",
            desc: "test command",
            exec: (handle, context, args) => handle.logger.print("success successful")
        }),
        genCommand({
            name: "stats",
            args: "",
            desc: "display critical information about the server",
            exec: (handle, context, args) => {
                const logger = handle.logger;
                if (!handle.running)
                    logger.print("not running");
                else {
                    const memory = process.memoryUsage();
                    logger.print(`load:    ${handle.averageTickTime.toFixed(4)} ms / ${handle.tickDelay} ms`);
                    logger.print(`heap:    ${prettyMemory(memory.heapUsed)} / ${prettyMemory(memory.heapTotal)} / ${prettyMemory(memory.rss)} / ${prettyMemory(memory.external)}`);
                    logger.print(`time:    ${prettyTime(Math.floor((Date.now() - handle.startTime.getTime()) / 1000))}`);
                    const external = handle.listener.connections.length;
                    const internal = handle.listener.routers.length - external;
                    logger.print(`routers: ${Object.keys(handle.players).length} players, ${external} external, ${internal} internal`);
                    for (let id in handle.worlds) {
                        const world = handle.worlds[id],
                            stats = world.stats,
                            cells = [world.cells.length, world.playerCells.length, world.pelletCount, world.virusCount, world.ejectedCells.length, world.mothercellCount],
                            statsF = [stats.external, stats.internal, stats.limit, stats.playing, stats.spectating];
                        logger.print(`world ${id}: ${cells[0]} cells - ${cells[1]}P/${cells[2]}p/${cells[3]}v/${cells[4]}e/${cells[5]}m`);
                        logger.print(`         ${statsF[0]} / ${statsF[1]} / ${statsF[2]} players - ${statsF[3]}p/${statsF[4]}s`);
                    }
                }
            }
        }),
        genCommand({
            name: "pause",
            args: "",
            desc: "pause the server",
            exec: (handle, context, args) => {
                if (!handle.running) return void handle.logger.print("handle not started");
                if (!handle.ticker.isRunning) return void handle.logger.print("not running");
                handle.ticker.stop();
            }
        }),
        genCommand({
            name: "resume",
            args: "",
            desc: "unpause the server",
            exec: (handle, context, args) => {
                if (!handle.running) return void handle.logger.print("handle not started");
                if (handle.ticker.isRunning) return void handle.logger.print("already running");
                handle.ticker.start();
            }
        }),
        genCommand({
            name: "mass",
            args: "<id> <mass>",
            desc: "set cell mass to all of a player's cells",
            exec: (handle, context, args) => {
                if (args.length === 0) return void handle.logger.print("missing player id");
                if (args.length === 1) return void handle.logger.print("missing mass input");
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const mass = parseFloat(args[1]);
                if (isNaN(mass)) return void handle.logger.print("invalid number for mass input");
                const player = handle.players[id];
                if (player.state !== 0) return void handle.logger.print("player is not alive");
                const l = player.ownedCells.length;
                for (let i = 0; i < l; i++) player.ownedCells[i].mass = mass;
                handle.logger.print(`player now has ${mass * l} mass`);
            }
        }),
        genCommand({
            name: "merge",
            args: "<id>",
            desc: "instantly merge a player",
            exec: (handle, context, args) => {
                if (args.length === 0) return void handle.logger.print("missing player id");
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const player = handle.players[id];
                if (player.state !== 0) return void handle.logger.print("player is not alive");
                const l = player.ownedCells.length;
                let sqSize = 0;
                for (let i = 0; i < l; i++) sqSize += player.ownedCells[i].squareSize;
                player.ownedCells[0].squareSize = sqSize;
                player.ownedCells[0].x = player.viewArea.x;
                player.ownedCells[0].y = player.viewArea.y;
                for (let i = 1; i < l; i++) player.world.removeCell(player.ownedCells[1]);
                handle.logger.print(`merged player from ${l} cells and ${Math.round(sqSize / 100)} mass`);
            }
        }),
        genCommand({
            name: "kill",
            args: "<id>",
            desc: "instantly kill a player",
            exec: (handle, context, args) => {
                if (args.length === 0) return void handle.logger.print("missing player id");
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const player = handle.players[id];
                if (player.state !== 0) return void handle.logger.print("player is not alive");
                for (let i = 0, l = player.ownedCells.length; i < l; i++)
                    player.world.removeCell(player.ownedCells[0]);
                handle.logger.print("player killed");
            }
        }),
        genCommand({
            name: "killall",
            args: "<world id>",
            desc: "instantly kill all players in a world",
            exec: (handle, context, args) => {
                if (args.length === 0) return void handle.logger.print("missing world id");
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for world id");
                if (!handle.worlds.hasOwnProperty(id))
                    return void handle.logger.print("no world has this id");
                const players = handle.worlds[id].players;
                for (let i = 0; i < players.length; i++) {
                    const player = players[i];
                    if (player.state !== 0) continue;
                    for (let j = 0, l = player.ownedCells.length; j < l; j++)
                        player.world.removeCell(player.ownedCells[0]);
                }
                handle.logger.print(`${players.length} player${players.length === 1 ? "" : "s"} killed`);
            }
        }),
        genCommand({
            name: "explode",
            args: "<id>",
            desc: "instantly explode a player's first cell",
            exec: (handle, context, args) => {
                if (args.length === 0) return void handle.logger.print("missing player id");
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const player = handle.players[id];
                if (player.state !== 0) return void handle.logger.print("player is not alive");
                player.world.popPlayerCell(player.ownedCells[0]);
                handle.logger.print("player exploded");
            }
        }),
        genCommand({
            name: "addminion",
            args: "<id> [count=1]",
            desc: "assign minions to a player",
            exec: (handle, context, args) => {
                const Connection = require("../sockets/Connection");
                const Minion = require("../bots/Minion");
                if (args.length === 0) return void handle.logger.print("missing player id");
                if (args.length === 1) args[1] = "1";
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const count = parseInt(args[1]);
                if (isNaN(count)) return void handle.logger.print("invalid number for count");
                const player = handle.players[id];
                if (!(player.router instanceof Connection)) return void handle.logger.print("player is a bot");
                if (!player.hasWorld) return void handle.logger.print("player is not in a world");
                for (let i = 0; i < count; i++) new Minion(player.router);
                handle.logger.print(`added ${count} minions to player`);
            }
        }),
        genCommand({
            name: "rmminion",
            args: "<id> [count=1]",
            desc: "remove assigned minions from a player",
            exec: (handle, context, args) => {
                const Connection = require("../sockets/Connection");
                const Minion = require("../bots/Minion");
                if (args.length === 0) return void handle.logger.print("missing player id");
                if (args.length === 1) args[1] = "1";
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for player id");
                if (!handle.players.hasOwnProperty(id))
                    return void handle.logger.print("no player has this id");
                const count = parseInt(args[1]);
                if (isNaN(count)) return void handle.logger.print("invalid number for count");
                const player = handle.players[id];
                if (!(player.router instanceof Connection)) return void handle.logger.print("player is a bot");
                if (!player.hasWorld) return void handle.logger.print("player is not in a world");
                let realCount = 0;
                for (let i = 0; i < count && player.router.minions.length > 0; i++) {
                    player.router.minions[0].close();
                    realCount++;
                }
                handle.logger.print(`removed ${realCount} minions from player`);
            }
        }),
        genCommand({
            name: "addbot",
            args: "<world id> [count=1]",
            desc: "assign player bots to a world",
            exec: (handle, context, args) => {
                const PlayerBot = require("../bots/PlayerBot");
                if (args.length === 0) return void handle.logger.print("missing world id");
                if (args.length === 1) args[1] = "1";
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for world id");
                if (!handle.worlds.hasOwnProperty(id))
                    return void handle.logger.print("no world has this id");
                const count = parseInt(args[1]);
                if (isNaN(count)) return void handle.logger.print("invalid number for count");
                const world = handle.worlds[id];
                for (let i = 0; i < count; i++) new PlayerBot(world);
                handle.logger.print(`added ${count} player bots to world`);
            }
        }),
        genCommand({
            name: "rmbot",
            args: "<world id> [count=1]",
            desc: "remove player bots from a world",
            exec: (handle, context, args) => {
                const PlayerBot = require("../bots/PlayerBot");
                if (args.length === 0) return void handle.logger.print("missing world id");
                if (args.length === 1) args[1] = "1";
                const id = parseInt(args[0]);
                if (isNaN(id)) return void handle.logger.print("invalid number for world id");
                if (!handle.worlds.hasOwnProperty(id))
                    return void handle.logger.print("no world has this id");
                const count = parseInt(args[1]);
                if (isNaN(count)) return void handle.logger.print("invalid number for count");
                const world = handle.worlds[id];
                let realCount = 0;
                for (let i = 0, l = world.players.length; i < l && realCount < count; i++) {
                    if (!(world.players[i].router instanceof PlayerBot)) continue;
                    world.players[i].router.close();
                    realCount++;
                    i--;
                    l--;
                }
                handle.logger.print(`removed ${realCount} player bots from world`);
            }
        })
    );
    chatCommands.register(
        genCommand({
            name: "help",
            args: "",
            desc: "display all registered commands and their relevant information",
            exec: (handle, context, args) => {
                const list = handle.chatCommands.list;
                handle.listener.globalChat.directMessage(null, context, "available commands:");
                for (let name in list)
                    handle.listener.globalChat.directMessage(
                        null, context,
                        `${name}${list[name].args.length > 0 ? " " : ""}${list[name].args} - ${list[name].description}`
                    );
            }
        }),
        genCommand({
            name: "id",
            args: "",
            desc: "get your id",
            exec: (handle, context, args) => {
                handle.listener.globalChat.directMessage(
                    null,
                    context,
                    context.hasPlayer ? `your ID is ${context.player.id}` : "you don't have a player associated with yourself"
                );
            }
        }),
        genCommand({
            name: "worldid",
            args: "",
            desc: "get your world's id",
            exec: (handle, context, args) => {
                const chat = handle.listener.globalChat;
                if (!context.hasPlayer)
                    return void chat.directMessage(null, context, "you don't have a player associated with yourself");
                if (!context.player.hasWorld)
                    return void chat.directMessage(null, context, "you're not in a world");
                chat.directMessage(`your world ID is ${context.player.world.id}`);
            }
        }),
        genCommand({
            name: "leaveworld",
            args: "",
            desc: "leave your world",
            exec: (handle, context, args) => {
                const chat = handle.listener.globalChat;
                if (!context.hasPlayer)
                    return void chat.directMessage(null, context, "you don't have a player associated with yourself");
                if (!context.player.hasWorld)
                    return void chat.directMessage(null, context, "you're not in a world");
                context.player.world.removePlayer(context.player);
            }
        }),
        genCommand({
            name: "joinworld",
            args: "<id>",
            desc: "try to join a world",
            exec: (handle, context, args) => {
                const chat = handle.listener.globalChat;
                if (args.length === 0)
                    return void chat.directMessage(null, context, "missing world id argument");
                const id = parseInt(args[0]);
                if (isNaN(id))
                    return void chat.directMessage(null, context, "invalid world id number format");
                if (!context.hasPlayer)
                    return void chat.directMessage(null, context, "you don't have a player instance associated with yourself");
                if (!context.player.hasWorld)
                    return void chat.directMessage(null, context, "you're already in a world");
                if (!handle.worlds.hasOwnProperty(id))
                    return void chat.directMessage(null, context, "this world doesn't exist");
                if (!handle.gamemode.canJoinWorld(handle.worlds[id]))
                    return void chat.directMessage(null, context, "you can't join this world");
                handle.worlds[id].addPlayer(context.player);
            }
        })
    );
};

const { CommandList } = require("./CommandList");
const ServerHandle = require("../ServerHandle");