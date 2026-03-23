require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

require('dotenv').config();
const TOKEN = process.env.TOKEN;
const PREFIX = "!";
const STAFF_ROLE_NAME = "Jesus";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// ===== EXPRESS (pour Replit / UptimeRobot) =====
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

// ===== DISCORD CLIENT =====
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // ---------------------- COMMANDE !move ----------------------
    if (command === "move") {
        if (!message.member.roles.cache.some(r => r.name === STAFF_ROLE_NAME)) {
            return message.reply("❌ Tu n'as pas la permission.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ Mentionne quelqu’un.");
        if (!member.voice.channel) return message.reply("❌ Le membre n'est pas en vocal.");

        const match = message.content.match(/"(.+?)"/);
        if (!match) return message.reply('❌ Exemple : !move @user "Salon vocal"');

        const channelName = match[1];

        const targetChannel = message.guild.channels.cache.find(
            ch => ch.isVoiceBased() && ch.name.toLowerCase() === channelName.toLowerCase()
        );

        if (!targetChannel) return message.reply(`❌ Salon "${channelName}" introuvable.`);
        if (targetChannel.userLimit > 0 && targetChannel.members.size >= targetChannel.userLimit) {
            return message.reply(`⚠️ Le salon est plein (${targetChannel.userLimit}).`);
        }

        try {
            await member.voice.setChannel(targetChannel);
            message.reply(`✅ ${member.user.tag} déplacé vers ${targetChannel.name}.`);
        } catch (err) {
            console.error(err);
            message.reply("❌ Impossible de déplacer.");
        }
    }

    // ---------------------- COMMANDE !amoureux ----------------------
    if (command === "amoureux") {
        if (!message.member.roles.cache.some(r => r.name === "Rias dog")) {
            return message.reply("❌ Tu n'as pas la permission.");
        }

        const channelId = "1485696245795262546";
        const targetChannel = message.guild.channels.cache.get(channelId);
        if (!targetChannel) return message.reply("❌ Salon introuvable.");

        const userIds = [
            "742740664034525205",
            "1170740777488498768"
        ];

        let moved = [];

        for (const id of userIds) {
            const member = await message.guild.members.fetch(id).catch(() => null);
            if (!member || !member.voice.channel) continue;

            if (targetChannel.userLimit > 0 && targetChannel.members.size >= targetChannel.userLimit) {
                return message.reply("❌ Le salon est plein !");
            }

            try {
                await member.voice.setChannel(targetChannel);
                moved.push(member.user.tag);
            } catch (err) {
                console.error(err);
            }
        }

        message.reply(`💖 Réunis dans le même vocal : ${moved.join(", ")}`);
    }
});

client.login(TOKEN);
