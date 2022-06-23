import tmi from 'tmi.js';

export const Commercial = (client: tmi.Client) => {
    client.on('message', (channel: string, tags: tmi.Userstate, message: string, self: boolean) => {
        if (self) return;
        if(message.startsWith("!commercial")) {
            console.log(tags.id, tags.username, tags.badges, tags.turbo);
            const commercialTime = message.split("!commercial ")[1];
            if(!commercialTime) return client.say(channel, `@${tags.username}, please pass a time to run an ad for!`);
            client.commercial(channel, parseInt(commercialTime)).then((result) => {

                return client.say(channel, `@${tags.username} running commercial for ${result[1]} seconds`);
            }).catch((err) => { console.log(err); return client.say(channel, `@${tags.username}, something went wrong couldn't run the commercial for ${commercialTime} seconds!`); })
        }
    });
}