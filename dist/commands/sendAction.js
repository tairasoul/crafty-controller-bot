import * as oceanic from "oceanic.js";
import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
import { Actions } from "../crafty/interfaces.js";
export default defineCommand({
    name: "send-action",
    description: "Send an action to the server.",
    options: [
        {
            name: "id",
            description: "Server id.",
            required: true,
            type: oceanic.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "action",
            description: "Action to send.",
            required: true,
            type: oceanic.ApplicationCommandOptionTypes.STRING,
            choices: (() => {
                const keys = Object.keys(Actions);
                const ret = [];
                for (const key of keys) {
                    ret.push({
                        name: key,
                        value: key
                    });
                }
                return ret;
            })()
        }
    ],
    async Handle(interaction) {
        const id = interaction.data.options.getString("id", true);
        const action = interaction.data.options.getString("action", true);
        await interaction.defer();
        await api.sendAction(id, Actions[action]);
        await interaction.editOriginal({
            content: "Sent action " + Actions[action] + " to server " + id + "."
        });
    }
});
