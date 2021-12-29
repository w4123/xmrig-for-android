export type IPoolState = {
    hostname: string;
    port: number;
    username: string;
    password: string;
}

export type IPool = {
    onChange: (state: IPoolState) => void
}

export {
    MoneroOcean
} from './moneroocean';

export {
    MineXMR
} from './minexmr';

export {
    SupportXMR
} from './supportxmr';

export {
    Nano
} from './nano';

export {
    C3Pool
} from './c3pool';

export {
    XMRPoolEU
} from './xmrpool-eu';

export {
    HashVault
} from './hashvault';