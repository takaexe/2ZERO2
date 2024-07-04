import { formatEmoji as discordFormatEmoji } from "discord.js";
import { settings } from "#settings";
export function icon(name) {
    const animated = name.startsWith(":a:");
    const id = animated
        ? settings.emojis.animated[name.slice(3, name.length)]
        : settings.emojis.static[name];
    const toString = () => discordFormatEmoji(id, animated);
    return { id, animated, toString };
}
