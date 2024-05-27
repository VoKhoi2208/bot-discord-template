import { ChannelType, PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!newvoice', // Đổi tên lệnh thành "dp!newvc" để rõ ràng hơn
  description: 'Tạo một kênh thoại mới.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('Bạn không có quyền tạo kênh thoại.');
    }

    if (!args.length) {
      return message.reply('Vui lòng cung cấp tên kênh!');
    }

    const channelName = args.join(' ');
    const logChannelId = '1243234456161091736'; // Thay bằng ID kênh log của bạn

    try {
      const voiceChannel = await message.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice, // Thay đổi loại kênh thành GuildVoice
        permissionOverwrites: [ // (Tùy chọn) Thiết lập quyền cho kênh mới
          {
            id: message.guild.id, // @everyone
            deny: [PermissionsBitField.Flags.ViewChannel], // Ẩn kênh với @everyone
          },
        ],
      });

      await message.reply(`Kênh thoại mới đã được tạo: ${voiceChannel}`);

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        await logChannel.send(
          `Kênh thoại \`${voiceChannel.name}\` (ID: \`${voiceChannel.id}\`) đã được tạo bởi \`${message.author.tag}\` tại server \`${message.guild.name}\` (ID: \`${message.guild.id}\`)`
        );
      } else {
        console.error('Không tìm thấy kênh log. Vui lòng kiểm tra lại ID kênh log.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo kênh thoại:', error);

      if (error.code === 50013) {
        message.reply('Bot không có quyền tạo kênh thoại.');
      } else if (error.code === 30013) {
        message.reply('Đã đạt giới hạn số lượng kênh cho server này.');
      } else {
        message.reply('Đã xảy ra lỗi khi tạo kênh thoại. Vui lòng thử lại sau.');
      }
    }
  },
};
