import * as oceanic from "oceanic.js";
import * as builders from "@oceanicjs/builders";
export default class CommandHandler {
    commands = new oceanic.Collection();
    _client;
    constructor(client) {
        this._client = client;
        this._client.on("interactionCreate", (i) => {
            const interaction = i;
            const command = this.commands.get(interaction.data.name);
            if (command) {
                try {
                    command.formatted.Handle(interaction);
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
    }
    async addCommand(command) {
        const builder = new builders.ApplicationCommandBuilder(1, command.name);
        for (const option of command.options ?? []) {
            builder.addOption(option);
        }
        builder.setDescription(command.description);
        builder.setDMPermission(false);
        this.commands.set(command.name, {
            formatted: command,
            raw: builder
        });
    }
    async register() {
        for (const name of this.commands.keys()) {
            const command = this.commands.get(name);
            // @ts-ignore
            await this._client.application.createGlobalCommand(command.raw);
            console.log('registered ' + name);
        }
    }
}
