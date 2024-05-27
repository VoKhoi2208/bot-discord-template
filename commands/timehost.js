import { Client } from 'discord.js';

export default {
  name: 'dp!timehost',
  description: 'Kiểm tra thời gian bot đã được host.',

  execute(message, args) {
    const uptime = message.client.uptime; // Lấy thời gian uptime (tính bằng milliseconds)

    // Chuyển đổi uptime sang định dạng ngày, giờ, phút, giây
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    // Tạo tin nhắn phản hồi
    const response = `Bot đã được host trong ${days} ngày, ${hours} giờ, ${minutes} phút và ${seconds} giây.`;

    message.reply(response);
  },
};
