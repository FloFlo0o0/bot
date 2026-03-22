// index.js
const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.TOKEN;
const STAFF_ROLE_NAME = "Jesus";

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

    const PREFIX = "!";
    if (!message.content.startsWith(PREFIX)) return;

    // On récupère la commande et le reste
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "move") {
        if (!message.member.roles.cache.some(r => r.name === STAFF_ROLE_NAME)) {
            return message.reply("❌ Tu n'as pas la permission pour déplacer des membres.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ Mentionne quelqu’un !");

        // On récupère le nom du salon entre guillemets
        const channelNameMatch = message.content.match(/"(.+?)"/);
        if (!channelNameMatch) return message.reply('❌ Indique le nom du salon vocal entre guillemets, exemple : "!move @membre \"voc-2\""');

        const channelName = channelNameMatch[1];

        // Recherche du salon vocal par nom
        const targetChannel = message.guild.channels.cache.find(
            ch => ch.type === 2 && ch.name.replace(/[\u{1F300}-\u{1FAFF}]/gu, '') === channelName
        );

        if (!targetChannel) return message.reply(`❌ Salon vocal "${channelName}" introuvable !`);

        // Déplacement
        member.voice.setChannel(targetChannel).catch(err => {
            console.error(err);
            message.reply("❌ Impossible de déplacer le membre.");
        });

        message.reply(`✅ ${member.user.tag} déplacé vers ${targetChannel.name} !`);
    }
});

client.login(TOKEN);