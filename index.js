const express = require('express');
const app = express();
const keep_alive = require('./keep_alive.js')

const db = require('pro.db');
const {
    MessageActionRow,
    Intents,
    MessageAttachment,
    MessageSelectMenu,
    MessageButton,
    WebhookClient,
    MessageEmbed,
    Client,
    Collection,
    Discord,
    Permissions,
    Guilds,
   GuildMessages,
   MessageContent,
  GUILD_VOICE_STATES,
} = require('discord.js');

const client = new Client({
  intents: new Intents(32767),
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
const prefix = '.';
client.setMaxListeners(0);
const commands = [];

const CMD = [];
client.Scommands = new Collection();

  client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.Scommands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(client, interaction);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  });

  const rest = new REST({ version: '9' }).setToken(process.env.token);
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(clientId), { body: CMD });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  });

client.on("ready" , () => {
  console.log(`Logged in as ${client.user.tag}!`)

});



const categoryIDs = ['995631147532955708', '995632149464100944', '995631831925923961'];
const reallow = '957442639018491925';

client.on('messageCreate', async (message) => {
  if (message.channel.parent && categoryIDs.includes(message.channel.parent.id) && message.member.roles.cache.has(reallow)) {
    if (message.content.startsWith('.re') && message.content.length > 4) {
      const newName = message.content.slice(4);
      message.channel.setName(newName);
      message.channel.send('تم تغيير اسم التكت الى ' + newName);
    }
  }
});







client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const isTicketManager = message.member.roles.cache.has(ticketManagerRoleId);
  const allowedCategories = ['995631147532955708', '995632149464100944', '995631831925923961'];
  const isAllowedCategory = message.channel.parent && allowedCategories.includes(message.channel.parent.id);
    
  if (isTicketManager && isAllowedCategory && content === 'غلق') {
    const embedMessage = new MessageEmbed()
      .setTitle('تنبيه ⚠️')
      .setDescription('هاذا التكت معرض للإغلاق خلال ثلاث دقائق في حالة عدم الرد');

    message.channel.send({ embeds: [embedMessage] });
  }
});








const ticketManagerRoleId = '957442639018491925';
const logChannelId = '1048615495147999264';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('.gban') && message.member.roles.cache.has(ticketManagerRoleId)) {
    // Extracting the messages after the command
    const [, message1, message2, message3] = message.content.split(' ');

    // Creating the formatted message with Embed
    const formattedMessage = new MessageEmbed()
      .setTitle('قائمة الحظر')
      .setDescription(`
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

        **اسم المواطن:** ${message1}

        **السبب:** ${message2}

        **تاريخ الفك:** ${message3}

        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

        **ملاحظة: في حال نظرت بأن الباند تم عن طريق الخطأ يرجى فتح تكت المساعدة**
      `)
      .setFooter({
        text: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setColor('#ff0000'); // يمكنك تغيير لون الـ Embed حسب تفضيلاتك
    




    // Sending the message to the log channel
    const logChannel = await client.channels.fetch(logChannelId);
    logChannel.send({ embeds: [formattedMessage] });
  }
});;










const trackedRoleID = '957442638980730934';
const trackedChannelID = '957442641459576871';
const notificationChannelID = '1189610179143147641';
const databaseFile = 'database.json';

let messageCounts = new Map();

client.on('messageCreate', (message) => {
  if (message.channel.id === trackedChannelID) {
    const member = message.guild.members.cache.get(message.author.id);

    if (member && member.roles.cache.has(trackedRoleID)) {
      const count = messageCounts.get(message.author.id) || 0;
      messageCounts.set(message.author.id, count + 1);
    }
  }
});


