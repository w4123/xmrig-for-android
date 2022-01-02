import _ from 'lodash'
import { config as configJson } from "./config"
import base64 from 'react-native-base64'

type Pool = {
    user: string;
    pass: string;
    url: string;
    tls: boolean;
}

export default class ConfigBuilder {

    config: Record<string, any> = _.cloneDeep(configJson)

    reset() {
        this.config = _.cloneDeep(configJson)
    }

    setPool(pool: Partial<Pool>) {
        this.config = {
            ...this.config,
            ...{
                pools: [
                    {
                        ...this.config.pools[0],
                        ...pool
                    }
                ]
            }
        }
    }

    setProps(props: Record<string, any>) {
        this.config = _.merge(
            this.config,
            props
        )
    }

    getConfigString() {
        return JSON.stringify(this.config)
    }

    getConfigBase64() {
        return base64.encode(this.getConfigString());
    }

}