const { Client } = require('discord.js');
const dotenv = require('dotenv')
const request = require('request')
dotenv.config({ path: 'dotenv' })
const tokens = process.env.guildTokens.split(',')
const mainToken = process.env.mainToken;

for (const token of tokens) {
   const client = new Client({
      disabledEvents: [
         "GUILD_UPDATE",
         "GUILD_MEMBER_ADD",
         "GUILD_MEMBER_REMOVE",
         "GUILD_MEMBER_UPDATE",
         "GUILD_MEMBERS_CHUNK",
         "GUILD_ROLE_CREATE",
         "GUILD_ROLE_DELETE",
         "GUILD_ROLE_UPDATE",
         "GUILD_BAN_ADD",
         "GUILD_BAN_REMOVE",
         "CHANNEL_CREATE",
         "CHANNEL_DELETE",
         "CHANNEL_UPDATE",
         "CHANNEL_PINS_UPDATE",
         "MESSAGE_DELETE",
         "MESSAGE_UPDATE",
         "MESSAGE_DELETE_BULK",
         "MESSAGE_REACTION_ADD",
         "MESSAGE_REACTION_REMOVE",
         "MESSAGE_REACTION_REMOVE_ALL",
         "USER_UPDATE",
         "USER_NOTE_UPDATE",
         "USER_SETTINGS_UPDATE",
         "PRESENCE_UPDATE",
         "VOICE_STATE_UPDATE",
         "TYPING_START",
         "VOICE_SERVER_UPDATE",
         "RELATIONSHIP_ADD",
         "RELATIONSHIP_REMOVE",
      ]
   });

   setTimeout(() => {
      client.login(token).catch(console.error)
   }, 1000)

   client.on('message', async msg => {
      const code = msg.content.match(/discord\.gift\/[^\s]+/gmi);
      if(code === null) return;
      for (let i = 0; i < code.length; i++) {
         var c = code[i].replace('discord.gift/', '')
         await request.post(`https://discordapp.com/api/v6/entitlements/gift-codes/${c}/redeem`, {
            headers: {
               "authorization": mainToken,
               "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36"
            }
         }, function (err, res, b) {
            const body = JSON.parse(b)
            const response = `[Nitro Sniper] (${c}) -`
            if (body.message == "This gift has been redeemed already.") {
               console.log(`${response} Already redeemed - ${msg.guild ? msg.guild.name : "DMs"}`)
            } else if ('subscription_plan' in body) {
               console.log(`${response} SUCCESS! Nitro Redeemed - ${msg.guild ? msg.guild.name : "DMs"}`)
            } else if (body.message == "Unknown Gift Code") {
               console.log(`${response} Invalid Code - ${msg.guild ? msg.guild.name : "DMs"}`)
            }
         })
      }
   })

   client.on('ready', async msg => {
      console.log(`[Nitro Sniper] Logged in as ${client.user.tag}.`)
   })
}
