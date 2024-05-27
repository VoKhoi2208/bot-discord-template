export default {
    name: 'dp!ping',
    description: 'Kiểm tra độ trễ của bot.',

    async execute(message, args) {
        const sentMessage = await message.reply('Đang kiểm tra độ trễ...'); // Gửi tin nhắn tạm thời

        const apiLatency = sentMessage.createdTimestamp - message.createdTimestamp; // Tính độ trễ API
        const wsLatency = message.client.ws.ping; // Lấy độ trễ WebSocket từ client

        // Chỉnh sửa tin nhắn tạm thời để hiển thị kết quả
        sentMessage.edit(`Độ trễ:
            - API: ${apiLatency}ms
            - WebSocket: ${wsLatency}ms`);
    },
};
