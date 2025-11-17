require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const commands = require('./commands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} شغال!`);

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log(`✅ تم تسجيل ${commands.length} أمر`);
  } catch (error) {
    console.log('✅ الأوامر جاهزة محلياً');
  }

  client.user.setPresence({
    activities: [{
      name: 'إدارة السيرفر',
      type: ActivityType.Watching
    }],
    status: 'online'
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (!command) return;

  const allowedRoles = ['1437765815016362145'];
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

console.log("Staff Bot جاري التشغيل...");
client.login(process.env.TOKEN);
