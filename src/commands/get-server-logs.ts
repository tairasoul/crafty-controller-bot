import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
import { ApplicationCommandOptionTypes } from "oceanic.js";

export default defineCommand(
    {
        name: "get-server-logs",
        description: "Get a server's logs.",
        options: [
            {
                name: "id",
                description: "Server id.",
                required: true,
                type: 3
            },
            {
                name: "file",
                description: "Grab the logs from file?",
                required: false,
                type: ApplicationCommandOptionTypes.BOOLEAN
            },
            {
                name: "colors",
                description: "Include color tags?",
                required: false,
                type: ApplicationCommandOptionTypes.BOOLEAN
            },
            {
                name: "raw",
                description: "Grab raw logs?",
                required: false,
                type: ApplicationCommandOptionTypes.BOOLEAN
            }
        ],
        async Handle(interaction) {
            await interaction.defer();
            const id = interaction.data.options.getString("id", true);
            const file = interaction.data.options.getBoolean("file") ?? false;
            const color = interaction.data.options.getBoolean("colors") ?? false;
            const raw = interaction.data.options.getBoolean("raw") ?? false;
            const logs = await api.getLogs(id, file, color, raw);
            const buffer = Buffer.from(logs.data.join("\n"));
            await interaction.editOriginal({files: [
                {
                    name: `server-id-${id}.log`,
                    contents: buffer
                }
            ]});
        }
    }
);