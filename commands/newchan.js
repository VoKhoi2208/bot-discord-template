import { ChannelType, PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!newchan',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Vui lòng cung cấp tên kênh!'); 
    }

    const channelName = args.join(' ');
    const logChannelId = '1243234456161091736'; 

    try {
      const channel = await message.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      await message.reply(`Kênh mới đã được tạo: ${channel}`);

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        await logChannel.send(
          `Kênh \`${channel.name}\` (ID: \`${channel.id}\`) đã được tạo bởi \`${message.author.tag}\` tại server \`${message.guild.name}\` (ID: \`${message.guild.id}\`)`
        );
      } else {
        console.error('Không tìm thấy kênh log. Vui lòng kiểm tra lại ID kênh log.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo kênh:', error);

      if (error.code === 50013) {
        message.reply('Bot không có quyền tạo kênh.');
      } else if (error.code === 30013) {
        message.reply('Đã đạt giới hạn số lượng kênh cho server này.');
      } else {
        message.reply('Đã xảy ra lỗi khi tạo kênh. Vui lòng thử lại sau.');
      }
    }
  },
};
