export enum StartMode {
    START,
    REBANCH,
    STOP
}

export enum WorkingState {
    NOT_WORKING = "Not Working",
    MINING = "Mining",
    BENCHMARKING = "Benchmarking"
}

export interface IXMRigLogEvent {
    log: string[];
}

export interface IMinerLog {
    ts?: string;
    module?: string;
    message: string;
}