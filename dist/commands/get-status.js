import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
export default defineCommand({
    name: "get-status",
    description: "Get all statuses.",
    async Handle(interaction) {
        await interaction.defer();
        let str = "";
        const statistics = await api.getPublicStats();
        for (const statistic of statistics.data) {
            str += `## ${statistic.world_name} (id ${statistic.id})\n`;
            str += `- running: ${statistic.running}\n`;
            str += `- online: ${statistic.online}\n`;
            str += `- max: ${statistic.max}\n`;
            str += `- version: ${statistic.version}\n`;
            str += `- desc: ${statistic.desc}\n\n`;
        }
        await interaction.editOriginal({ content: str.trim() });
    }
});
