#Changelog

#### 1.3.0 @ 2019-03-19:
* Fixed some codes;
* Changed some codes;
* Deleted some codes;
* Added Shell Scripts and Batch file

-------------
#### 1.2.0 @ 2019-02-17:
* Fix crash when leaving world;
* Fix crash when spectating a player that gets destroyed;
* Upon exploding the split angles are now random;
* Support legacy protocol 20;
* SIGINT on command stream will close the server. Two SIGINTs for this are not needed anymore;
* Implement worldPlayerBotNames setting;
* Renamed setting serverUpdateFrequency to serverFrequency;
* New command, players
* Updated routers command
* Updated setting command to Suggest setting names if given doesn't exist;
* Renamed command killminion to rmminion;
* Renamed command killbot to rmbot;
* Formatting and language changes;

-------------
#### 1.1.12 @ 2018-11-12:
* Fix crash when leaving world then using worldid chat command;
* Implement modern protocol revision 2;
* Client gets its visible cells and leaderboard cleared when leaving a world;
* Formatting

-------------
#### 1.1.11 @ 2018-08-31:
* Fix wrong usage of unsigned integers for cell position in legacy protocol;
* Fix crash when matchmakerNeedsQueuing is on;
* Fix virus count being able to exceed virusMaxCount;
* Upgraded uws dependency version;
* Refactored stats command;
* Formatting

-------------
#### 1.1.10 @ 2018-08-18:
* Removed delay between commands, no idea why was it there in the first place;
* Default gamemodes are now registered at ServerHandle instead of GamemodeList;
* Renamed PlayerRouter to Router;
* Abstracted the table generating function of help;
* New server command, routers - the equivalent of Ogar's playerlist for OgarII;
* Rename Gamemode.gamemodeType to type;
* Rename Gamemode.gamemodeName to name;
* Actually implement Protocol.type;
* Added Protocol.subtype
* Renamed ProtocolHandle to ProtocolStore;
* Renamed Listener.allPlayingRouters to routers;
* Renamed Listener.addPlayingRouter to addRouter;
* Renamed Listener.removePlayingRouter to removeRouter;

-------------
#### 1.1.9 @ 2018-08-16:
* Fix executing an empty string as command killing the command stream;
* Update README
* Remove all comments

-------------
#### 1.1.8 @ 2018-08-12:
* Rename setting gamemode to serverGamemode;
* New setting, serverChatEnabled;
* Replace \uNNNN unicode codes with shorter \xNN variant;

-------------
#### 1.1.7 @ 2018-08-8:
* Changed setting playerMergeTime's default;
* Format shouldClose function on bots;
* Remove debug console.log;

-------------
#### 1.1.6 @ 2018-08-7:
* Fixed player cell merging time yet again;
* Fixed the view area being twice larger than it should be, agar.io was trolling me;

-------------
#### 1.1.5 @ 2018-08-6:
* Renamed setting minionStartSize to minionSpawnSize;
* Teams gamemode now uses minionSpawnSize for spawning minions;

-------------
#### 1.1.4 @ 2018-08-6:
* Fixed new player cell merging time
* Refactored and fixed up the legacy protocol;
* Changed setting finderMaxLevel's default from 32 to 16;
* Changed setting finderMaxItems's default from 32 to 16;
* New setting, listenerMinLegacyProtocol
* New setting, listenerMaxLegacyProtocol
* New setting, minionStartSize
* Renamed setting mapX to worldMapX
* Renamed setting mapY to worldMapY
* Renamed setting mapW to worldMapW
* Renamed setting mapH to worldMapH
* Renamed setting finderMaxLevel to worldFinderMaxLevel;
* Renamed setting finderMaxItems to worldFinderMaxItems;
* Renamed setting safeSpawnTries to worldSafeSpawnTries;
* Renamed setting safeSpawnFromEjected to worldSafeSpawnFromEjectedChance;
* Renamed setting playerDisposeDelay to worldPlayerDisposeDelay;
* Renamed setting ticksPerSecond to serverUpdateFrequency;
* Renamed setting playerBotsPerWorld to worldPlayerBotsPerWorld;
* Renamed setting minionsPerPlayer to worldMinionsPerPlayer;
* Renamed setting maxWorldCount to worldMaxCount;

-------------
#### 1.1.3 @ 2018-08-5:
* Fix fatal crash in legacy protocol when sending chat message;
* Fix fatal crash in legacy protocol when sending stats;
* Fix bad control to minions in modern protocol;

-------------
#### 1.1.2 @ 2018-08-5:
* Implement a new "Modern" protocol, which bases around using the minimal amount of different message types, and conserving size by further using flags;
* Fixed the "virus curling bug" mentioned in issue #16;
* Simplify player's world referencing;

-------------
#### 1.1.1 @ 2018-08-2:
* Replace String, Number and Boolean with string, number and boolean in docs;
* Sort out typedefs by having a single global definition typescript;
* Implement multiple protocol handling - Connection just links up WebSocket and Player now;
* Implement legacy protocol handle;
* Simplify player/connection references;

