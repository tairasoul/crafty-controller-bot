import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
export default defineCommand({
    name: "get-webhook",
    description: "Get webhook for a server.",
    options: [
        {
            name: "id",
            description: "Server id.",
            required: true,
            type: 3
        },
        {
            name: "webhook_id",
            description: "Webhook id.",
            required: true,
            type: 3
        }
    ],
    async Handle(interaction) {
        await interaction.defer();
        const id = interaction.data.options.getString("id", true);
        const web = interaction.data.options.getString("webhook_id", true);
        const results = await api.getWebhook(id, web);
        let str = "";
        for (const key of Object.keys(results.data)) {
            const webhook = results.data[key];
            str += `## ${webhook.name} (id ${key})\n`;
            str += `- type: ${webhook.webhook_type}\n`;
            str += `- bot_name: ${webhook.bot_name}\n`;
            str += `- triggers: ${webhook.trigger.split(",").join(", ")}\n`;
            str += `- webhook message: ${webhook.body}\n`;
            str += `- webhook colour: ${webhook.color}\n`;
            str += `- enabled: ${webhook.enabled}`;
        }
        await interaction.editOriginal({ content: str });
    }
});
