import { PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!ban',
  description: 'Ban người dùng khỏi server và gửi tin nhắn DM cho họ.',
  usage: 'dp!ban @user [lý do]',

  async execute(message, args) {
    // Kiểm tra quyền của người thực thi lệnh
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Bạn không có quyền ban người dùng.');
    }

    // Lấy người dùng được đề cập
    const targetMember = message.mentions.members.first();
    if (!targetMember) {
      return message.reply('Vui lòng đề cập người dùng bạn muốn ban.');
    }

    // Kiểm tra xem bot có quyền ban người dùng không
    if (!targetMember.bannable) {
      return message.reply('Bot không thể ban người dùng này. Có thể người dùng có vai trò cao hơn hoặc bot không có quyền.');
    }

    // Lấy lý do ban (nếu có)
    const reason = args.slice(1).join(' ') || 'Không có lý do được cung cấp';

    try {
      // Ban người dùng
      await targetMember.ban({ reason });
      await message.reply(`Đã ban ${targetMember.user.tag} khỏi server.`);
      console.log(`1 member was banned from server **${message.guild.name}** (ID: ${message.guild.id}) bởi **${message.author.tag}** (ID: ${message.author.id}) vì lý do: ${reason}`);

      // Gửi tin nhắn DM cho người bị ban (nếu có thể)
      try {
        await targetMember.send(`Bạn đã bị ban khỏi server **${message.guild.name}** (ID: ${message.guild.id}) bởi **${message.author.tag}** (ID: ${message.author.id}) vì lý do: ${reason}`);
      } catch (error) {
        console.error(`Không thể gửi DM cho ${targetMember.user.tag}:`, error);
      }
    } catch (error) {
      console.error('Lỗi khi ban người dùng:', error);
      message.reply('Đã xảy ra lỗi khi ban người dùng.');
    }
  },
};
