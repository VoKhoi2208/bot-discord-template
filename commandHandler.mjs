import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Helper to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
    client.commands = new Map();

    const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const commandPath = pathToFileURL(join(__dirname, 'commands', file)).href;
        try {
            const { default: command } = await import(commandPath);
            if (!command.name) {
                console.error(`Lệnh từ file ${file} không có thuộc tính 'name'.`);
                continue;
            }
            client.commands.set(command.name, command);
        } catch (error) {
            console.error(`Lỗi khi import lệnh từ file ${file}:`, error);
        }
    }

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (client.commands.has(commandName)) {
            const command = client.commands.get(commandName);

            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('Lỗi xử lý cấu lệnh!');
            }
            return; // Skip the AFK check for the command message
        }

        // Check if the user is AFK and remove the AFK status
        const member = message.member;
        if (global.afkUsers && global.afkUsers.has(member.id)) {
            const afkData = global.afkUsers.get(member.id);
            await member.setNickname(afkData.oldNickname).catch(console.error);
            global.afkUsers.delete(member.id);
            message.reply('Hello friend!Đã lâu không gặp.');
        }
    });

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const mentionedMembers = message.mentions.members;
        if (!mentionedMembers) return;

        mentionedMembers.forEach(member => {
            if (global.afkUsers && global.afkUsers.has(member.id)) {
                const afkData = global.afkUsers.get(member.id);
                message.reply(`Người này đang AFK. Reason: ${afkData.content}`);
            }
        });
    });
};