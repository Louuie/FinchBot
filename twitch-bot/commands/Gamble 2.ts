import tmi from 'tmi.js';


export const Gamble = (client: tmi.Client) => {
    client.on('message', (channel: string, tags: tmi.Userstate, message: string, self: boolean) => {
        if(self) return;
        if(message.startsWith("!gamble")) {
            var balance = 100;
            const arg = message.split("!gamble ")[1];
            const num1 = Math.random();
            const num2 = Math.random();
            if(!arg) return client.say(channel, `@${tags.username}, please pass the amount of points you would like to gamble!`);
            if(parseInt(arg) > balance) return client.say(channel, `@${tags.username}, you do not have ${arg} points to gamble!`);
            if(num1 > num2) {
                balance *= 2;
                return client.say(channel, `@${tags.username}, nice you won! you now have ${balance} points!`);
            }
            if(num1 < num2) {
                balance -= parseInt(arg);
                return client.say(channel, `@${tags.username}, Sadge you lost, you now have ${balance} points`);
            }
            if(num1 === num2) {
                balance *= 10;
                return client.say(channel, `@${tags.username}, nice you won the jackpot!!! you now have ${balance} points!`);
            }
        }
        
    });
};

