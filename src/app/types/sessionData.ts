
export type TypeSessionData = {
    gameClient: TypeGameClient;
    gameData: TypeSessionGameData;
    gameDodge: TypeGameDodge;
    map: TypeMap;
    phase: string;
};

export type TypeGameClient = {
    observerServerIp: string;
    observerServerPort: number;
    running: boolean;
    serverIp: string;
    serverPort: number;
    visible: boolean;
};

export type TypeSessionGameData = {
    gameId: number;
    gameName: string;
    isCustomGame: boolean;
    password: string;
    playerChampionSelections: TypePlayerChampionSelections;
    queue: TypeQueue;
    spectatorKey: string;
    spectatorsAllowed: boolean;
    teamOne: TypeSessionTeams[];
    teamTwo: TypeSessionTeams[];
};

export type TypePlayerChampionSelections = {
    championId: number;
    puuid: string;
    selectedSkinIndex: number;
    spell1Id: number;
    spell2Id: number;
};

export type TypeQueue = {
    allowablePremadeSizes: number[];
    areFreeChampionsAllowed: boolean;
    assetMutator: string;
    category: string;
    championsRequiredToPlay: number;
    description: string;
    detailedDescription: string;
    gameMode: string;
    gameTypeConfig: TypeGameTypeConfig;
    id: number;
    isBotHonoringAllowed: boolean;
    isCustom: boolean;
    isRanked: boolean;
    isTeamBuilderManaged: boolean;
    lastToggledOffTime: number;
    lastToggledOnTime: number;
    mapId: number;
    maximumParticipantListSize: number;
    minLevel: number;
    minimumParticipantListSize: number;
    name: string;
    numPlayersPerTeam: number;
    pickMode: string;
    queueAvailability: string;
    queueRewards: TypeQueueRewards;
    removalFromGameAllowed: boolean;
    removalFromGameDelayMinutes: number;
    shortName: string;
    showPositionSelector: boolean;
    spectatorEnabled: boolean;
    type: string;
};

export type TypeGameTypeConfig = {
    advancedLearningQuests: boolean;
    allowTrades: boolean;
    banMode: string;
    banTimerDuration: number;
    battleBoost: boolean;
    crossTeamChampionPool: boolean;
    deathMatch: boolean;
    doNotRemove: boolean;
    duplicatePick: boolean;
    exclusivePick: boolean;
    id: number;
    learningQuests: boolean;
    mainPickTimerDuration: number;
    maxAllowableBans: number;
    name: string;
    onboardCoopBeginner: boolean;
    pickMode: string;
    postPickTimerDuration: number;
    reroll: boolean;
    teamChampionPool: boolean;
};

export type TypeQueueRewards = {
    isChampionPointsEnabled: boolean;
    isIpEnabled: boolean;
    isXpEnabled: boolean;
    partySizeIpRewards: number[];
};

export type TypeSessionTeams = {
    championId: number;
    lastSelectedSkinIndex: number;
    profileIconId: number;
    puuid: string;
    selectedPosition: string;
    selectedRole: string;
    summonerId: number;
    summonerInternalName: string;
    summonerName: string;
    teamOwner: boolean;
    teamParticipantId: number;
};

export type TypeGameDodge = {
    dodgeIds: number[];
    phase: string;
    state: string;
};

export type TypeMap = {
    assets: TypeAssets;
    categorizedContentBundles: object;
    description: string;
    gameMode: string;
    gameModeName: string;
    gameModeShortName: string;
    gameMutator: string;
    id: number;
    isRGM: boolean;
    mapStringId: string;
    name: string;
    perPositionDisallowedSummonerSpells: object;
    perPositionRequiredSummonerSpells: object;
    platformId: string;
    platformName: string;
    properties: TypeProperties;
};

export type TypeAssets = {
    'champ-select-background-sound': string;
    'champ-select-flyout-background': string;
    'champ-select-planning-intro': string;
    'game-select-icon-active': string;
    'game-select-icon-active-video': string;
    'game-select-icon-default': string;
    'game-select-icon-disabled': string;
    'game-select-icon-hover': string;
    'game-select-icon-intro-video': string;
    'gameflow-background': string;
    'gameflow-background-dark': string;
    'gameselect-button-hover-sound': string;
    'icon-defeat': string;
    'icon-defeat-v2': string;
    'icon-defeat-video': string;
    'icon-empty': string;
    'icon-hover': string;
    'icon-leaver': string;
    'icon-leaver-v2': string;
    'icon-loss-forgiven-v2': string;
    'icon-v2': string;
    'icon-victory': string;
    'icon-victory-video': string;
    'map-north': string;
    'map-south': string;
    'music-inqueue-loop-sound': string;
    'parties-background': string;
    'position-assignment-map-intro-north-video': string;
    'position-assignment-map-intro-south-video': string;
    'postgame-ambience-loop-sound': string;
    'ready-check-background': string;
    'ready-check-background-sound': string;
    'sfx-ambience-pregame-loop-sound': string;
    'social-icon-leaver': string;
    'social-icon-victory': string;
    'tutorial-img': string;
};

export type TypeProperties = {
    suppressRunesMasteriesPerks: boolean;
}