import { PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!unban',
  description: 'Unban người dùng khỏi server.',
  usage: 'dp!unban <user_id> [lý do]',

  async execute(message, args) {
    // Kiểm tra quyền của người thực thi lệnh
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Bạn không có quyền unban người dùng.');
    }

    // Lấy ID của người dùng được unban
    const userId = args[0];
    if (!userId) {
      return message.reply('Vui lòng cung cấp ID của người dùng bạn muốn unban.');
    }

    // Lấy lý do unban (nếu có)
    const reason = args.slice(1).join(' ') || 'Không có lý do được cung cấp';

    try {
      // Kiểm tra xem người dùng có trong danh sách bị ban không
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.find(ban => ban.user.id === userId);

      if (!bannedUser) {
        return message.reply('Người dùng này không bị ban.');
      }

      // Unban người dùng
      await message.guild.members.unban(userId, reason);
      await message.reply(`Đã unban ${bannedUser.user.tag} khỏi server.`);
      console.log(`1 member was unbanned from server **${message.guild.name}** (ID: ${message.guild.id}) bởi **${message.author.tag}** (ID: ${message.author.id}) vì lý do: ${reason}`);
    } catch (error) {
      console.error('Lỗi khi unban người dùng:', error);
      message.reply('Đã xảy ra lỗi khi unban người dùng.');
    }
  },
};
