import * as interfaces from "./interfaces.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default class Crafty {
    private API: string;
    private user_id: string = "";
    private token: string = "";
    get loggedIn() {
        return this.user_id != "";
    }

    constructor(api_path: string) {
        this.API = api_path;
    }

    async login(params: interfaces.LoginParams) {
        const request_path = `${this.API}/api/v2/auth/login`;
        const request = await fetch(request_path, {
            method: "POST",
            body: JSON.stringify(params)
        });
        const data = await request.json() as interfaces.Login;
        this.user_id = data.data.user_id;
        this.token = data.data.token;
    }

    async sendAction(id: string, action: interfaces.Actions) {
        const request_path = `${this.API}/api/v2/servers/${id}/action/${action}`;
        await fetch(request_path,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );
    }

    async getServers() {
        const requestPath = `${this.API}/api/v2/servers`;
        const req = await fetch(requestPath, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        const servers = data.data as interfaces.Server[];
        return servers;
    }

    async getStatistics(id: string) {
        const requestPath = `${this.API}/api/v2/servers/${id}/stats`;
        const req = await fetch(requestPath, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        return data.data as interfaces.Stats;
    }

    async sendCommand(id: string, body: string) {
        const request_path = `${this.API}/api/v2/servers/${id}/stdin`;
        await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body
        })
    }
}