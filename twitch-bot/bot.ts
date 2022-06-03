require('dotenv').config();
import tmi from 'tmi.js';
import { Gamble } from './commands/Gamble';
import { SongRequest } from './commands/SongRequest';
import { Commercial } from './commands/Commercial';


const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.bot_username,
        password: `oauth:${process.env.oauth_token}`,
    },
    channels: ['Louiee_tv']
});
client.connect().catch(console.error);


export const main = (client: tmi.Client) => {
    Commercial(client);
    Gamble(client);
    SongRequest(client);
}

main(client);



