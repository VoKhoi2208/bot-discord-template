export default {
    name: 'dp!afk',
    description: 'Set your status to AFK.',
    
    async execute(message, args) {
        const content = args.join(' ') || 'Không có lý do';
        const member = message.member;

        if (!member) {
            return message.reply('Có lỗi xảy ra.');
        }

        const oldNickname = member.nickname || member.user.username;
        const newNickname = `[AFK] ${oldNickname}`;

        try {
            await member.setNickname(newNickname);
        } catch (error) {
            // If nickname change fails, skip changing the nickname
            console.error('Không thể thay nickname:', error);
        }

        if (!global.afkUsers) global.afkUsers = new Map();
        global.afkUsers.set(member.id, { oldNickname, content, afkSince: Date.now() });

        message.reply(`Bạn hiện đang AFK: ${content}`);
    }
};
