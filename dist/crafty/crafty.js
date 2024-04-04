process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function createQueryString(booleans) {
    let query = "\?";
    for (let i = 0; i < Object.keys(booleans).length; i++) {
        const key = Object.keys(booleans)[i];
        const bool = booleans[key];
        if (bool) {
            if (query == "\?")
                query += `${key}\=${bool}`;
            else
                query += `\&${key}\=${bool}`;
        }
    }
    if (query == "\?")
        return "";
    else
        return query;
}
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
    async sendAction(server_id, action) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/action/${action}`;
        const req = await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        return data;
    }
    async getServers() {
        const request_path = `${this.API}/api/v2/servers`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        const servers = data;
        return servers;
    }
    async getServer(server_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        return data;
    }
    async deleteServer(server_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}`;
        const req = await fetch(request_path, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        return data;
    }
    async createServer(serverSchema) {
        const request_path = `${this.API}/api/v2/servers`;
        const response = await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(serverSchema)
        });
        const responseBody = await response.json();
        return responseBody;
    }
    async getLogs(server_id, file = false, colors = false, raw = false, html = false) {
        const query = createQueryString({ file, colors, raw, html });
        const request_path = `${this.API}/api/v2/servers/${server_id}/logs${query}`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        return data;
    }
    async createWebhook(server_id, webhook) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "POST",
            body: JSON.stringify(webhook)
        });
        const data = await response.json();
        return data;
    }
    async modifyWebhook(server_id, webhook_id, patch) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "PATCH",
            body: JSON.stringify(patch)
        });
        const data = await response.json();
        return data;
    }
    async testWebhook(server_id, webhook_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "POST"
        });
        const data = await response.json();
        return data;
    }
    async getWebhooks(server_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        return data;
    }
    async getWebhook(server_id, webhook_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        return data;
    }
    async deleteWebhook(server_id, webhook_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "DELETE"
        });
        const data = await response.json();
        return data;
    }
    async getStatistics(server_id) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/stats`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = JSON.parse((await req.text()).replace("False", "false"));
        return data;
    }
    async sendCommand(server_id, body) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/stdin`;
        const req = await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body
        });
        const data = await req.json();
        return data;
    }
    async importFromZip(zipPath, postUnzip) {
        const initialRequest = `${this.API}/api/v2/import/file/unzip`;
        const req = await fetch(initialRequest, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({
                folder: `/crafty/import/manual-import/${zipPath}`,
                page: "import",
                unzip: true,
                upload: false
            })
        });
        const initialData = await req.json();
        await postUnzip(initialData);
    }
    async getPublicStats() {
        const request_path = `${this.API}/api/v2/servers/status`;
        const response = await fetch(request_path);
        const data = await response.json();
        return data;
    }
}