setInterval(() => {
  const sortedCounts = Array.from(messageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const notificationChannel = client.channels.cache.get(notificationChannelID);
  if (notificationChannel) {
    const embed = new MessageEmbed()
      .setColor('#3498db')
      .setTitle('Top 3 Message Senders')
      .setDescription(sortedCounts.map(([userID, count], index) => `**${index + 1}.** <@${userID}>: ${count} messages`).join('\n'));

    notificationChannel.send({ embeds: [embed] });
  }

  // Clear message counts after each minute
  messageCounts.clear();
}, 86400000);




// حفظ البيانات إلى ملف عند إيقاف تشغيل البوت
process.on('SIGINT', () => {
  saveData();
  process.exit();
});

process.on('SIGTERM', () => {
  saveData();
  process.exit();
});

function saveData() {
  const dataToSave = Array.from(messageCounts.entries()).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

  fs.writeFileSync(databaseFile, JSON.stringify(dataToSave, null, 2));
  console.log('Data saved to Database.json');
}

// استيراد البيانات عند بدء تشغيل البوت
function loadData() {
  if (fs.existsSync(databaseFile)) {
    const data = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));

    for (const [key, value] of Object.entries(data)) {
      messageCounts.set(key, value);
    }

    console.log('Data loaded from Database.json');
  }
}

loadData();

// مسح البيانات من ملف كل يوم
setInterval(() => {
  fs.unlinkSync(databaseFile);
  console.log('Data deleted from Database.json');
}, 86400000);










const cron = require('cron');

const trackedRoleI = '957442638980730934';
const trackedChannelI = '957442641459576871';
const notificationChannelI = '1189610179143147641';
const trackingInterval = 12 * 60 * 60 * 1000; // 12 ساعة بالمللي ثانية

let trackedUsers = {};


client.on('ready', async () => {
  loadStatsFromFile();

  const job = new cron.CronJob('0 23,11 * * *', () => {
    sendNotifications();
  }, null, true, 'Asia/Riyadh'); // تعديل المنطقة الزمنية حسب الحاجة

  job.start();
});

function sendNotifications() {
  const notificationChannel = client.channels.cache.get(notificationChannelI);

  if (notificationChannel) {
    const embed = new MessageEmbed()
      .setTitle('إحصائيات طلب ادمن')
      .setColor('#00ff00')
      .setDescription('إحصائيات كلمة "تفضل" للمستخدمين خلال 12 ساعة :');

    const usersToSend = Object.entries(trackedUsers).map(([userID, userData]) => `<@${userID}>: ${userData.count} مرة`);
    if (usersToSend.length > 0) {
      embed.addField('المستخدمون', usersToSend.join('\n'));
      notificationChannel.send({ embeds: [embed] })
        .then(() => {
          // مسح بيانات الرسائل بعد إرسالها
          trackedUsers = {};
          saveStatsToFile();
        })
        .catch((error) => {
          console.error('Error sending notifications:', error);
        });
    }
  }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const member = message.guild.members.cache.get(message.author.id);
  const trackedRole = message.guild.roles.cache.get(trackedRoleI);
  const trackedChannel = message.guild.channels.cache.get(trackedChannelI);

  if (member && member.roles.cache.has(trackedRoleI) && message.channel.id === trackedChannelI && message.content.toLowerCase() === 'تفضل') {
    updateStats(message.author.id);
  }
});

function updateStats(userID) {
  if (trackedUsers[userID]) {
    trackedUsers[userID].count++;
  } else {
    trackedUsers[userID] = { count: 1 };
  }

  saveStatsToFile();
}

function saveStatsToFile() {
  fs.writeFileSync('admins.json', JSON.stringify(trackedUsers, null, 2));
}

function loadStatsFromFile() {
  try {
    const data = fs.readFileSync('admins.json');
    trackedUsers = JSON.parse(data);
  } catch (error) {
    console.error('Error loading stats from file:', error);
  }
}















const roleToTriggerIdt = '957442639018491925'; // رقم الرتبة التي تشغل دور المشغل
const targetRoleIdt = '1045047680285560942'; // رقم الرتبة التي سيتم إعطاؤها
const logChannelIdt = '1098239727146119278'; // رقم القناة التي ستتم فيها نشر الرسالة
const messageFormat = `
قائمة بلاك ليست من الوظائف

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

اسم الشخص :  <@{mentionedUser}>

 مدة الإنتهاء : {firstMessage}

 السبب : {secondMessage}

 عصابه / فاكشن / : فاكشن

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

ملاحظة : لا يمكنك ازالة هاذا الحظر بكفالة بل يجب ان تنتظر انتهاء الوقت أو في حال رأيت ان الحظر عن طريق الخطأ فقم بفتح تكت مساعدة
`;

