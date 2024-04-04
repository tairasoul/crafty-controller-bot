import * as types from "./types.js";
import * as schemas from "./schemas.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function createQueryString(booleans: {[key: string]: boolean}) {
    let query = "\?";
    for (let i = 0; i < Object.keys(booleans).length; i++) {
        const key = Object.keys(booleans)[i];
        const bool = booleans[key];
        if (bool) {
            if (query == "\?") 
                query += `${key}\=${bool}`
            else
                query += `\&${key}\=${bool}`;
        }
    }
    if (query == "\?")
        return ""
    else
        return query;
}

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

    async login(params: types.LoginParams) {
        const request_path = `${this.API}/api/v2/auth/login`;
        const request = await fetch(request_path, {
            method: "POST",
            body: JSON.stringify(params)
        });
        const data = await request.json() as types.Login;
        this.user_id = data.data.user_id;
        this.token = data.data.token;
    }

    async sendAction(server_id: string, action: types.Actions) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/action/${action}`;
        const req = await fetch(request_path,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );
        const data = await req.json();
        return data as types.BasicResponse;
    }

    async getServers() {
        const request_path = `${this.API}/api/v2/servers`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await req.json();
        const servers = data as {status: string; data: types.Server[]};
        return servers;
    }

    async getServer(server_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        const data = await req.json() as types.GetServer_Response;
        return data
    }

    async deleteServer(server_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}`;
        const req = await fetch(request_path, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        const data = await req.json() as types.BasicResponse;
        return data;
    }

    async createServer(serverSchema: schemas.new_server_schema) {
        const request_path = `${this.API}/api/v2/servers`;
        const response = await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(serverSchema)
        })
        const responseBody = await response.json();
        return responseBody as types.CreateServer_Response;
    }

    async getLogs(server_id: string, file = false, colors = false, raw = false, html = false) {
        const query = createQueryString({file, colors, raw, html});
        const request_path = `${this.API}/api/v2/servers/${server_id}/logs${query}`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        const data = await response.json();
        return data as types.GetLogs_Response;
    }

    async createWebhook(server_id: string, webhook: schemas.create_webhook) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "POST",
            body: JSON.stringify(webhook)
        });
        const data = await response.json();
        return data as types.CreateWebhook_Response;
    }

    async modifyWebhook(server_id: string, webhook_id: string, patch: schemas.patch_webhook) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "PATCH",
            body: JSON.stringify(patch)
        })
        const data = await response.json();
        return data as types.BasicResponse;
    }

    async testWebhook(server_id: string, webhook_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "POST"
        })
        const data = await response.json();
        return data as types.BasicResponse;
    }

    async getWebhooks(server_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        return data as types.GetWebhook_Response;
    }

    async getWebhook(server_id: string, webhook_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        return data as types.GetWebhook_Response;
    }

    async deleteWebhook(server_id: string, webhook_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/webhook/${webhook_id}/`;
        const response = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            method: "DELETE"
        });
        const data = await response.json();
        return data as types.BasicResponse;
    }

    async getStatistics(server_id: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/stats`;
        const req = await fetch(request_path, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const data = JSON.parse((await req.text()).replace("False", "false"));
        return data as {status: string; data: types.Stats};
    }

    async sendCommand(server_id: string, body: string) {
        const request_path = `${this.API}/api/v2/servers/${server_id}/stdin`;
        const req = await fetch(request_path, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body
        });
        const data = await req.json();
        return data as types.BasicResponse;
    }

    async importFromZip(zipPath: string, postUnzip: (contents: schemas.import_from_zip) => Promise<any>) {
        const initialRequest = `${this.API}/api/v2/import/file/unzip`;
        const req  = await fetch(initialRequest, {
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
        })
        const initialData = await req.json() as schemas.import_from_zip;
        await postUnzip(initialData);
    }

    async getPublicStats() {
        const request_path = `${this.API}/api/v2/servers/status`;
        const response = await fetch(request_path)
        const data = await response.json();
        return data as schemas.server_statuses;
    }
}