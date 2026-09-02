/**
 * Credits: The OpenUwU Project
 * Owners: @priyanshu @prayag
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { type Client, MessageFlags } from "discord.js";
import { config } from "../../../config/config.js";
import { PremiumConfig } from "../../../config/premium.js";
import type { BotClient } from "../../../core/BotClient.js";
import { Middleware } from "../../../middlewares/index.js";
import { premiumService } from "../../../services/premium.js";
import { defineCommand } from "../../../types/index.js";
import {
	ActionRow,
	baseSection,
	dangerButton,
	defContainer,
	errorContainer,
	linkButton,
	primaryButton,
	Separator,
	secondaryButton,
	TextDisplay,
} from "../../../utils/components.js";
import { logger } from "../../../utils/logger.js";

type View = "status" | "servers";
export async function resolveGuildNames(
	client: BotClient,
	guildIds: string[],
): Promise<Record<string, string>> {
	if (guildIds.length === 0) return {};

	const cluster = client.cluster;
	const clusterLabel = cluster ? `Cluster ${cluster.id}` : "Standalone";

	if (!cluster) {
		const map: Record<string, string> = {};
		for (const id of guildIds) {
			try {
				let guild = client.guilds.cache.get(id);
				if (guild) {
					logger.debug("PREMIUM", `[${clusterLabel}] Cache HIT for guild ${id} (${guild.name})`);
				} else {
					logger.debug("PREMIUM", `[${clusterLabel}] Cache MISS for guild ${id}. Hitting API...`);
					// biome-ignore lint/performance/noAwaitInLoops: required
					guild = await client.guilds
						.fetch({ guild: id, withCounts: false })
						.catch(() => undefined);
				}
				if (guild) map[id] = guild.name;
			} catch {
				/* empty */
			}
		}
		return map;
	}

	try {
		const results = await cluster.broadcastEval(
			async (clusterClient: Client, context: { guildIds: string[] }) => {
				const found: Record<string, { name: string; hit: boolean }> = {};

				for (const id of context.guildIds) {
					const guild = clusterClient.guilds.cache.get(id);
					if (guild) {
						found[id] = { name: guild.name, hit: true };
						continue;
					}

					const shardId = Number(BigInt(id) >> 22n) % (clusterClient.options.shardCount ?? 1);
					const ownsShard = Array.isArray(clusterClient.options.shards)
						? clusterClient.options.shards.includes(shardId)
						: false;

					if (ownsShard) {
						// biome-ignore lint/performance/noAwaitInLoops: required
						const fetchedGuild = await clusterClient.guilds
							.fetch({ guild: id, withCounts: false })
							.catch(() => null);
						if (fetchedGuild) {
							found[id] = { name: fetchedGuild.name, hit: false };
						}
					}
				}
				return found;
			},
			{ context: { guildIds } },
		);

		const merged: Record<string, string> = {};

		for (const clusterResult of results) {
			if (!clusterResult || typeof clusterResult !== "object") continue;

			for (const [id, data] of Object.entries(clusterResult)) {
				const payload = data as { name: string; hit: boolean };

				if (payload.hit) {
					logger.debug("PREMIUM", `[${clusterLabel}] Cache HIT for guild ${id} (${payload.name})`);
				} else {
					logger.debug(
						"PREMIUM",
						`[${clusterLabel}] Cache MISS for guild ${id}. API fetch success (${payload.name})`,
					);
				}

				merged[id] = payload.name;
			}
		}
		return merged;
	} catch (error) {
		logger.error("PREMIUM", `Cluster broadcast error while resolving guild names: ${error}`);
		return {};
	}
}

async function buildStatusContainer(userId: string, guildId: string) {
	const [user, server] = await Promise.all([
		premiumService.getUserPremium(userId),
		premiumService.getServer(guildId),
	]);

	const container = defContainer();
	container.addTextDisplayComponents(TextDisplay("## Premium Status"));
	container.addSeparatorComponents(Separator(true));

	if (user) {
		const tier = PremiumConfig.getTier(user.tier);
		container.addTextDisplayComponents(TextDisplay(`- **Your Premium**`));
		container.addSectionComponents(
			baseSection()
				.addTextDisplayComponents(TextDisplay(`> -# \`${tier?.name ?? user.tier} Plan\` ongoing`))
				.setButtonAccessory(secondaryButton("My Servers", "premium_view_servers")),
		);
	} else {
		container.addSectionComponents(
			baseSection()
				.addTextDisplayComponents(TextDisplay("> -# No active premium plan"))
				.setButtonAccessory(linkButton("Buy Premium", config.supportLink)),
		);
	}

	container.addSeparatorComponents(Separator());

	if (server && server.activatedBy === userId) {
		container.addTextDisplayComponents(TextDisplay(`- **Server Premium**`));
		container.addSectionComponents(
			baseSection()
				.addTextDisplayComponents(
					TextDisplay(`> -# \`Active Plan\`\n> -# Activated by: <@${server.activatedBy}>`),
				)
				.setButtonAccessory(dangerButton("Deactivate", "premium_deactivate_server")),
		);
	} else if (server) {
		container.addTextDisplayComponents(
			TextDisplay(`> -# \`Active Plan\`\n> -# Activated by: <@${server.activatedBy}>`),
		);
	} else if (user) {
		container.addSectionComponents(
			baseSection()
				.addTextDisplayComponents(TextDisplay("> -# No active premium server plan"))
				.setButtonAccessory(primaryButton("Activate", "premium_activate_server")),
		);
	} else {
		container.addSectionComponents(
			baseSection()
				.addTextDisplayComponents(TextDisplay("> -# No active premium server plan"))
				.setButtonAccessory(linkButton("Buy Premium", config.supportLink)),
		);
	}

	return container;
}

