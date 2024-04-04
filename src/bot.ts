import * as oceanic from "oceanic.js";
import Crafty from "./crafty/crafty.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import CommandHandler, { Command } from "./classes/CommandHandler.js";
const __dirname = path.dirname(decodeURIComponent(fileURLToPath(import.meta.url)));

export const { token, crafty, ip } = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8'));

export const api = new Crafty(ip)

const client = new oceanic.Client(
    {
        auth: `Bot ${token}`,
        gateway: {
            intents: [
                "ALL"
            ]
        }
    }
);

const handler = new CommandHandler(client);

const commandDir = path.join(__dirname, "commands");

async function handleFile(file: string) {
    const imported = await import(`file://${file}`).then(m => m.default) as Command;
    await handler.addCommand(imported);
}

client.on("ready", async () => {
    const commands = fs.readdirSync(commandDir);
    for (const command of commands) {
        const file = `${commandDir}/${command}`;
        await handleFile(file);
    }
    console.log("logging in to crafty");
    await api.login(crafty);
    console.log("registering commands");
    await handler.register();
    console.log('registered commands.');
})

client.connect();