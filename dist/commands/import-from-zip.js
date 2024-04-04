import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
import fs from "fs";
import { ApplicationCommandOptionTypes } from "oceanic.js";
export default defineCommand({
    name: "import-from-zip",
    description: "Create a server from zip. Root path of zip must contain server files.",
    options: [
        {
            name: "zip",
            required: true,
            description: "The server's zip file url.",
            type: ApplicationCommandOptionTypes.STRING
        },
        {
            name: "zip-name",
            required: true,
            description: "The name to save the zip file under. Add .zip, .rar or .7z manually.",
            type: ApplicationCommandOptionTypes.STRING
        },
        {
            name: "mem_max",
            required: true,
            description: "The max memory used.",
            type: ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "mem_min",
            required: true,
            description: "The min memory used.",
            type: ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "jarfile",
            required: true,
            description: "The file Crafty Controller should run to run the server.",
            type: ApplicationCommandOptionTypes.STRING
        },
        {
            name: "name",
            required: true,
            description: "The server name.",
            type: ApplicationCommandOptionTypes.STRING
        }
    ],
    async Handle(interaction) {
        await interaction.defer();
        const upload = interaction.data.options.getString("zip", true);
        const zip_name = interaction.data.options.getString("zip-name", true);
        const mem_max = interaction.data.options.getNumber("mem_max", true);
        const mem_min = interaction.data.options.getNumber("mem_min", true);
        const jarfile = interaction.data.options.getString("jarfile", true);
        const name = interaction.data.options.getString("name", true);
        const crafty_path = `/home/${process.env.USER}/crafty/import-link`;
        await interaction.editOriginal({ content: "Grabbing URL." });
        const data = await fetch(upload);
        await interaction.editOriginal({ content: "Writing data to disk." });
        const buffer = Buffer.from(await data.arrayBuffer());
        fs.writeFileSync(`${crafty_path}/${zip_name}`, buffer);
        await interaction.editOriginal({ content: "Importing zip." });
        await api.importFromZip(zip_name, async (contents) => {
            await interaction.editOriginal({ content: "Creating server." });
            const response = await api.createServer({
                create_type: "minecraft_java",
                minecraft_java_create_data: {
                    create_type: "import_server",
                    import_server_create_data: {
                        existing_server_path: contents.data.root_path.path,
                        jarfile,
                        mem_max,
                        mem_min,
                        server_properties_port: 25565
                    }
                },
                minecraft_java_monitoring_data: {
                    host: "127.0.0.1",
                    port: 25565
                },
                monitoring_type: "minecraft_java",
                name
            });
            await interaction.editOriginal({ content: `Server created! Id: ${response.data.new_server_id}` });
        });
    }
});
