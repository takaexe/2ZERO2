import { ActivityType } from "discord.js";
export function setSongStatus(client, track) {
    client.user.setActivity({
        name: track.title,
        type: ActivityType.Listening
    });
}
