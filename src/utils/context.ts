export class Config {
    constructor(secret: string, client_id: string) {
        this.secret_token = secret
        this.client_id = client_id
    }
    secret_token: string
    client_id: string
}

export function setConfig(): Config {
    return new Config(process.env.SECRET_TOKEN!, process.env.CLIENT_ID!)
}