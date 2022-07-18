const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {
    if(message.mentions.users.first()) return message.channel.send({ content: "Please use user Ids, do not mention users." }).catch(e => {});
    const filter = m => m.author.id === message.author.id;
    await con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return message.channel.send({ content: "You do not have permission to use this command." }).catch(e => {});
        if(!args[0]) return message.channel.send({ content: `**Invalid Command Format:** See template below:\n\`${data.prefix}ban {userId} {reason}\`` }).catch(e => {});
        if(!args[1]) return message.channel.send({ content: `**Invalid Command Format:** See template below:\n\`${data.prefix}ban {userId} {reason}\`` }).catch(e => {});
        let reason = args.slice(1).join(" ").replaceAll('"', '').replaceAll("`", "")
        await con.query(`SELECT * FROM bans WHERE active='true' AND userid='${args[0]}'`, async (err, row) => {
            if(err) throw err;
            if(row[0]) return message.channel.send({ content: "This user is already actively banned." });
            const moment = require('moment');
            let datetime = moment().format(client.config.date_format);
            message.channel.send({ content: "Please provide image **link** proof \`below this message\`.\nLink must end with `jpg`, `png`, `jpeg`, `webp`, etc" }).then(async (msg) => {
                    const collector = msg.channel.createMessageCollector({ filter, time: 1000000, max: 8 });
                    let proof;
                    collector.on('collect', async m => {
                        if(!m.content.includes('http')) {
                            message.channel.send({ content: "`ERROR:` Image proof must begin with `http://` or `https://`" })
                        } else {
                            proof = m.content
                            collector.stop()
                        }
                    });
    
                    collector.on('end', async collected => {
                        await con.query(`INSERT INTO bans (active, userid, reason, proof, timeofban, staffId, staffTag) VALUES ("true", "${args[0]}", "${reason}", "${proof}", "${datetime}", "${message.author.id}", "${message.author.tag.replaceAll('"', '')}")`, async (err, row) => {
                            if(err) throw err;
                            let user = await client.users.fetch(args[0])
                            if(user == undefined) {
                                if(client.config.debugmode) {
                                    console.log(`User Id: ${args[0]} returned undefined when inserting a ban. This user does not exist or Discord API is having a Hiccup.`)
                                }
                                return;
                            }
                            let buttons = new client.discord.MessageActionRow()
                            .addComponents(
                                new client.discord.MessageButton()
                                .setCustomId(`optionsDisabled`)
                                .setLabel(`Options:`)
                                .setStyle(`PRIMARY`)
                                .setDisabled(true),
                            )
                            .addComponents(
                                new client.discord.MessageButton()
                                .setLabel(`Appeal`)
                                .setStyle(`LINK`)
                                .setURL(client.config.supportserver),
                            )
                            if(client.config.website.siteDomain != "" && client.config.website.enabled) {
                                buttons.addComponents(
                                    new client.discord.MessageButton()
                                    .setStyle(`LINK`)
                                    .setLabel(`Our Website`)
                                    .setURL(client.config.website.siteDomain)
                                )
                            }
                            let alertKick = new client.discord.MessageEmbed()
                            .setColor(client.config.colorhex)
                            .setTitle('You were banned!')
                            .setDescription(`**○ User Tag:** ${user.tag}\n**○ User Id:** ${user.id}\n**○ Time of ban:** ${datetime}\n**○ Staff Member:** ${message.author.tag}\n**○ Reason:** ${reason}\n**○ Proof:** ${proof}`)
                            .setTimestamp()
                            .setFooter({ text: client.config.copyright })
                            try { alertKick.setThumbnail(user.avatarURL({ dynamic: true })) } catch(e) {}
                            try { alertKick.setImage(proof) } catch(e) {}
                            await user.send({ embeds: [alertKick], components: [buttons] }).catch(e => {
                                if(client.config.debugmode) {
                                    console.log(`Error alerting user Id: ${args[0]} of their ban.\n`, e.stack);
                                }
                            });
                            await con.query(`SELECT * FROM guilds WHERE autobans='true'`, async (err, row) => {
                                if(err) throw err;
                                let embed = new client.discord.MessageEmbed()
                                .setColor(client.config.colorhex)
                                .setTitle("New Active Ban!")
                                .setThumbnail(user.avatarURL({ dynamic: true }))
                                .setDescription(`**○ User Tag:** ${user.tag}\n**○ User Id:** ${args[0]}\n**○ Banned:** \`true\`\n**○ Time of ban:** ${datetime}\n**○ Staff Member:** ${message.author.tag}\n**○ Reason:** ${reason}\n**○ Proof:** ${proof}`)
                                .setTimestamp()
                                .setFooter({ text: client.config.copyright })
                                try { embed.setImage(proof) } catch(e) {}
                                await row.forEach(async data => {
                                    let guild = await client.guilds.cache.get(data.guildid)
                                    try {
                                        if(guild != undefined) {
                                            await guild.members.ban(user.id, {
                                                reason: `${reason} | ${proof} | ${client.user.tag}`
                                            }).catch(e => {
                                                if(client.config.debugmode) {
                                                    console.log(`Guild Id: ${guild.id} failed to ban ${args[0]}.\n`, e.stack);
                                                }
                                            });
                                            if(data.loggingchannelid != '0') {
                                                let channel = await client.channels.cache.get(data.loggingchannelid)
                                                if(channel != undefined) {
                                                    await channel.send({ embeds: [embed] }).catch(e => {});
                                                }
                                            }
                                        }
                                    } catch(e) {}
                                });
                                await message.channel.send({ embeds: [embed] }).catch(e => {});
                                await client.utils.mainchan(client, embed)
                            });
                        });
                    });
                });
            });
    });
}

exports.info = {
    name: "ban",
    description: "A Command.",
    aliases: []
}