client.on('messageCreate', (message) => {
  // التحقق من صحة الرسالة وصاحبها لديه الرتبة المطلوبة
  if (message.content.startsWith('.fb') && message.member.roles.cache.has(roleToTriggerIdt)) {
    const args = message.content.slice('.fb'.length).trim().split(/ +/);

    // استخراج المستخدم الذي تم الإشارة إليه
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) return message.reply('');

    const firstMessage = args[1];
    const secondMessage = args[2];

    // إعطاء الرتبة المستهدفة للشخص المشار إليه
    const targetMember = message.guild.members.cache.get(mentionedUser.id);
    if (targetMember) {
      targetMember.roles.add(targetRoleIdt)
        .then(() => {
          // إرسال الرسالة المنسقة في القناة المخصصة
          const formattedMessage = messageFormat
            .replace('{mentionedUser}', mentionedUser.id)
            .replace('{firstMessage}', firstMessage)
            .replace('{secondMessage}', secondMessage);
          const logChannel = message.guild.channels.cache.get(logChannelIdt);
          if (logChannel) {
            logChannel.send(formattedMessage);
          } else {
            console.error('Could not find log channel.');
          }
        })
        .catch((error) => {
          console.error('Error giving target role:', error);
          message.reply('حدث خطأ أثناء إعطاء الرتبة المستهدفة.');
        });
    } else {
      console.error('Could not find target member.');
      message.reply('حدث خطأ أثناء البحث عن الشخص المستهدف.');
    }
  }
});


const roleToTriggerIdtt = '957442639018491925'; // رقم الرتبة التي تشغل دور المشغل
const targetRoleIdtt = '1086239390080176178'; // رقم الرتبة التي سيتم إعطاؤها
const logChannelIdtt = '1098239727146119278'; // رقم القناة التي ستتم فيها نشر الرسالة
const messageFormatt = `
قائمة بلاك ليست من الوظائف

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

اسم الشخص :  <@{mentionedUser}>

 مدة الإنتهاء : {firstMessage}

 السبب : {secondMessage}

 عصابه / فاكشن / : عصابة

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

ملاحظة : لا يمكنك ازالة هاذا الحظر بكفالة بل يجب ان تنتظر انتهاء الوقت أو في حال رأيت ان الحظر عن طريق الخطأ فقم بفتح تكت مساعدة
`;

client.on('messageCreate', (message) => {
  // التحقق من صحة الرسالة وصاحبها لديه الرتبة المطلوبة
  if (message.content.startsWith('.gb') && message.member.roles.cache.has(roleToTriggerIdtt)) {
    const args = message.content.slice('.gb'.length).trim().split(/ +/);

    // استخراج المستخدم الذي تم الإشارة إليه
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) return message.reply('');

    const firstMessage = args[1];
    const secondMessage = args[2];

    // إعطاء الرتبة المستهدفة للشخص المشار إليه
    const targetMember = message.guild.members.cache.get(mentionedUser.id);
    if (targetMember) {
      targetMember.roles.add(targetRoleIdtt)
        .then(() => {
          // إرسال الرسالة المنسقة في القناة المخصصة
          const formattedMessage = messageFormat
            .replace('{mentionedUser}', mentionedUser.id)
            .replace('{firstMessage}', firstMessage)
            .replace('{secondMessage}', secondMessage);
          const logChannel = message.guild.channels.cache.get(logChannelIdtt);
          if (logChannel) {
            logChannel.send(formattedMessage);
          } else {
            console.error('Could not find log channel.');
          }
        })
        .catch((error) => {
          console.error('Error giving target role:', error);
          message.reply('حدث خطأ أثناء إعطاء الرتبة المستهدفة.');
        });
    } else {
      console.error('Could not find target member.');
      message.reply('حدث خطأ أثناء البحث عن الشخص المستهدف.');
    }
  }
});




