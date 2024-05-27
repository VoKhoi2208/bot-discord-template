import { PermissionsBitField, ChannelType, TextChannel, EmbedBuilder } from 'discord.js';

export default {
    name: 'dp!nuke',
    description: 'Xóa tất cả các kênh trong server và tạo lại chúng (cần xác nhận).',
    usage: 'dp!nuke',

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Bạn không có quyền sử dụng lệnh này.');
        }

        const confirmationCode = Math.floor(1000 + Math.random() * 9000);

        const confirmationMessage = await message.reply(
            `Bạn có chắc chắn muốn nuke server này? Hành động này sẽ xóa tất cả các kênh (trừ các kênh quan trọng) và tạo lại chúng. Để xác nhận, hãy nhập mã sau: \`${confirmationCode}\``
        );

        const filter = (m) => m.author.id === message.author.id && m.content === confirmationCode.toString();
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 }); 

        collector.on('collect', async () => {
            const oldChannels = message.guild.channels.cache.filter(channel => {
                return channel.type !== ChannelType.GuildCategory &&
                       !channel.name.includes('rules') &&
                       !channel.name.includes('guidelines');
            });

            await Promise.all(oldChannels.map(channel => channel.delete().catch(console.error)));

            try {
                for (const [channelId, channel] of oldChannels) {
                    const newChannel = await message.guild.channels.create({
                        name: channel.name,
                        type: channel.type,
                        parent: channel.parent,
                        position: channel.rawPosition,
                        topic: channel.topic,
                        nsfw: channel.nsfw,
                        bitrate: channel.bitrate,
                        userLimit: channel.userLimit,
                        rateLimitPerUser: channel.rateLimitPerUser,
                        permissionOverwrites: channel.permissionOverwrites.cache,
                    });

                    if (newChannel instanceof TextChannel) {
                        const successMessage = await newChannel.send('Nuke thành công! Kênh này đã được tạo lại.');
                        setTimeout(() => successMessage.delete(), 10000); 
                    }
                }

                const guildOwner = await message.guild.fetchOwner();

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Automatic Message" })
                    .setTitle(":warning: Cảnh báo :warning:")
                    .setDescription(
                        `Server **${message.guild.name}** (ID: \`${message.guild.id}\`) đã bị nuke (xóa và tạo lại kênh).\n` +
                        `Người thực hiện: **${message.author.tag}** (ID: \`${message.author.id}\`) vào lúc ${message.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}` 
                    )
                    .setColor("#bd0000")
                    .setFooter({
                        text: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp();

                await guildOwner.send({ embeds: [embed] });

            } catch (error) {
                console.error('Lỗi khi tạo lại kênh, gửi thông báo hoặc DM:', error);
                message.channel.send('Đã xảy ra lỗi trong quá trình nuke. Vui lòng thử lại.');
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                try {
                    confirmationMessage.edit('Nuke đã bị hủy bỏ do không có xác nhận.');
                } catch (error) {
                    message.channel.send('Nuke đã bị hủy bỏ do không có xác nhận.'); 
                }
            }
        });
    },
};
