import tmi from 'tmi.js';
import { SearchForSong } from '../api/Search';

interface Song {
    title: string,
    channel: string
}

export const SongRequest = async (client: tmi.Client) => {
    client.on('message', async (channel: string, tags: tmi.Userstate, message: string, self: boolean) => {
        if(self) return;
        if(message.startsWith("!sr") || message.startsWith("!songrequest")) {
            const song = message.split("!sr ")[1] || message.split("!songrequest ")[1];
            if(!song) client.say(channel, `${tags.username}, please pass a song to request!`);
            try {
                const songData: Song = await SearchForSong(song);
                client.say(channel, `${tags.username}, "${songData.title}" from ${songData.channel} has been added to the queue!`);
            } catch(err) { console.log(err); }
        }
    });
};
