import { PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!kick',
  description: 'Kick người dùng ra khỏi server và gửi tin nhắn DM cho họ.',
  usage: 'dp!kick @user [lý do]',

  async execute(message, args) {
    // Kiểm tra quyền của người thực thi lệnh
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Bạn không có quyền kick người dùng.');
    }

    // Lấy người dùng được đề cập
    const targetMember = message.mentions.members.first();
    if (!targetMember) {
      return message.reply('Vui lòng đề cập người dùng bạn muốn kick.');
    }

    // Kiểm tra xem bot có quyền kick người dùng không
    if (!targetMember.kickable) {
      return message.reply('Bot không thể kick người dùng này. Có thể người dùng có vai trò cao hơn hoặc bot không có quyền.');
    }

    // Lấy lý do kick (nếu có)
    const reason = args.slice(1).join(' ') || 'Không có lý do được cung cấp';

    try {
      // Kick người dùng
      await targetMember.kick(reason);
      await message.reply(`Đã kick ${targetMember.user.tag} khỏi server.`);
      console.log(`1 member was kicked from server **${message.guild.name}** (ID: ${message.guild.id}) bởi **${message.author.tag}** (ID: ${message.author.id}) vì lý do: ${reason}`);

      // Gửi tin nhắn DM cho người bị kick (nếu có thể)
      try {
        await targetMember.send(`Bạn đã bị kick khỏi server **${message.guild.name}** (ID: ${message.guild.id}) bởi **${message.author.tag}** (ID: ${message.author.id}) vì lý do: ${reason}`);
      } catch (error) {
        console.error(`Không thể gửi DM cho ${targetMember.user.tag}:`, error);
      }
    } catch (error) {
      console.error('Lỗi khi kick người dùng:', error);
      message.reply('Đã xảy ra lỗi khi kick người dùng.');
    }
  },
};
