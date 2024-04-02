export interface Login {
    status: "ok",
    data: {
        token: string;
        user_id: string;
    }
}

export interface LoginParams {
    username: string;
    password: string;
}

export enum Actions {
    start = "start_server",
    stop = "stop_server",
    restart = "restart_server",
    kill = "kill_server",
    backup = "backup_server",
    update = "update_executable"
}

export interface Server {
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
    type: "minecraft-java" | "minecraft-bedrock"
}

export interface Stats {
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
    int_ping_results: "True" | "False",
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
}