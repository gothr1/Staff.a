const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
  // announce.js - إعلان
  {
    data: new SlashCommandBuilder()
      .setName('announce')
      .setDescription('نشر إعلان في السيرفر')
      .addStringOption(option => 
        option.setName('message')
          .setDescription('نص الإعلان')
          .setRequired(true)),
    execute: async (interaction) => {
      const message = interaction.options.getString('message');
      const embed = {
        color: 0x0099ff,
        title: '📢 إعلان مهم',
        description: message,
        timestamp: new Date(),
      };
      await interaction.reply({ content: '✅ تم نشر الإعلان!', ephemeral: true });
      await interaction.channel.send({ embeds: [embed] });
    }
  },

  // clear.js - مسح الرسائل
  {
    data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('مسح عدد من الرسائل')
      .addIntegerOption(option => 
        option.setName('amount')
          .setDescription('عدد الرسائل المراد مسحها (1-100)')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)),
    execute: async (interaction) => {
      const amount = interaction.options.getInteger('amount');
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `✅ تم مسح ${amount} رسالة`, ephemeral: true });
    }
  },

  // kick.js - طرد عضو
  {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('طرد عضو من السيرفر')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو المراد طرده')
          .setRequired(true))
      .addStringOption(option => 
        option.setName('reason')
          .setDescription('سبب الطرد')
          .setRequired(false)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'لا يوجد سبب';
      
      await interaction.guild.members.kick(user, reason);
      await interaction.reply(`✅ تم طرد ${user.tag} - السبب: ${reason}`);
    }
  },

  // ban.js - حظر عضو
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('حظر عضو من السيرفر')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو المراد حظره')
          .setRequired(true))
      .addStringOption(option => 
        option.setName('reason')
          .setDescription('سبب الحظر')
          .setRequired(false)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'لا يوجد سبب';
      
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply(`✅ تم حظر ${user.tag} - السبب: ${reason}`);
    }
  },

  // unban.js - فك الحظر
  {
    data: new SlashCommandBuilder()
      .setName('unban')
      .setDescription('فك حظر عضو')
      .addStringOption(option => 
        option.setName('userid')
          .setDescription('ايدي العضو المراد فك حظره')
          .setRequired(true)),
    execute: async (interaction) => {
      const userId = interaction.options.getString('userid');
      
      await interaction.guild.members.unban(userId);
      await interaction.reply(`✅ تم فك حظر العضو ${userId}`);
    }
  },

  // mute.js - كتم عضو
  {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('كتم عضو')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو المراد كتمه')
          .setRequired(true))
      .addIntegerOption(option => 
        option.setName('duration')
          .setDescription('مدة الكتم بالدقائق')
          .setRequired(false)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      const duration = interaction.options.getInteger('duration') || 60;
      
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(duration * 60 * 1000, 'كتم بواسطة البوت');
      await interaction.reply(`✅ تم كتم ${user.tag} لمدة ${duration} دقيقة`);
    }
  },

  // unmute.js - فك الكتم
  {
    data: new SlashCommandBuilder()
      .setName('unmute')
      .setDescription('فك كتم عضو')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو المراد فك كتمه')
          .setRequired(true)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(null);
      await interaction.reply(`✅ تم فك كتم ${user.tag}`);
    }
  },

  // lock.js - قفل القناة
  {
    data: new SlashCommandBuilder()
      .setName('lock')
      .setDescription('قفل القناة الحالية'),
    execute: async (interaction) => {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false
      });
      await interaction.reply('🔒 تم قفل القناة');
    }
  },

  // unlock.js - فتح القناة
  {
    data: new SlashCommandBuilder()
      .setName('unlock')
      .setDescription('فتح القناة الحالية'),
    execute: async (interaction) => {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true
      });
      await interaction.reply('🔓 تم فتح القناة');
    }
  },

  // slowmode.js - وضع البطء
  {
    data: new SlashCommandBuilder()
      .setName('slowmode')
      .setDescription('ضبط وضع البطء للقناة')
      .addIntegerOption(option => 
        option.setName('seconds')
          .setDescription('الثواني بين كل رسالة (0-21600)')
          .setRequired(true)
          .setMinValue(0)
          .setMaxValue(21600)),
    execute: async (interaction) => {
      const seconds = interaction.options.getInteger('seconds');
      await interaction.channel.setRateLimitPerUser(seconds);
      await interaction.reply(`✅ تم ضبط وضع البطء إلى ${seconds} ثانية`);
    }
  },

  // warn.js - إنذار عضو
  {
    data: new SlashCommandBuilder()
      .setName('warn')
      .setDescription('إنذار عضو')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو المراد إنذاره')
          .setRequired(true))
      .addStringOption(option => 
        option.setName('reason')
          .setDescription('سبب الإنذار')
          .setRequired(true)),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      
      await interaction.reply(`⚠️ تم إنذار ${user.tag} - السبب: ${reason}`);
    }
  },

  // say.js - جعل البوت يتحدث
  {
    data: new SlashCommandBuilder()
      .setName('say')
      .setDescription('جعل البوت يرسل رسالة')
      .addStringOption(option => 
        option.setName('message')
          .setDescription('الرسالة المراد إرسالها')
          .setRequired(true)),
    execute: async (interaction) => {
      const message = interaction.options.getString('message');
      await interaction.reply({ content: '✅ تم إرسال الرسالة!', ephemeral: true });
      await interaction.channel.send(message);
    }
  },

  // role.js - إدارة الرتب
  {
    data: new SlashCommandBuilder()
      .setName('role')
      .setDescription('إضافة أو إزالة رتبة من عضو')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('العضو')
          .setRequired(true))
      .addRoleOption(option => 
        option.setName('role')
          .setDescription('الرتبة')
          .setRequired(true))
      .addStringOption(option => 
        option.setName('action')
          .setDescription('الإجراء')
          .setRequired(true)
          .addChoices(
            { name: 'إضافة', value: 'add' },
            { name: 'إزالة', value: 'remove' }
          )),
    execute: async (interaction) => {
      const user = interaction.options.getUser('user');
      const role = interaction.options.getRole('role');
      const action = interaction.options.getString('action');
      
      const member = await interaction.guild.members.fetch(user.id);
      
      if (action === 'add') {
        await member.roles.add(role);
        await interaction.reply(`✅ تم إضافة رتبة ${role.name} إلى ${user.tag}`);
      } else {
        await member.roles.remove(role);
        await interaction.reply(`✅ تم إزالة رتبة ${role.name} من ${user.tag}`);
      }
    }
  }
];
