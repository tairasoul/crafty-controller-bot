type CreateData_Java = {
    create_type: "download_jar";
    download_jar_create_data: {
        type: "Paper" | "Forge" | "Vanilla";
        version: string;
        agree_to_eula: boolean;
        mem_min: number;
        mem_max: number;
        server_properties_port: number;
    };
} | {
    create_type: "import_zip";
    import_zip_create_data: {
        zip_path: string;
        zip_root: string;
        jarfile: string;
        mem_min: number;
        mem_max: number;
        server_properties_port: number;
        agree_to_eula: boolean;
    };
};
type ImportServer_Java = {
    create_type: "import_server";
    import_server_create_data: {
        existing_server_path: string;
        jarfile: string;
        mem_min: number;
        mem_max: number;
        server_properties_port: number;
    };
};
export type new_server_schema = {
    name: string;
    crash_detection: boolean;
    monitoring_type: "minecraft_java";
    minecraft_java_monitoring_data: {
        host: string;
        port: number;
    };
    create_type: "minecraft_java";
    minecraft_java_create_data: CreateData_Java;
} | {
    name: string;
    monitoring_type: "minecraft_java";
    minecraft_java_monitoring_data: {
        host: string;
        port: number;
    };
    create_type: "minecraft_java";
    minecraft_java_create_data: ImportServer_Java;
};
export type Webhook_Trigger = "start_server" | "stop_server" | "crash_detected" | "backup_server" | "jar_update" | "send_command" | "kill";
export type Webhook_Type = "Discord" | "Mattermost" | "Slack" | "Teams";
export type create_webhook = {
    webhook_type: Webhook_Type;
    name: string;
    url: string;
    bot_name: string;
    trigger: Webhook_Trigger[];
    body: string;
    enabled: boolean;
    color: string;
};
export type get_webhook = {
    webhook_type: Webhook_Type;
    name: string;
    url: string;
    bot_name: string;
    trigger: string;
    body: string;
    enabled: boolean;
    color: string;
};
export type patch_webhook = {
    webhook_type?: Webhook_Type;
    name?: string;
    url?: string;
    bot_name?: string;
    trigger?: Webhook_Trigger[];
    body?: string;
    enabled?: boolean;
    color?: string;
};
type Schedule_Action = "start" | "restart" | "stop" | "backup";
export type schedule = {
    name: string;
    enabled: boolean;
    action: Schedule_Action;
    interval: number;
    interval_type: "days" | "hours" | "minutes";
    parent: number | null;
    one_time: boolean;
    cron_string: string;
    delay: number;
} | {
    name: string;
    enabled: boolean;
    action: "command";
    command: string;
    interval: number;
    interval_type: "days" | "hours" | "minutes";
    parent: number | null;
    one_time: boolean;
    cron_string: string;
    delay: number;
};
export type modify_schedule = {
    name?: string;
    enabled?: boolean;
    action?: Schedule_Action;
    interval?: number;
    interval_type?: "days" | "hours" | "minutes";
    parent?: number | null;
    one_time?: boolean;
    cron_string?: string;
    delay?: number;
};
export type import_from_zip = {
    status: string;
    data: {
        root_path: {
            path: string;
            top: boolean;
        };
        [key: string]: {
            path: string;
            dir: boolean;
        };
    };
};
type server_status = {
    id: number;
    world_name: string;
    running: boolean;
    online: number;
    max: number;
    version: string;
    desc: string;
    icon: any;
};
export type server_statuses = {
    status: string;
    data: server_status[];
};
export {};
