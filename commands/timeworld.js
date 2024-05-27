import { EmbedBuilder } from 'discord.js';
import moment from 'moment-timezone'; // Cần cài đặt thư viện moment-timezone: npm install moment-timezone

export default {
    name: 'timeworld',
    description: 'Hiển thị thời gian hiện tại tại một quốc gia cụ thể.',
    usage: 'dp!timeworld <tên quốc gia>',

    async execute(message, args) {
        if (!args.length) {
            return message.reply('Vui lòng cung cấp tên quốc gia.');
        }

        const countryName = args.join(' ').toLowerCase(); // Chuyển tên quốc gia thành chữ thường để tránh lỗi

        try {
            const timezone = moment.tz.names().find(tz => tz.toLowerCase().includes(countryName));
            if (!timezone) {
                return message.reply('Không tìm thấy quốc gia hoặc múi giờ hợp lệ.Tham khảo https://www.ssl.com/vi/m%C3%A3-qu%E1%BB%91c-gia/');
            }

            const now = moment().tz(timezone);
            const formattedTime = now.format('HH:mm:ss');
            const formattedDate = now.format('DD/MM/YYYY');

            const embed = new EmbedBuilder()
                .setColor('#33DA3A')
                .setTitle(`Thời gian hiện tại tại ${countryName.toUpperCase()}`)
                .addFields(
                    { name: 'Giờ', value: formattedTime, inline: true },
                    { name: 'Múi giờ', value: timezone, inline: true },
                    { name: 'Ngày', value: formattedDate, inline: true }
                );

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin thời gian:', error);
            message.reply('Đã xảy ra lỗi khi lấy thông tin thời gian. Vui lòng thử lại.');
        }
    },
};
