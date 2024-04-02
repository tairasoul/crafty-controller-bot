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
            `## ${stats.server_id.server_name}
            - started: ${stats.started}
            - running: ${stats.running}
            - cpu: ${stats.cpu}%
            - mem: ${stats.mem}
            - mem usage: ${stats.mem_percent}
            - online: ${stats.online}
            - waiting start: ${stats.waiting_start}
            - version: ${stats.version}
            - desc: ${stats.desc}
            - players online: ${stats.online}
            - max players: ${stats.max}
            - players: ${(JSON.parse(stats.players) as string[]).join(", ")}
            - world name: ${stats.world_name}
            - world size: ${stats.world_size}`;
            await interaction.editOriginal({content: str});
        }
    }
);