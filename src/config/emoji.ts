/**
 * Credits: The OpenUwU Project
 * Owners: @priyanshu @prayag
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

const emojiDictionary = {
	artist: "<:artist:1522207382049001482>",
	duration_grey: "<:duration_grey:1522207887584264342>",
	more: "<:more:1522197582527463475>",
	play: "<:play:1522222999837610136>",
	drag_up: "<:drag_up:1522206117151637534>",
	drag_down: "<:drag_down:1522206002894864544>",
	remove: "<:removed_queue:1522225114111021076>",
	left: "<:left:1522206910034743296>",
	right: "<:right:1522206671471116318>",
	requester: "<:requester:1522906509565104168>",
	blank: "<:blank:1522903725105090610>",
	info: "<:info:1523171328885264475>",
	check: "<:check:1523170702893514854>",
	cross: "<:cross:1523170590343561216>",
	track: "<:album:1522196613584519231>",
	pause: "<:pause:1522225427559747694>",
	resume: "<:resume:1522225362933780572>",
	stop: "<:stop:1522225546652811324>",
	skip: "<:skip:1522225505791643801>",
} as const;

/** * Extracted type of valid emoji names based on the dictionary keys.
 */
export type EmojiName = keyof typeof emojiDictionary;

/**
 * The emoji utility object.
 */
export const emoji = {
	/**
	 * Retrieves a  emoji by its name.
	 * * @param name - The key of the emoji defined in `emojiDictionary`.
	 * @returns The Discord formatted emoji string. Returns a fallback "❓" if somehow bypassed.
	 */
	get(name: EmojiName): string {
		return emojiDictionary[name] ?? "❓";
	},
};