client.on('messageCreate', (message) => {
  if (message.content.toLowerCase() === 'تصفير' && message.member.roles.cache.has('957442639001710619')) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('clearRolesButton')
          .setLabel('وزارة الداخلية')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('defenseRolesButton')
          .setLabel('وزارة الدفاع')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('healthRolesButton')
          .setLabel('وزارة الصحة')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('justiceRolesButton')
          .setLabel('وزارة العدل')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('micRolesButton')
          .setLabel('الميكانيك')
          .setStyle('PRIMARY'),
      );

    message.reply({
      content: 'اختر الوزارة المراد تصفيرها',
      components: [row],
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const member = interaction.member;
  if (!member.roles.cache.has('957442639001710619')) {
  }

  const targetRoles = {
    clearRolesButton: [
      '957442638947172354',
      '988803135554322483',
      '1048543455170809897',
      '1039147799083765890',
      '957442638947172352',
      '957442638930411570',
      '957442638930411569',
      '957442638930411568',
      '957442638930411567',
      '957442638930411566',
      '957442638930411562',
      '957442638930411561',
      '957442638909411376',
      '957442638909411374',
      '957442638909411373',
      '957442638909411371',
      '957442638909411369',
    ],
    defenseRolesButton: [
      '957442638825553952',
      '957442638825553951',
      '957442638825553950',
      '996057935132250153',
      '996057925351133236',
      '1028727891913093120',
      '1028729078804656168',
      '1025381448028520570',
      '1022233839180988446',
      '957442638796161033',
      '957442638796161032',
      '957442638796161031',
      '957442638796161030',
      '957442638796161029',
    ],
    healthRolesButton: [
      '957442638796161028',
      '957442638796161027',
      '957442638796161026',
      '957442638796161025',
      '957442638775210003',
      '957442638775209998',
      '957442638775210002',
      '957442638775210000',
      '957442638775209997',
      '957442638775209996',
      '957442638775209995',
      '957442638775209994',
      '957442638750031890',
    ],
    justiceRolesButton: [
      '1016614759191298089',
      '1016614763939254292',
      '1017681878997811200',
      '1017681874807697459',
      '1016615149420949504',
      '1081831937049645076',
      '1081217767572766810',
      '1060183175990607904',
      '1044915088261382194',
      '1016615153602666586',
    ],
    micRolesButton: [
      '957442638750031889',
      '957442638750031888',
      '957442638750031887',
      '957442638750031886',
      '957442638750031885',
      '957442638750031884',
    ],
  };

  const buttonId = interaction.customId;
  const rolesToRemove = targetRoles[buttonId];

  if (rolesToRemove) {
    try {
      // الحصول على جميع أعضاء الوزارة المختارة
      const members = interaction.guild.members.cache.filter((guildMember) =>
        guildMember.roles.cache.some((role) => rolesToRemove.includes(role.id))
      );

      // سحب الرتب من جميع الأعضاء
      members.forEach(async (guildMember) => {
        await guildMember.roles.remove(rolesToRemove);
      });

      interaction.reply(`تمت عملية التصفير بنجاح`);
    } catch (error) {
      console.error(`حدث خطأ أثناء سحب الرتب: ${error}`);
      interaction.reply('حدث خطأ أثناء سحب الرتب.');
    }
  }
});




const clientId = '520171813599182849';
const guildId = '957442638309638215';

const targetChannelId = '1196125204125069372'; // معرف القناة المستهدفة


// تخزين الوقت عند الضغط على زر تسجيل الدخول
const loginTimes = new Map();

client.once('ready', async () => {
  const targetChannel = client.channels.cache.get(targetChannelId);

  if (targetChannel && targetChannel.isText()) {
    const existingMessages = await targetChannel.messages.fetch();
    const existingMessage = existingMessages.first();

    if (existingMessage) {
      await existingMessage.edit({
        content: 'من الواجب على الجميع التسجيل أثناء تواجدهم بالمراقبة و خروجهم بعد الانتهاء من المراقبة',
        components: [
          new MessageActionRow().addComponents(
            new MessageButton().setCustomId('login_button').setLabel('تسجيل دخول').setStyle('SUCCESS'),
            new MessageButton().setCustomId('logout_button').setLabel('تسجيل خروج').setStyle('DANGER')
          ),
        ],
      });
    } else {
      const newMessage = await targetChannel.send({
        content: 'اختر نوع التسجيل:',
        components: [
          new MessageActionRow().addComponents(
            new MessageButton().setCustomId('login_button').setLabel('تسجيل دخول').setStyle('SUCCESS'),
            new MessageButton().setCustomId('logout_button').setLabel('تسجيل خروج').setStyle('DANGER')
          ),
        ],
      });
    }
  } else {
    console.error('Invalid or non-text channel specified.');
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const member = interaction.member;
  const memberId = member.id;

  if (interaction.customId === 'login_button') {
    const loginTime = Date.now();
    loginTimes.set(memberId, loginTime);
    interaction.reply(`قام الشخص <@${memberId}> بتسجيل الدخول.`);
  } else if (interaction.customId === 'logout_button') {
    const loginTime = loginTimes.get(memberId);

    if (loginTime) {
      const logoutTime = Date.now();
      const timeDifference = Math.floor((logoutTime - loginTime) / (1000 * 60)); // التفاوت بالدقائق

      interaction.reply(`قام الشخص <@${memberId}> بتسجيل الخروج.\nالوقت المقضي في الداخل: ${timeDifference} دقيقة.`);
      loginTimes.delete(memberId);
    } else {
      interaction.reply('يجب عليك تسجيل الدخول أولاً قبل تسجيل الخروج.');
    }
  }
});


const factions = ["993806845187727381", "957442638947172360", "1016614759191298089", "957442638825553952", "957442638796161028", "957442638750031889"];
const factionMember = "994009967600336976";

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache.map(role => role.id);
    const newRoles = newMember.roles.cache.map(role => role.id);

    // Check if the member gained any of the target roles
    const gainedRoles = factions.filter(roleId => !oldRoles.includes(roleId) && newRoles.includes(roleId));

    // Check if the member lost any of the target roles
    const lostRoles = factions.filter(roleId => oldRoles.includes(roleId) && !newRoles.includes(roleId));

    // Assign or remove the faction member role accordingly
    if (gainedRoles.length > 0) {
        newMember.roles.add(factionMember).catch(console.error);
    } else if (lostRoles.length > 0) {
        newMember.roles.remove(factionMember).catch(console.error);
    }
});

