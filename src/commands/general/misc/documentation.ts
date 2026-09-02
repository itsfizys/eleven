/**
 * Credits: The OpenUwU Project
 * Owners: @priyanshu @prayag
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { Middleware } from "../../../middlewares/index.js";
import { defineCommand } from "../../../types/index.js";
import { ActionRow, linkButton } from "../../../utils/components.js";

export default defineCommand({
	name: "documentation",
	aliases: ["docs"],
	description: "link to documentation",
	category: "meta",
	enabledSlash: true,
	slashData: {
		name: "documentation",
		description: "link to documentation",
	},
	middleware: [Middleware.Cooldown(30)],
	async execute(ctx) {
		await ctx.reply({
			components: [
				ActionRow().addComponents(linkButton("documentation", `https://ele1.mintlify.app/`)),
			],
		});
	},
});
