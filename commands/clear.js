import { PermissionsBitField } from 'discord.js';

export default {
  name: 'dp!clear',
  description: 'Xóa số lượng tin nhắn cụ thể khỏi kênh (tối đa 100).',
  usage: 'dp!clear <số lượng tin nhắn>',

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('Bạn không có quyền xóa tin nhắn.');
    }

    const amountToDelete = parseInt(args[0], 10);

    if (isNaN(amountToDelete) || amountToDelete < 1 || amountToDelete > 100) {
      return message.reply('Vui lòng cung cấp số lượng tin nhắn hợp lệ (từ 1 đến 100).');
    }

    try {
      // Xóa tin nhắn theo từng đợt 100 tin nhắn (do giới hạn của Discord)
      for (let i = 0; i < Math.ceil(amountToDelete / 100); i++) {
        const messagesToDelete = Math.min(100, amountToDelete - i * 100);
        const deletedMessages = await message.channel.bulkDelete(messagesToDelete + 1, true); // +1 để xóa cả lệnh gọi
        const deleteCount = deletedMessages.size - 1;

        // Gửi tin nhắn thông báo (không reply để tránh lỗi)
        message.channel.send(`Đã xóa ${deleteCount} tin nhắn.`)
          .then(replyMessage => setTimeout(() => replyMessage.delete(), 5000)); // Tự động xóa sau 5 giây
      }
    } catch (error) {
      console.error('Lỗi khi xóa tin nhắn:', error);

      if (error.code === 50013) {
        message.reply('Bot không có quyền xóa tin nhắn.');
      } else if (error.code === 50034) {
        message.reply('Không thể xóa tin nhắn cũ hơn 2 tuần.');
      } else {
        message.reply('Đã xảy ra lỗi khi xóa tin nhắn. Vui lòng thử lại.');
      }
    }
  },
};
