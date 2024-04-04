import defineCommand from "../functions/defineCommand.js";
import { api } from "../bot.js";
import * as builders from "@oceanicjs/builders";
import * as oceanic from "oceanic.js";
export default defineCommand({
    name: "modify-webhook",
    description: "modify a webhook for a server.",
    options: [
        {
            name: "id",
            description: "Server id.",
            required: true,
            type: 3
        },
        {
            name: "webhook_id",
            description: "Webhook id.",
            required: true,
            type: 3
        },
        {
            name: "webhook-type",
            description: "Webhook type.",
            required: false,
            type: 3,
            choices: (() => {
                const choices = [];
                for (const service of ["Discord", "Mattermost", "Slack", "Teams"]) {
                    choices.push({ name: service, value: service });
                }
                return choices;
            })()
        },
        {
            name: "url",
            description: "Webhook url.",
            required: false,
            type: 3
        },
        {
            name: "bot-name",
            description: "Webhook bot name.",
            required: false,
            type: 3
        },
        {
            name: "name",
            description: "Webhook name.",
            required: false,
            type: 3
        },
        {
            name: "body",
            description: "What should be sent to the webhook (in text)?",
            required: false,
            type: 3
        },
        {
            name: "colour",
            description: "Hexadecimal colour for the webhook.",
            required: false,
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
        const webhook = interaction.data.options.getString("webhook_id", true);
        const webhook_type = interaction.data.options.getString("webhook-type");
        const url = interaction.data.options.getString("url");
        const name = interaction.data.options.getString("name");
        const bot_name = interaction.data.options.getString("bot-name");
        const body = interaction.data.options.getString("body");
        const colour = interaction.data.options.getString("colour");
        const enabled = interaction.data.options.getBoolean("enabled") ?? false;
        const initialAsk = new builders.EmbedBuilder();
        initialAsk.setTitle("Would you like to change triggers?");
        const embed = new builders.EmbedBuilder();
        embed.setTitle("What triggers would you like to use?");
        embed.setDescription("Pick from the select menu.");
        const row = new builders.ActionRow();
        const submit_id = `modify-webhook-${interaction.user.id}-complete`;
        const menu_id = `modify-webhook-${interaction.user.id}`;
        const menu = new builders.SelectMenu(oceanic.ComponentTypes.STRING_SELECT, menu_id);
        menu.maxValues = 7;
        menu.addOptions({
            label: "Server Start",
            value: "start_server"
        }, {
            label: "Server Stop",
            value: "stop_server"
        }, {
            label: "Crash Detected",
            value: "crash_detected"
        }, {
            label: "Server Backup",
            value: "backup_server"
        }, {
            label: "Jar Update",
            value: "jar_update"
        }, {
            label: "Command Sent",
            value: "send_command"
        }, {
            label: "Kill Server",
            value: "kill"
        });
        menu.placeholder = "Triggers";
        menu.minValues = 1;
        let trigger;
        const submit = new builders.Button(oceanic.ButtonStyles.SUCCESS, submit_id);
        submit.label = "Submit";
        row.addComponent(menu);
        const row2 = new builders.ActionRow();
        row2.addComponent(submit);
        const client = interaction.client;
        async function modifyWebhook() {
            await api.modifyWebhook(id, webhook, {
                webhook_type,
                url,
                name,
                bot_name,
                trigger,
                body,
                enabled,
                color: colour
            });
            await interaction.createFollowup({ content: `Edited webhook.` });
        }
        const yes_id = `modify-webhook-${interaction.user.id}-yes`;
        const no_id = `modify-webhook-${interaction.user.id}-no`;
        const yes = new builders.Button(oceanic.ButtonStyles.SUCCESS, yes_id);
        yes.label = "Yes";
        const no = new builders.Button(oceanic.ButtonStyles.SUCCESS, no_id);
        no.label = "No";
        const confirmRow = new builders.ActionRow();
        confirmRow.addComponents(yes, no);
        async function handleInteraction(int) {
            if (int.type == oceanic.InteractionTypes.MESSAGE_COMPONENT) {
                if (int.data.customID == menu_id) {
                    const interact = int;
                    trigger = interact.data.values.getStrings();
                    submit.disable();
                    menu.disable();
                    await int.createMessage({ content: `Selected events ${trigger.join(', ')}, editing webhook.` });
                    // @ts-ignore
                    await interaction.editOriginal({ embeds: [embed.toJSON()], components: [row.toJSON(), row2.toJSON()] });
                    client.off("interactionCreate", handleInteraction);
                    await modifyWebhook();
                    return;
                }
                if (int.data.customID == yes_id) {
                    // @ts-ignore
                    await interaction.editOriginal({ embeds: [embed.toJSON()], components: [row.toJSON(), row2.toJSON()] });
                    await int.deferUpdate();
                }
                if (int.data.customID == no_id) {
                    submit.disable();
                    menu.disable();
                    // @ts-ignore
                    await interaction.editOriginal({ embeds: [embed.toJSON()], components: [row.toJSON(), row2.toJSON()] });
                    await int.deferUpdate();
                    await modifyWebhook();
                    client.off("interactionCreate", handleInteraction);
                }
            }
        }
        // @ts-ignore
        await interaction.editOriginal({ embeds: [initialAsk.toJSON()], components: [confirmRow.toJSON()] });
        client.on('interactionCreate', handleInteraction);
    }
});
