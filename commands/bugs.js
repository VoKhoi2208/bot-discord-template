import { EmbedBuilder } from 'discord.js';

export default {
    name: 'dp!bugs',
    description: 'Report a bug.',

    async execute(message, args) {
        const bugContent = args.join(' ') || 'No description provided';
        const bugReportChannelId = '1243592676670967859';

        // Construct the bug report embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🐞 Bug Report') // Added a bug emoji for visual appeal
            .setColor('#FF0000')
            .addFields([
                { name: 'Server', value: message.guild.name, inline: true },
                { name: 'Server ID', value: message.guild.id, inline: true },
                { name: 'User', value: message.author.username, inline: true },
                { name: 'User ID', value: message.author.id, inline: true },
                { name: 'Description', value: bugContent }
            ])
            .setTimestamp();

        // Fetch the bug report channel
        const homeGuild = message.client.guilds.cache.get('975602493700575303'); // Replace with your actual guild ID
        if (!homeGuild) {
            return message.reply('Không tìm thấy server chính.');
        }

        const bugReportChannel = homeGuild.channels.cache.get(bugReportChannelId);
        if (!bugReportChannel) {
            return message.reply('Không tìm thấy kênh báo cáo lỗi.');
        }

        try {
            await bugReportChannel.send({ embeds: [embed] });
            message.reply('Báo cáo lỗi của bạn đã được gửi thành công.');
        } catch (error) {
            console.error('Lỗi khi gửi báo cáo lỗi:', error);
            message.reply('Đã xảy ra lỗi khi gửi báo cáo lỗi. Vui lòng thử lại.');
        }
    }
};
