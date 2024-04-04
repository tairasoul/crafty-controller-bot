import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";

export default defineCommand(
    {
        name: "get-servers",
        description: "Get all servers.",
        async Handle(interaction) {
            await interaction.defer();
            const data = await api.getServers();
            let str = "";
            for (const server of data.data) {
                str += `## ${server.server_name} (id ${server.server_id})\n`;
                str += `- type: ${server.type}\n\n`;
            }
            str = str.trim();
            await interaction.editOriginal({content: str});
        }
    }
);