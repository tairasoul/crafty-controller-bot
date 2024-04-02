import * as oceanic from "oceanic.js";
import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
export default defineCommand({
    name: "send-command",
    description: "Send a command to the server.",
    options: [
        {
            name: "id",
            description: "Server id.",
            required: true,
            type: oceanic.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "command",
            description: "Command to send.",
            required: true,
            type: oceanic.ApplicationCommandOptionTypes.STRING
        }
    ],
    async Handle(interaction) {
        const id = interaction.data.options.getString("id", true);
        const action = interaction.data.options.getString("command", true);
        await interaction.defer();
        await api.sendCommand(id, action);
        await interaction.editOriginal({
            content: "Sent command " + action + " to server " + id + "."
        });
    }
});
