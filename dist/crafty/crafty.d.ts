import * as types from "./types.js";
import * as schemas from "./schemas.js";
export default class Crafty {
    private API;
    private user_id;
    private token;
    get loggedIn(): boolean;
    constructor(api_path: string);
    login(params: types.LoginParams): Promise<void>;
    sendAction(server_id: string, action: types.Actions): Promise<types.BasicResponse>;
    getServers(): Promise<{
        status: string;
        data: types.Server[];
    }>;
    getServer(server_id: string): Promise<types.GetServer_Response>;
    deleteServer(server_id: string): Promise<types.BasicResponse>;
    createServer(serverSchema: schemas.new_server_schema): Promise<types.CreateServer_Response>;
    getLogs(server_id: string, file?: boolean, colors?: boolean, raw?: boolean, html?: boolean): Promise<types.GetLogs_Response>;
    createWebhook(server_id: string, webhook: schemas.create_webhook): Promise<types.CreateWebhook_Response>;
    modifyWebhook(server_id: string, webhook_id: string, patch: schemas.patch_webhook): Promise<types.BasicResponse>;
    testWebhook(server_id: string, webhook_id: string): Promise<types.BasicResponse>;
    getWebhooks(server_id: string): Promise<types.GetWebhook_Response>;
    getWebhook(server_id: string, webhook_id: string): Promise<types.GetWebhook_Response>;
    deleteWebhook(server_id: string, webhook_id: string): Promise<types.BasicResponse>;
    getStatistics(server_id: string): Promise<{
        status: string;
        data: types.Stats;
    }>;
    sendCommand(server_id: string, body: string): Promise<types.BasicResponse>;
    importFromZip(zipPath: string, postUnzip: (contents: schemas.import_from_zip) => Promise<any>): Promise<void>;
    getPublicStats(): Promise<schemas.server_statuses>;
}
