import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";

export default defineCommand(
    {
        name: "inspect-server",
        description: "Inspect a server.",
        options: [
            {
                name: "id",
                description: "Server id.",
                required: true,
                type: 3
            }
        ],
        async Handle(interaction) {
            await interaction.defer();
            const id = interaction.data.options.getString("id", true);
            const stats = await api.getStatistics(id);
            const str = 
            `## ${stats.data.server_id.server_name}
            - started: ${stats.data.started}
            - running: ${stats.data.running}
            - cpu: ${stats.data.cpu}%
            - mem: ${stats.data.mem}
            - mem usage: ${stats.data.mem_percent}
            - online: ${stats.data.online}
            - waiting start: ${stats.data.waiting_start}
            - version: ${stats.data.version}
            - desc: ${stats.data.desc}
            - players online: ${stats.data.online}
            - max players: ${stats.data.max}
            - players: ${(JSON.parse(stats.data.players) as string[]).join(", ")}
            - world name: ${stats.data.world_name}
            - world size: ${stats.data.world_size}`;
            await interaction.editOriginal({content: str});
        }
    }
);