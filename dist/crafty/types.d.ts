import * as schemas from "./schemas.js";
export type Login = {
    status: string;
    data: {
        token: string;
        user_id: string;
    };
};
export type LoginParams = {
    username: string;
    password: string;
};
export declare enum Actions {
    start = "start_server",
    stop = "stop_server",
    restart = "restart_server",
    kill = "kill_server",
    backup = "backup_server",
    update = "update_executable"
}
export type Server = {
    server_id: number;
    created: string;
    server_uuid: string;
    server_name: string;
    path: string;
    backup_path: string;
    executable: string;
    log_path: string;
    execution_command: string;
    auto_start: boolean;
    auto_start_delay: number;
    crash_detection: boolean;
    stop_command: string;
    executable_update_url: string;
    server_ip: string;
    server_port: number;
    logs_delete_after: number;
    type: "minecraft-java" | "minecraft-bedrock";
};
export type Stats = {
    stats_id: number;
    created: string;
    server_id: Server;
    started: string;
    running: boolean;
    cpu: number;
    mem: string;
    mem_percent: number;
    world_name: string;
    world_size: string;
    server_port: number;
    int_ping_results: "True" | "False";
    online: number;
    max: number;
    players: string;
    desc: string;
    version: string;
    updating: boolean;
    waiting_start: boolean;
    first_run: boolean;
    crashed: boolean;
    downloading: boolean;
};
export type CreateServer_Response = {
    status: string;
    data: {
        new_server_id: string;
        new_server_uuid: string;
    };
};
export type CreateWebhook_Response = {
    status: string;
    data: {
        webhook_id: string;
    };
};
export type GetWebhook_Response = {
    status: string;
    data: {
        [key: string]: schemas.get_webhook;
    };
};
export type ScheduleCreate_Response = {
    status: string;
    data: {
        schedule_id: string;
    };
};
export type GetServer_Response = {
    status: string;
    data: {
        role_id: number;
        created: string;
        last_update: string;
        role_name: string;
    };
};
export type BasicResponse = {
    status: string;
};
export type GetLogs_Response = {
    status: string;
    data: string[];
};
