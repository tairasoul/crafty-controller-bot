import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
export default defineCommand({
    name: "test-webhook",
    description: "Test a webhook for a server.",
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
        const webhook_id = interaction.data.options.getString("webhook_id", true);
        await api.testWebhook(id, webhook_id);
        await interaction.editOriginal({ content: "Sent webhook test request. Check the channel the webhook was created in." });
    }
});
