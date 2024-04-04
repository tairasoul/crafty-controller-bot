import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";

export default defineCommand(
    {
        name: "delete-server",
        description: "Delete a server.",
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
            await api.deleteServer(id);
            await interaction.editOriginal({content: `Deleted server with id ${id}.`});
        }
    }
);