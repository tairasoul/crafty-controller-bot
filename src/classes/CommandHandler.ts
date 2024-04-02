import * as oceanic from "oceanic.js";
import * as builders from "@oceanicjs/builders";

export interface Command {
    name: string;
    options?: oceanic.ApplicationCommandOptions[];
    description: string;
    Handle: (interaction: oceanic.CommandInteraction) => any;
}

export interface CommandData {
    formatted: Command;
    raw: builders.ApplicationCommandBuilder;
}

export default class CommandHandler {
    private commands: oceanic.Collection<string, CommandData> = new oceanic.Collection();
    private _client: oceanic.Client;

    constructor(client: oceanic.Client) {
        this._client = client;
        this._client.on("interactionCreate", (i) => {
            const interaction = i as oceanic.CommandInteraction;
            const command = this.commands.get(interaction.data.name);
            if (command) {
                try {
                    command.formatted.Handle(interaction);
                }
                catch (e) {
                    console.error(e);
                }
            }
        })
    }

    async addCommand(command: Command) {
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
            const command = this.commands.get(name) as CommandData;
            // @ts-ignore
            await this._client.application.createGlobalCommand(command.raw);
            console.log('registered ' + name);
        }
    }
}