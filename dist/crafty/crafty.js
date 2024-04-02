process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default class Crafty {
    API;
    user_id = "";
    token = "";
    get loggedIn() {
        return this.user_id != "";
    }
    constructor(api_path) {
        this.API = api_path;
    }
    async login(params) {
        const request_path = `${this.API}/api/v2/auth/login`;
        const request = await fetch(request_path, {
            method: "POST",
            body: JSON.stringify(params)
        });
        const data = await request.json();
        this.user_id = data.data.user_id;
        this.token = data.data.token;
    }
    async sendAction(id, action) {
        const request_path = `${this.API}/api/v2/servers/${id}/action/${action}`;
        await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
    async getServers() {
        const requestPath = `${this.API}/api/v2/servers`;
        const req = await fetch(requestPath, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        const servers = data.data;
        return servers;
    }
    async getStatistics(id) {
        const requestPath = `${this.API}/api/v2/servers/${id}/stats`;
        const req = await fetch(requestPath, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        return data.data;
    }
    async sendCommand(id, body) {
        const request_path = `${this.API}/api/v2/servers/${id}/stdin`;
        await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body
        });
    }
}
