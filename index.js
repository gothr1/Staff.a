require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// تحميل الأوامر من مجلد commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ✅ الحدث الصحيح في Discord.js v15
client.once('clientReady', () => {
  console.log(`✅ تم تسجيل الدخول باسم ${client.user.tag}`);

  // الحالة (Streaming)
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'ᴅᴇᴠ ʙʏ ɢᴏᴛʜʀ',
      type: ActivityType.Streaming,
      url: 'https://www.twitch.tv/GOTHR'
    }]
  });
});

// أوامر السلاش
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // التحقق من الرتب المسموح بها
  const allowedRoles = ['1437765815016362145']; // ضع هنا IDs الرتب المسموح لها
  const hasPermission = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

  if (!hasPermission) {
    return interaction.reply({ content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.', ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
  }
});

console.log("Staff.bot شغال ✅");
client.login(process.env.TOKEN);
