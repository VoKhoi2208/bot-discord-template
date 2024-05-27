import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'dp!serverlist',
    description: 'Hiển thị danh sách các server mà bot đang tham gia.',
    usage: 'dp!serverlist',

    async execute(message, args) {
        // Kiểm tra quyền sử dụng (chỉ cho phép user ID cụ thể)
        if (message.author.id !== '1036648969239019520') {
            return message.reply('Bạn không có quyền sử dụng lệnh này.');
        }

        const guilds = message.client.guilds.cache;
        const totalPages = Math.ceil(guilds.size / 10);
        let currentPage = 1;

        const generateEmbed = (page) => {
            const startIndex = (page - 1) * 10;
            const endIndex = Math.min(startIndex + 10, guilds.size);

            const embed = new EmbedBuilder()
                .setColor('#FFD700') // Màu vàng gold
                .setTitle('👑 Danh sách Vương Quốc của Bot 👑')
                .setDescription(guilds.map((guild, index) => `**${index + startIndex + 1}.** ${guild.name} (ID: ${guild.id})`).slice(startIndex, endIndex).join('\n'))
                .setThumbnail(message.client.user.displayAvatarURL()) // Avatar của bot làm thumbnail
                .setFooter({ text: `Trang ${page}/${totalPages}`, iconURL: message.author.displayAvatarURL() }) // Avatar người yêu cầu ở footer
                .setTimestamp(); // Thêm thời gian hiện tại
            return embed;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prevPage')
                    .setLabel('Trước')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 1), // Vô hiệu hóa nút "Trước" nếu ở trang đầu tiên
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('Sau')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages) // Vô hiệu hóa nút "Sau" nếu ở trang cuối cùng
            );

        const responseMessage = await message.reply({ embeds: [generateEmbed(currentPage)], components: [row] });

        const collector = responseMessage.createMessageComponentCollector({ time: 60000 }); // Thu thập tương tác trong 60 giây

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'prevPage') {
                currentPage--;
            } else if (interaction.customId === 'nextPage') {
                currentPage++;
            }

            row.components[0].setDisabled(currentPage === 1);
            row.components[1].setDisabled(currentPage === totalPages);

            await interaction.update({ embeds: [generateEmbed(currentPage)], components: [row] });
        });

        collector.on('end', () => {
            responseMessage.edit({ components: [] }); // Vô hiệu hóa các nút sau khi hết thời gian
        });
    },
};