async function buildServersContainer(client: BotClient, userId: string) {
	const servers = await premiumService.getActiveServersFor(userId);

	const container = defContainer();
	container.addTextDisplayComponents(TextDisplay("## Your Activated Servers"));
	container.addSeparatorComponents(Separator(true));

	if (servers.length === 0) {
		container.addTextDisplayComponents(TextDisplay("No servers activated"));
	} else {
		const names = await resolveGuildNames(
			client,
			servers.map((s) => s.id),
		);

		logger.debug("PREMIUM", `resolved ${Object.keys(names).length} guild names`);

		for (const server of servers) {
			const name = names[server.id] ?? server.id;
			logger.debug("PREMIUM", `resolved guild name for ${server.id}, got ${name}`);
			container.addSectionComponents(
				baseSection()
					.addTextDisplayComponents(TextDisplay(`${name}`))
					.setButtonAccessory(dangerButton("Remove", `premium_deactivate_remote_${server.id}`)),
			);
		}
	}

	container.addSeparatorComponents(Separator());
	const backRow = ActionRow();
	backRow.addComponents(secondaryButton("Back", "premium_view_status"));
	container.addActionRowComponents(backRow);

	return container;
}

async function buildContainer(client: BotClient, view: View, userId: string, guildId: string) {
	if (view === "servers") return buildServersContainer(client, userId);
	return buildStatusContainer(userId, guildId);
}

export default defineCommand({
	name: "premium",
	aliases: ["prem"],
	description: "View and manage premium status",
	category: "meta",
	enabledSlash: true,
	slashData: {
		name: "premium",
		description: "View and manage premium status",
	},
	middleware: [Middleware.GuildOnly(), Middleware.Cooldown(30)],
	async execute(ctx) {
		const userId = ctx.member.id;
		const guildId = ctx.guild.id;

		let view: View = "status";

		const message = await ctx.reply({
			components: [await buildContainer(ctx.client, view, userId, guildId)],
			flags: MessageFlags.IsComponentsV2,
		});

		const collector = message.createMessageComponentCollector({
			time: 120_000,
		});

		collector.on("collect", async (interaction) => {
			if (interaction.user.id !== userId) {
				await interaction.reply({
					components: [errorContainer("Not Authorized", "You are not authorized to do this.")],
					flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
				});
				return;
			}

			const id = interaction.customId;

			if (id === "premium_view_servers") {
				view = "servers";
				await interaction.update({
					components: [await buildContainer(ctx.client, view, userId, guildId)],
				});
				return;
			}

			if (id === "premium_view_status") {
				view = "status";
				await interaction.update({
					components: [await buildContainer(ctx.client, view, userId, guildId)],
				});
				return;
			}

			if (id === "premium_activate_server") {
				const result = await premiumService.activateServer(guildId, userId);
				if (!result.success) {
					await interaction.reply({
						components: [errorContainer("Activation Failed", result.error)],
						flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
					});
					return;
				}
			}

			if (id === "premium_deactivate_server") {
				const result = await premiumService.deactivateServer(guildId, userId);
				if (!result.success) {
					await interaction.reply({
						components: [errorContainer("Deactivation Failed", result.error ?? "Unknown error")],
						flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
					});
					return;
				}
			}

			if (id.startsWith("premium_deactivate_remote_")) {
				const targetGuildId = id.replace("premium_deactivate_remote_", "");
				const result = await premiumService.deactivateServer(targetGuildId, userId);
				if (!result.success) {
					await interaction.reply({
						components: [errorContainer("Deactivation Failed", result.error ?? "Unknown error")],
						flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
					});
					return;
				}
			}

			await interaction.update({
				components: [await buildContainer(ctx.client, view, userId, guildId)],
			});
		});

		collector.on("end", async () => {
			try {
				await message.edit({
					components: [await buildContainer(ctx.client, view, userId, guildId)],
				});
			} catch {
				// empty
			}
		});
	},
});
