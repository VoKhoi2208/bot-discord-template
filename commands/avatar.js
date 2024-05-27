import { EmbedBuilder } from 'discord.js';

export default {
  name: 'dp!avatar',
  description: 'Hiển thị avatar của bạn, người được đề cập hoặc người dùng có ID được cung cấp.',
  usage: 'dp!avatar [@user | userID]',

  async execute(message, args) {
    let targetUser;

    if (message.mentions.users.size > 0) {
      // Nếu có người dùng được đề cập, lấy người đầu tiên
      targetUser = message.mentions.users.first();
    } else if (args.length > 0) { 
      // Nếu có đối số (ID hoặc đề cập), thử lấy người dùng
      try {
        // Thử lấy người dùng bằng ID
        targetUser = await message.client.users.fetch(args[0]);
      } catch (error) {
        // Nếu không tìm thấy bằng ID, thử lấy bằng đề cập (không có @)
        targetUser = message.guild.members.cache.find(member => member.user.username === args[0])?.user;

        if (!targetUser) {
          return message.reply('Không tìm thấy người dùng có ID hoặc tên người dùng đó.');
        }
      }
    } else {
      // Nếu không có đề cập hoặc ID, lấy avatar của người gửi lệnh
      targetUser = message.author;
    }

    const embed = new EmbedBuilder()
      .setColor('#33DA3A')
      .setTitle(`${targetUser.username}'s Avatar`)
      .setImage(targetUser.displayAvatarURL({ size: 256, dynamic: true }))
      .setFooter({ text: `Request by ${message.author.username}` });

    message.reply({ embeds: [embed] });
  },
};
