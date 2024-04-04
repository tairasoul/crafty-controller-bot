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
    private commands;
    private _client;
    constructor(client: oceanic.Client);
    addCommand(command: Command): Promise<void>;
    register(): Promise<void>;
}
