import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
export default defineCommand({
    name: "get-webhooks",
    description: "Get webhooks for a server.",
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
        const results = await api.getWebhooks(id);
        let str = "";
        for (const key of Object.keys(results.data)) {
            const webhook = results.data[key];
            str += `## ${webhook.name} (id ${key})\n`;
            str += `- type: ${webhook.webhook_type}\n`;
            str += `- bot_name: ${webhook.bot_name}\n`;
            str += `- triggers: ${webhook.trigger.split(",").join(", ")}\n`;
            str += `- webhook message: ${webhook.body}\n`;
            str += `- webhook colour: ${webhook.color}\n`;
            str += `- enabled: ${webhook.enabled}\n\n`;
        }
        await interaction.editOriginal({ content: str.trim() });
    }
});
