import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import handleCommands from './commandHandler.mjs'; // Import the command handler

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

let startTime;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('idle');
    updateActivity();

    startTime = Date.now();

    setInterval(() => {
        const currentTime = Date.now();
        const uptime = Math.floor((currentTime - startTime) / 1000);
        console.log(`Bot has been online for ${uptime} seconds`);
    }, 10000);
});

function updateActivity() {
    const guildCount = client.guilds.cache.size;
    client.user.setActivity({
        name: `with ${guildCount} servers`,
        type: ActivityType.Playing,
    });
}

client.on('guildCreate', (guild) => {
    updateActivity();
    const guildCount = client.guilds.cache.size;
    console.log(`Bot joined: Now in ${guildCount} servers`);

    const channelId = '1243214785441435698';
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send(`Dump#9716 has joined the server **${guild.name}** (ID: ${guild.id}). The bot is now in ${guildCount} servers.`);
    } else {
        console.error(`Could not find the channel with ID ${channelId}`);
    }
});

client.on('guildDelete', (guild) => {
    updateActivity();
    const guildCount = client.guilds.cache.size;
    console.log(`Bot left: Now in ${guildCount} servers`);

    const channelId = '1243214785441435698';
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send(`Dump#9716 has been removed from the server **${guild.name}** (ID: ${guild.id}). The bot is now in ${guildCount} servers.`);
    } else {
        console.error(`Could not find the channel with ID ${channelId}`);
    }
});

(async () => {
    await handleCommands(client);
    client.login('YOUR_BOT_DISCORD_TOKEN');
})();