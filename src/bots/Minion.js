const Bot = require("./Bot");

class Minion extends Bot {
    /**
     * @param {Connection} following
     */
    constructor(following) {
        super(following.player.world);

        this.following = following;
        following.minions.push(this);
    }

    static get type() { return "minion"; }
    static get separateInTeams() { return false; }

    close() {
        super.close();
        this.following.minions.splice(this.following.minions.indexOf(this), 1);
    }

    get shouldClose() {
        return !this.hasPlayer ||
            !this.player.exists ||
            !this.player.hasWorld ||
            this.following.socketDisconnected ||
            this.following.disconnected ||
            !this.following.hasPlayer ||
            !this.following.player.exists ||
            this.following.player.world !== this.player.world;
    }
    update() {
        const player = this.player;
        if (player.state === -1) {
            this.spawningName = this.listener.settings.minionName;
            this.onSpawnRequest();
            this.spawningName = null;
        }
        this.mouseX = this.following.minionsFrozen ? this.player.viewArea.x : this.following.mouseX;
        this.mouseY = this.following.minionsFrozen ? this.player.viewArea.y : this.following.mouseY;
    }
}

module.exports = Minion;

const Connection = require("../sockets/Connection");