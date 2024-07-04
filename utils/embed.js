import { settings } from "#settings";
import { createEmbed } from "@magicyan/discord";
export const res = Object.create({}, Object.entries(settings.colors)
    .reduce((obj, [name, color]) => ({ ...obj,
    [name]: {
        enumerable: true, writable: false,
        value(description, options) {
            const embed = createEmbed({ color, description });
            if (options && "embeds" in options && Array.isArray(options.embeds)) {
                options.embeds.unshift(embed);
            }
            const defaults = { fetchReply: true, ephemeral: true, embeds: [embed] };
            return Object.assign(defaults, options);
        }
    }
}), {}));
