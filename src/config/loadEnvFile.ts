/**
 * Credits: The OpenUwU Project
 * Owners: @priyanshu @prayag
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const envFilePath = fileURLToPath(new URL("../../.env", import.meta.url));

export function loadProjectEnv(): void {
	if (existsSync(envFilePath)) {
		loadEnvFile(envFilePath);
	}
}