-------------
#### 1.1.0 @ 2018-07-31:
* Add this changelog file;
* Refactor CLI settings file manipulation;
* Use const & let instead of var wherever it is;
* GamemodeList is and was not a debug item;
* New setting, listenerBannedIPs array;
* Implement per-IP banning (range banning might be tricky to implement later on);
* Rename PlayerRouter.isDisconnected to disconnected;
* Add PlayerRouter.shouldClose abstract function;
* Calling Connection.close will either kill the connection or destroy the router depending on the connection status;
* Minions now don't get put in teams in Teams gamemode;
* Simplify Misc.randomColor;
* Fix fatal QuadTree flaw of branches not merging properly;
* Minor QuadTree optimization;
* Overall minor bugfixing and refactoring;

-------------
#### 1.0.5 @ 2018-05-4:
* Fix two fatal player bot errors where division with 0 occur;
* Implement new merging timing;

-------------
#### 1.0.4 @ 2018-04-30:
* Player bot improvements;
* Don't show the matchmaker queue messages when queuing is not necessary;

-------------
#### 1.0.3 @ 2018-04-28:
* Three new chat commands - worldid, leaveworld, joinworld;
* Make Gamemode.gamemodeType a static property;
* Actually use the World.frozen property;
* New gamemode, Last Man Standing;
* Add a world-level chat channel;
* Add feedback in chat when a match gets found;

-------------
#### 1.0.0 @ 2018-04-26:
* At ServerHandle, properly set settings given at constructor;
* New setting, ticksPerSecond;
* Updated behavior to reflect the addition of ticksPerSecond;
* New gamemode functions, onPlayerJoinWorld and onPlayerLeaveWorld;
* Implement Teams mode;

-------------
#### 0.9.19 @ 2018-04-20:
* New setting, mothercellActiveSpawnSpeed;
* Use proper default value for setting playerSpawnSize;
* Temporary fix for crash when a playing router attempts spawning after it gets detached from world;
* Have player bots continue following split prey until split cooldown expires;
* Fix crash because of player bots somehow get 0 distance to cell;
* Make help readable with padding;
* Minor updates to stats command;
* Add new commands: pause, resume, mass, merge, kill, pop, addminion, killminion, addbot, killbot;

-------------
#### 0.9.18 @ 2018-04-16:
* Logging settings are now in a standalone JSON file;
* A re-run won't be necessary for running the CLI without settings;
* Added new setting, listenerMaxConnectionsPerIP, plus implementation;
* Removed json-beautify dependency thanks to SuperOP535;
* listenerAcceptedOrigins is now an optional string array;
* Fixed the 'x in queue' message showing when matchmakerNeedsQueuing is false;
* Fixed matchmaker prioritizing new worlds when too many bots are in one;
* Worlds now self-destruct when they have zero external players;
* Fixed stats command's bots representation not working;

-------------
#### 0.9.17 @ 2018-02-17:
* Implement dynamic gamemode list, made for plugins;
* Add setting for gamemode;
* Fix eval command not showing return result;
* Have a single endpoint for changing the version;
* Fix fatal typo on World.prototype.destroy;

#### Nightly @ 2018-02-17:
* Implement Q-based minion controls;
* Disconnect inactive connections;
* Add two new CLI-only commands, reload and save;
* Disable logging DEBUG and ACCESS levels to console by default;
* Minor refactoring;
* Implement matchmaking;
* Avoid protocol version matching when parsing mouse position message;
* Three new default commands: eval, test & stats;

-------------
#### 0.9.16 @ 2018-02-16:
* Implement commands, ready for plugin support;
* Logging updates;
* A couple refactors;

-------------
#### 0.9.15 @ 2018-02-15:
* Minor CLI updates;
* Remove log entries of when a new player gets added or removed;
* Add playerBotsPerWorld setting;
* Add minionsPerPlayer setting;
* Implement the abstract bot class;
* Implement minions (WIP);
* Implement player bots (WIP);
* Update cell eat size multiplier - from 1.14075183 to 1.140175425099138;
* Optimize FFA's leaderboard compiliation time - use native sorting;
* Fix agar.io recognizing viruses/mothercells as regular cells;
* Minor refactoring at PlayerRouter;
* Minor refactoring of where player actions get called;
* Fix the server throwing up the connection because of my Cigar's 200 char length chat textbox;
* Minor refactoring at Listener;
* Actually use the allPlayingRouters array;
* Split the Player.prototype.update function into two - updateViewArea and updateVisibleCells;

#### Nightly @ 2018-02-15:
* Implement logging to file;
* Fix ServerHandle stopping logic;
* Set setting mothercellCount's default to 0;
* Don't have player bots split on very small cells;
* Check for bad number at Cell constructor;
* Use safe spawning positions for pellets;

-------------
#### 0.9.13 @ 2018-02-14:
* Minor refactoring in a couple places;
* Implement mothercells;
* Implement the chat;
* Implement autosplitting;

-------------
#### Nightly @ 2018-02-13:
* Call gamemode methods when necessary;
* Define messages for the leaderboard;
* Define the server stats type;
* Properly dispose of players & worlds;
* Fix viruses not setting the cell that ate it;
* Implement maximum connections count;
* Implement FFA's leaderboard;
* Fix the decay being off;
* Fix Player.prototype.updateState setting bad states;

-------------
#### 0.9.11 @ 2018-02-12:
* Implement viruses and related settings;
* Fix border set message inconsistency;
* Fix cell bouncing inconsistency;

-------------
#### 0.9.10 @ 2018-02-11:
* Cell splitting ejecting & merging works;

-------------
#### 0.9.7 @ 2018-02-10:
* Cell eating works;
* Setup for splitting;

-------------
#### 0.9.5 @ 2018-02-10:
* Spawning and moving works;