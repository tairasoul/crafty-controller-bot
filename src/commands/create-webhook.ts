import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
import * as schemas from "../crafty/schemas.js";
import * as builders from "@oceanicjs/builders";
import * as oceanic from "oceanic.js";

export default defineCommand(
    {
        name: "create-webhook",
        description: "Create a webhook for a server.",
        options: [
            {
                name: "id",
                description: "Server id.",
                required: true,
                type: 3
            },
            {
                name: "webhook-type",
                description: "Webhook type.",
                required: true,
                type: 3,
                choices: (() => {
                    const choices = [];
                    for (const service of ["Discord", "Mattermost", "Slack", "Teams"]) {
                        choices.push({name: service, value: service});
                    }
                    return choices;
                })()
            },
            {
                name: "url",
                description: "Webhook url.",
                required: true,
                type: 3
            },
            {
                name: "bot-name",
                description: "Webhook bot name.",
                required: true,
                type: 3
            },
            {
                name: "name",
                description: "Webhook name.",
                required: true,
                type: 3
            },
            {
                name: "body",
                description: "What should be sent to the webhook (in text)?",
                required: true,
                type: 3
            },
            {
                name: "colour",
                description: "Hexadecimal colour for the webhook.",
                required: true,
                type: 3
            },
            {
                name: "enabled",
                description: "Should the webhook be enabled by default?",
                required: false,
                type: oceanic.ApplicationCommandOptionTypes.BOOLEAN
            }
        ],
        async Handle(interaction) {
            await interaction.defer();
            const id = interaction.data.options.getString("id", true);
            const webhook_type = interaction.data.options.getString("webhook-type", true) as schemas.Webhook_Type;
            const url = interaction.data.options.getString("url", true);
            const name = interaction.data.options.getString("name", true);
            const bot_name = interaction.data.options.getString("bot-name", true);
            const body = interaction.data.options.getString("body", true);
            const colour = interaction.data.options.getString("colour", true);
            const enabled = interaction.data.options.getBoolean("enabled") ?? false;
            const embed = new builders.EmbedBuilder();
            embed.setTitle("What triggers would you like to use?");
            embed.setDescription("Pick from the select menu.");
            const row = new builders.ActionRow();
            const submit_id = `create-webhook-${interaction.user.id}-complete`;
            const menu_id = `create-webhook-${interaction.user.id}`;
            const menu = new builders.SelectMenu(oceanic.ComponentTypes.STRING_SELECT, menu_id);
            menu.maxValues = 7;
            menu.addOptions(
                {
                    label: "Server Start",
                    value: "start_server"
                },
                {
                    label: "Server Stop",
                    value: "stop_server"
                },
                {
                    label: "Crash Detected",
                    value: "crash_detected"
                },
                {
                    label: "Server Backup",
                    value: "backup_server"
                },
                {
                    label: "Jar Update",
                    value: "jar_update"
                },
                {
                    label: "Command Sent",
                    value: "send_command"
                },
                {
                    label: "Kill Server",
                    value: "kill"
                }
            );
            menu.placeholder = "Triggers";
            menu.minValues = 1;
            let selected: schemas.Webhook_Trigger[];
            const submit = new builders.Button(oceanic.ButtonStyles.SUCCESS, submit_id);
            submit.label = "Submit";
            row.addComponent(menu);
            const row2 = new builders.ActionRow();
            row2.addComponent(submit);
            const client = interaction.client;
            async function createWebhook() {
                const response = await api.createWebhook(id, {
                    webhook_type,
                    url,
                    name,
                    bot_name,
                    trigger: selected,
                    body,
                    enabled,
                    color: colour
                });
                await interaction.createFollowup({content: `Created webhook with id ${response.data.webhook_id}.`})
            }

            async function handleInteraction(int: oceanic.ClientEvents["interactionCreate"][0]) {
                if (int.type == oceanic.InteractionTypes.MESSAGE_COMPONENT) {
                    if (int.data.customID == menu_id) {
                        const interact = int as oceanic.ComponentInteraction<oceanic.ComponentTypes.STRING_SELECT>;
                        selected = interact.data.values.getStrings() as schemas.Webhook_Trigger[];
                        submit.disable();
                        menu.disable();
                        await int.createMessage({content: `Selected events ${selected.join(', ')}, creating webhook.`});
                        // @ts-ignore
                        await interaction.editOriginal({embeds: [embed.toJSONRaw()], components: [row.toJSON(), row2.toJSON()]});
                        client.off("interactionCreate", handleInteraction);
                        await createWebhook();
                    }
                }
            }
            // @ts-ignore
            await interaction.editOriginal({embeds: [embed.toJSONRaw()], components: [row.toJSON(), row2.toJSON()]});
            client.on('interactionCreate', handleInteraction);
        }
    }
);