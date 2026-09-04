/**
 * Credits: The OpenUwU Project
 * Owners: @priyanshu @prayag
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { config } from "../../../config/config.js";
import { Middleware } from "../../../middlewares/index.js";
import { defineCommand } from "../../../types/index.js";
import { ActionRow, linkButton } from "../../../utils/components.js";

export default defineCommand({
	name: "links",
	description: "various links associated with the bot",
	category: "meta",
	enabledSlash: true,
	slashData: {
		name: "links",
		description: "various links associated with the bot",
	},
	middleware: [Middleware.Cooldown(30)],
	async execute(ctx) {
		await ctx.reply({
			components: [
				ActionRow().addComponents(
					linkButton("documentation", `https://ele1.mintlify.app/`),
					linkButton("invite", `https://discord.com/oauth2/authorize?client_id=${config.clientId}`),
					linkButton("vote for the bot", "https://top.gg/bot/1277525844319014955/vote"),
					linkButton("support server", config.supportLink),
				),
				ActionRow().addComponents(
					linkButton("Privacy Policy", "https://ele1.mintlify.site/legal/privacy"),
					linkButton("Terms of Service", "https://ele1.mintlify.site/legal/terms"),
					linkButton("Copyright", "https://ele1.mintlify.site/legal/copyright"),
					linkButton("GitHub", "https://github.com/openUwU/eleven"),
				),
			],
		});
	},
});
