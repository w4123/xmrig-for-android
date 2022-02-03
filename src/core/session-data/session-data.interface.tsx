export enum StartMode {
    START,
    STOP
}

export enum WorkingState {
    NOT_WORKING = 'Not Working',
    MINING = 'Mining'
}

export interface IXMRigLogEvent {
    log: string[];
}

export interface IHashrateHistory {
    historyCurrent: number[];
    history10s: number[];
    history60s: number[];
    history15m: number[];
    historyMax: number[];
}
