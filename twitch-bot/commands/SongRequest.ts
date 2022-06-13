import tmi from 'tmi.js';
import { SearchForSong } from '../api/Search';

interface Song {
    status: string,
    message: string,
    error?: string,
    data: [{
        name: string,
        artist: string,
        duration: number,
        position: number,
    }]
}

export const SongRequest = async (client: tmi.Client) => {
    client.on('message', async (channel: string, tags: tmi.Userstate, message: string, self: boolean) => {
        if(self) return;
        if(message.startsWith("!sr") || message.startsWith("!songrequest")) {
            const song = message.split("!sr ")[1] || message.split("!songrequest ")[1];
            if(!song) client.say(channel, `${tags.username}, please pass a song to request!`);
            try {
                const songData: Song = await SearchForSong(tags['display-name'], channel.replace('#', ''), song);
                if (songData.error) client.say(channel, `${tags['display-name']} -> There was an error requesting that Song! Error: ${songData.error}`);
                else client.say(channel, `${tags['display-name']} -> "${songData.data[0].name}" by ${songData.data[0].artist} has been added to the queue in position #${songData.data[0].position}`);
            } catch(err) { console.log(err); }
        }
    });
};