const gangs = ["957442638750031883", "957442638712307767", "957442638729068557", "957442638691307577", "957442638649384973", "1011242732116774913"];
const gangMember = "994009963695444099";

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache.map(role => role.id);
    const newRoles = newMember.roles.cache.map(role => role.id);

    // Check if the member gained any of the target roles
    const gainedRoles = gangs.filter(roleId => !oldRoles.includes(roleId) && newRoles.includes(roleId));

    // Check if the member lost any of the target roles
    const lostRoles = gangs.filter(roleId => oldRoles.includes(roleId) && !newRoles.includes(roleId));

    // Assign or remove the gang member role accordingly
    if (gainedRoles.length > 0) {
        newMember.roles.add(gangMember).catch(console.error);
    } else if (lostRoles.length > 0) {
        newMember.roles.remove(gangMember).catch(console.error);
    }
});


client.on('messageCreate', (message) => {
  if (message.content.startsWith(prefix + 'uptime')) {
    let days = Math.floor(message.client.uptime / 86400000);
    let hours = Math.floor((message.client.uptime / 3600000) % 24);
    let minutes = Math.floor((message.client.uptime / 60000) % 60);
    let seconds = Math.floor((message.client.uptime / 1000) % 60);
    message.reply(`**${seconds}s ${minutes}m ${hours}h ${days}d**`);
  }
});

client.login(process.env.token);
