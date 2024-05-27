import { EmbedBuilder } from 'discord.js';

export default {
    name: 'dp!serverout',
    description: 'Rời khỏi server được chỉ định (chỉ dành cho quản trị viên).',
    usage: 'dp!serverout <ID server>',

    async execute(message, args) {
        // Kiểm tra quyền sử dụng (chỉ cho phép user ID cụ thể)
        if (message.author.id !== '1036648969239019520') {
            return message.reply('Bạn không có quyền sử dụng lệnh này.');
        }

        // Kiểm tra xem có cung cấp ID server hay không
        const guildId = args[0];
        if (!guildId) {
            return message.reply('Vui lòng cung cấp ID của server bạn muốn bot rời khỏi.');
        }

        // Tìm server
        const guild = message.client.guilds.cache.get(guildId);
        if (!guild) {
            return message.reply('Không tìm thấy server có ID đó.');
        }

        try {
            // Rời khỏi server
            await guild.leave();

            // Gửi log vào kênh chỉ định
            const logChannel = message.client.channels.cache.get('1243214785441435698');
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000') // Màu đỏ
                    .setTitle('Bot đã rời khỏi server')
                    .setDescription(`Bot đã rời khỏi server **${guild.name}** (ID: ${guild.id}) theo yêu cầu của **${message.author.tag}**.`)
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] });
            } else {
                console.error('Không tìm thấy kênh log.');
            }

            await message.reply(`Bot đã rời khỏi server **${guild.name}** thành công.`);
        } catch (error) {
            console.error('Lỗi khi rời khỏi server:', error);
            message.reply('Đã xảy ra lỗi khi thực hiện lệnh. Vui lòng thử lại.');
        }
    },
};
