module.exports = async(client, con, interaction) => {

    try {

        let edited = new client.discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setTitle(`${client.user.username} Help Menu`)
        .setThumbnail(client.user.avatarURL({ dynamic: true }))

        let disabledButtonHistory = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('disabledButtonHistory')
            .setLabel(`No Bans Found.`)
            .setStyle(`DANGER`)
            .setDisabled(true)
        )

        let row = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('helpPageLeft')
            .setLabel(`Back`)
            .setStyle(`PRIMARY`),
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('helpPageRight')
            .setLabel(`Next`)
            .setStyle(`PRIMARY`),
        )

        let page2 = "`ping` - Check latency.\n`help` - Gets you this menu.\n`invite` - Get a link to invite the bot.\n`stats` - View the bots statistics.\n`search` - Check if a user is banned.\n`report` - File a report to the bot.\n`appeal` - File an appeal with the bot.\n`blockurl` - Block a URL from being said.\n`unblockurl` - Unblock a URL from being said.\n`stickyadd` - Add a sticky message.\n`stickyremove` - Remove a sticky message.\n`serverlock` - Enable server lockdown.\n`updatebans` - Update the bans in your guild.\n`prefix` - Change the bots prefix in this guild.\n`settings` - Change your guilds settngs.\n`guilds` - See the guilds that this bot is in.\n`credits` - View the bots credits.";
        let page3 = "`announce` - Send out a global annoucement to all logging channels.\n`ban` - Ban a user in the database.\n`unban` - Unban a user in the database.\n`staffadd` - Add a user to the staff table.\n`staffremove` - Remove a user from the staff table.";
        let page4 = `**Credits**\n[@Hyperz](https://hyperz.net/) - *Physical Programming.*\n[@StrongerTogether](https://strongertogether.network/) - *Design inspiration.*`;

        if (!interaction.isButton()) return;
        let message = interaction.message
        if (interaction.customId === 'helpPageLeft') {

            // CODE FOR GOING BACK PAGES

            if(message.embeds) {
                message.embeds.forEach(embed => {
                    if(embed.footer.text.includes('Page 1/4')) {
                        edited.fields = null;
                        edited.setDescription(page4);
                        edited.setFooter({ text: `Page 3/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    } else if(embed.footer.text.includes('Page 3/4')) {
                        edited.fields = null;
                        edited.setDescription(page2);
                        edited.setFooter({ text: `Page 2/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    } else if(embed.footer.text.includes('Page 4/4')) {
                        edited.fields = null;
                        edited.setDescription(page3);
                        edited.setFooter({ text: `Page 3/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    }  else if(embed.footer.text.includes('Page 2/4')) {
                        edited.setDescription(``);
                        edited.addFields(
                            { name: "Bot Name", value: `\`${client.user.username}\``, inline: true, },
                            { name: "Default Prefix", value: `\`${client.config.prefix}\``, inline: true, },
                            { name: "About Server", value: `${client.config.aboutServer}`, inline: false, },
                            { name: "Copyright", value: `${client.config.copyright}`, inline: false, },
                        )
                        edited.setFooter({ text: `Page 1/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    }
                });
            }
        } else if (interaction.customId === 'helpPageRight') {

            // CODE FOR GOING FORWARD PAGES

            if(message.embeds) {
                message.embeds.forEach(embed => {
                    if(embed.footer.text.includes('Page 1/4')) {
                        edited.fields = null;
                        edited.setDescription(page2);
                        edited.setFooter({ text: `Page 2/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    } else if(embed.footer.text.includes('Page 2/4')) {
                        edited.fields = null;
                        edited.setDescription(page3);
                        edited.setFooter({ text: `Page 3/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    } else if(embed.footer.text.includes('Page 3/4')) {
                        edited.fields = null;
                        edited.setDescription(page4);
                        edited.setFooter({ text: `Page 4/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    } else if(embed.footer.text.includes('Page 4/4')) {
                        edited.setDescription(``);
                        edited.addFields(
                            { name: "Bot Name", value: `\`${client.user.username}\``, inline: true, },
                            { name: "Default Prefix", value: `\`${client.config.prefix}\``, inline: true, },
                            { name: "About Server", value: `${client.config.aboutServer}`, inline: false, },
                            { name: "Copyright", value: `${client.config.copyright}`, inline: false, },
                        )
                        edited.setFooter({ text: `Page 1/4` })
                        message.edit({ embeds: [edited], components: [row] }).catch(e => {})
                        interaction.deferUpdate();
                    }
                });
            }
        } else if (interaction.customId === 'autoBansToggle') {
            let guild = interaction.guild.id
            let check = await client.utils.checkAdmin(interaction.member)
            if(!check) return interaction.reply({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});
            await con.query(`SELECT * FROM guilds WHERE guildid='${guild}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    let autobans;
                    let autounbans;
                    let loggingchannelid;
                    if(row[0].autobans == 'true') {
                        autobans = 'SUCCESS';
                    } else {
                        autobans = 'DANGER';
                    }
                    if(row[0].autounbans == 'true') {
                        autounbans = 'SUCCESS';
                    } else {
                        autounbans = 'DANGER';
                    }
                    if(row[0].loggingchannelid == '0') {
                        loggingchannelid = '';
                    } else {
                        let dechannel = await client.channels.cache.get(row[0].loggingchannelid)
                        if(dechannel == undefined) {
                            loggingchannelid = '';
                        } else {
                            loggingchannelid = dechannel.name;
                        }
                    }
                    let channelRow = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('logchandisabled')
                        .setLabel(`Logging channel:`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('curlogchandisabled')
                        .setLabel(`Current: ${loggingchannelid}`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('changeLogChannel')
                        .setLabel(`Change`)
                        .setStyle(`PRIMARY`),
                    )
                    let data = {
                        a: autobans,
                        b: autounbans,
                        id: guild
                    }
                    if(data.a == 'SUCCESS') {
                        await con.query(`UPDATE guilds SET autobans='false' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                            if(err) throw err;
                        });
                        let topRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoBans')
                            .setLabel(`Auto bans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoBansToggle')
                            .setLabel(`Disabled`)
                            .setStyle(`DANGER`),
                        )
                        let bottomRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoUnBans')
                            .setLabel(`Auto unbans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        if(data.b == 'SUCCESS') {
                            bottomRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoUnBansToggle')
                                .setLabel(`Enabled`)
                                .setStyle(`SUCCESS`),
                            )
                        } else {
                            bottomRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoUnBansToggle')
                                .setLabel(`Disabled`)
                                .setStyle(`DANGER`),
                            )
                        }
                        await interaction.update({ components: [topRow, bottomRow, channelRow] }).catch(e => {});
                    } else {
                        await con.query(`UPDATE guilds SET autobans='true' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                            if(err) throw err;
                        });
                        let topRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoBans')
                            .setLabel(`Auto bans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoBansToggle')
                            .setLabel(`Enabled`)
                            .setStyle(`SUCCESS`),
                        )
                        let bottomRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoUnBans')
                            .setLabel(`Auto unbans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        if(data.b == 'SUCCESS') {
                            bottomRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoUnBansToggle')
                                .setLabel(`Enabled`)
                                .setStyle(`SUCCESS`),
                            )
                        } else {
                            bottomRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoUnBansToggle')
                                .setLabel(`Disabled`)
                                .setStyle(`DANGER`),
                            )
                        }
                        await interaction.update({ components: [topRow, bottomRow, channelRow] }).catch(e => {});
                    }
                }
            });
        } else if (interaction.customId === 'autoUnBansToggle') {
            let guild = interaction.guild.id
            let check = await client.utils.checkAdmin(interaction.member)
            if(!check) return interaction.reply({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});
            await con.query(`SELECT * FROM guilds WHERE guildid='${guild}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    let autobans;
                    let autounbans;
                    let loggingchannelid;
                    if(row[0].autobans == 'true') {
                        autobans = 'SUCCESS';
                    } else {
                        autobans = 'DANGER';
                    }
                    if(row[0].autounbans == 'true') {
                        autounbans = 'SUCCESS';
                    } else {
                        autounbans = 'DANGER';
                    }
                    if(row[0].loggingchannelid == '0') {
                        loggingchannelid = '';
                    } else {
                        let dechannel = await client.channels.cache.get(row[0].loggingchannelid)
                        if(dechannel == undefined) {
                            loggingchannelid = '';
                        } else {
                            loggingchannelid = dechannel.name;
                        }
                    }
                    let channelRow = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('logchandisabled')
                        .setLabel(`Logging channel:`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('curlogchandisabled')
                        .setLabel(`Current: ${loggingchannelid}`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('changeLogChannel')
                        .setLabel(`Change`)
                        .setStyle(`PRIMARY`),
                    )
                    let data = {
                        a: autobans,
                        b: autounbans,
                        id: guild
                    }
                    if(data.b == 'SUCCESS') {
                        await con.query(`UPDATE guilds SET autounbans='false' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                            if(err) throw err;
                        });
                        let topRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoBans')
                            .setLabel(`Auto bans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        let bottomRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoUnBans')
                            .setLabel(`Auto unbans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoUnBansToggle')
                            .setLabel(`Disabled`)
                            .setStyle(`DANGER`),
                        )
                        if(data.a == 'SUCCESS') {
                            topRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoBansToggle')
                                .setLabel(`Enabled`)
                                .setStyle(`SUCCESS`),
                            )
                        } else {
                            topRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoBansToggle')
                                .setLabel(`Disabled`)
                                .setStyle(`DANGER`),
                            )
                        }
                        await interaction.update({ components: [topRow, bottomRow, channelRow] }).catch(e => {});
                        
                    } else {
                        await con.query(`UPDATE guilds SET autounbans='true' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                            if(err) throw err;
                        });
                        let topRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoBans')
                            .setLabel(`Auto bans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        let bottomRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('disabledAutoUnBans')
                            .setLabel(`Auto unbans:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoUnBansToggle')
                            .setLabel(`Enabled`)
                            .setStyle(`SUCCESS`),
                        )
                        if(data.a == 'SUCCESS') {
                            topRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoBansToggle')
                                .setLabel(`Enabled`)
                                .setStyle(`SUCCESS`),
                            )
                        } else {
                            topRow.addComponents(
                                new client.discord.MessageButton()
                                .setCustomId('autoBansToggle')
                                .setLabel(`Disabled`)
                                .setStyle(`DANGER`),
                            )
                        }
                        await interaction.update({ components: [topRow, bottomRow, channelRow] }).catch(e => {});
                    }
                }
            });
        } else if (interaction.customId === 'changeLogChannel') {
            let guild = interaction.guild.id
            let check = await client.utils.checkAdmin(interaction.member)
            if(!check) return interaction.reply({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});
            const filter = m => m.author.id === interaction.message.embeds[0].footer.text;
            let replyEmbedLol = new client.discord.MessageEmbed()
            .setColor(client.config.colorhex)
            .setDescription(`Logging Channel Configuration.`)
            let changeRow = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId('changeLogChannelMessage')
                .setLabel(`What channel would you like to use for logging? Type no to remove.`)
                .setStyle(`PRIMARY`)
                .setDisabled(true),
            )
            await interaction.reply({ embeds: [replyEmbedLol], components: [changeRow] }).catch(e => {});
            let newChannel;
            const collector = interaction.message.channel.createMessageCollector({ filter, time: 1000000, max: 1 });
            collector.on('collect', async m => {
                if(m.mentions.channels.first()) {
                    newChannel = m.mentions.channels.first().id;
                } else if (!isNaN(m.content)) {
                    newChannel = m.content.toLowerCase();
                } else if(m.content.toLowerCase() == 'no') {
                    newChannel = '0';
                } else {
                    let shitRow = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('logChannelError')
                        .setLabel(`Channel not found. Process cancelled.`)
                        .setStyle(`DANGER`)
                        .setDisabled(true),
                    )
                    await interaction.message.channel.send({ components: [shitRow] }).catch(e => {});
                    newChannel = 'error';
                    return;
                }
                m.delete().catch(e => {});
            });
            collector.on('end', async collected => {
                await con.query(`SELECT * FROM guilds WHERE guildid='${guild}'`, async (err, row) => {
                    if(err) throw err;
                    if(!row[0]) return client.utils.guildAdd(client, con, interaction.guild);

                    let autobans;
                    let autounbans;
                    if(row[0].autobans == 'true') {
                        autobans = 'SUCCESS';
                    } else if(row[0].autobans == 'false') {
                        autobans = 'DANGER';
                    }
                    if(row[0].autounbans == 'true') {
                        autounbans = 'SUCCESS';
                    } else if(row[0].autounbans == 'false') {
                        autounbans = 'DANGER';
                    }
                    let topRow = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('disabledAutoBans')
                        .setLabel(`Auto bans:`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    let bottomRow = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setCustomId('disabledAutoUnBans')
                        .setLabel(`Auto unbans:`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    )
                    if(autobans == 'SUCCESS') {
                        topRow.addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoBansToggle')
                            .setLabel(`Enabled`)
                            .setStyle(`SUCCESS`),
                        )
                    } else {
                        topRow.addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoBansToggle')
                            .setLabel(`Disabled`)
                            .setStyle(`DANGER`),
                        )
                    }
                    if(autounbans == 'SUCCESS') {
                        bottomRow.addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoUnBansToggle')
                            .setLabel(`Enabled`)
                            .setStyle(`SUCCESS`),
                        )
                    } else {
                        bottomRow.addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('autoUnBansToggle')
                            .setLabel(`Disabled`)
                            .setStyle(`DANGER`),
                        )
                    }

                    if(newChannel == 'error') return;
                    if(newChannel == '0') {
                        let channelRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('logchandisabled')
                            .setLabel(`Logging channel:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('curlogchandisabled')
                            .setLabel(`Current: `)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('changeLogChannel')
                            .setLabel(`Change`)
                            .setStyle(`PRIMARY`),
                        )
                        await con.query(`UPDATE guilds SET loggingchannelid='0' WHERE guildid='${guild}'`, async (err, row) => {
                            if(err) throw err;
                            await interaction.message.channel.send({ components: [topRow, bottomRow, channelRow] }).catch(e => {});
                        });
                        return;
                    }
                    newChannel = await client.channels.cache.get(newChannel);
                    await con.query(`UPDATE guilds SET loggingchannelid='${newChannel.id}' WHERE guildid='${guild}'`, async (err, row) => {
                        if(err) throw err;
                        let channelRow = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('logchandisabled')
                            .setLabel(`Logging channel:`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('curlogchandisabled')
                            .setLabel(`Current: ${newChannel.name}`)
                            .setStyle(`SECONDARY`)
                            .setDisabled(true),
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                            .setCustomId('changeLogChannel')
                            .setLabel(`Change`)
                            .setStyle(`PRIMARY`),
                        )
                        await interaction.deleteReply().catch(e => {})
                        await interaction.message.edit({ components: [topRow, bottomRow, channelRow] }).catch(e => {
                            console.log(e)
                        });
                    });
                });
            });
        } else if (interaction.customId === 'confirmBanUpdates') {
            let updateStarting = new client.discord.MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Update Confirmed!`)
            .setDescription(`We are updating your guilds ban list now.\nThis may take awhile ⏰`)
            .setTimestamp()
            .setFooter({ text: client.config.copyright })
            let buttons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId(`actionDisabled`)
                .setLabel(`Action:`)
                .setStyle(`SECONDARY`)
                .setDisabled(true)
            )
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId(`confirmedDisabled`)
                .setLabel(`Confirmed`)
                .setStyle(`PRIMARY`)
                .setDisabled(true)
            )
            let guild = await client.guilds.cache.get(interaction.message.embeds[0].footer.text);
            if(guild == undefined) return;
            await interaction.update({ embeds: [updateStarting], components: [buttons] }).catch(e => {});
            await con.query(`SELECT * FROM bans WHERE active='true'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return;
                await row.forEach(async (data) => {
                    try {
                        await guild.members.ban(`${data.userid}`, {
                            reason: `${data.timeofban} | ${data.reason} | ${data.proof}`
                        }).catch(e => {
                            if(client.config.debugmode) {
                                console.log(`Guild Id: ${guild.id} failed to ban ${args[0]}.\n`, e.stack);
                            }
                        });
                    } catch(e) {}
                });
            });
        } else if (interaction.customId === 'cancelBanUpdates') {
            let buttons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId(`actionDisabled`)
                .setLabel(`Action:`)
                .setStyle(`SECONDARY`)
                .setDisabled(true)
            )
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId(`cancelledDisabled`)
                .setLabel(`Cancelled`)
                .setStyle(`DANGER`)
                .setDisabled(true)
            )
            await interaction.update({ components: [buttons] }).catch(e => {});
        } else if (interaction.customId === 'nextHistory') {
            let historyButtons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Back`)
                .setCustomId(`backHistory`)
            )
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Next`)
                .setCustomId(`nextHistory`)
            )
            await con.query(`SELECT * FROM bans WHERE userid='${interaction.message.embeds[0].author.name}' AND active='false'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                let select = Number(interaction.message.embeds[0].footer.text) + 1
                if(!row[select]) {
                    select = 0;
                    if(!row[select]) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                }
                let user = await client.users.fetch(interaction.message.embeds[0].author.name)
                if(user == undefined) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                let updateEmbed = new client.discord.MessageEmbed()
                .setAuthor({ name: interaction.message.embeds[0].author.name, iconURL: interaction.message.embeds[0].author.iconURL })
                .setTitle(`Inactive Ban!`)
                .setColor(client.config.colorhex)
                .addFields(
                    { name: "User Tag", value: `${user.tag}`, inline: true },
                    { name: "User Id", value: `${user.id}`, inline: true },
                    { name: "Time", value: `${row[select].timeofban}`, inline: true },
                    { name: "Reason", value: `${row[select].reason}`, inline: true },
                )
                .setImage(row[select].proof)
                .setFooter({ text: `${select}` })
                await interaction.update({ embeds: [updateEmbed], components: [historyButtons] }).catch(e => {});
            });
        } else if (interaction.customId === 'backHistory') {
            let historyButtons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Back`)
                .setCustomId(`backHistory`)
            )
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Next`)
                .setCustomId(`nextHistory`)
            )
            await con.query(`SELECT * FROM bans WHERE userid='${interaction.message.embeds[0].author.name}' AND active='false'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                let select = Number(interaction.message.embeds[0].footer.text) - 1
                if(!row[select]) {
                    select = 0;
                    if(!row[select]) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                }
                let user = await client.users.fetch(interaction.message.embeds[0].author.name)
                if(user == undefined) return interaction.update({ components: [disabledButtonHistory] }).catch(e => {});
                let updateEmbed = new client.discord.MessageEmbed()
                .setAuthor({ name: interaction.message.embeds[0].author.name, iconURL: interaction.message.embeds[0].author.iconURL })
                .setTitle(`Inactive Ban!`)
                .setColor(client.config.colorhex)
                .addFields(
                    { name: "User Tag", value: `${user.tag}`, inline: true },
                    { name: "User Id", value: `${user.id}`, inline: true },
                    { name: "Time", value: `${row[select].timeofban}`, inline: true },
                    { name: "Reason", value: `${row[select].reason}`, inline: true },
                )
                .setImage(row[select].proof)
                .setFooter({ text: `${select}` })
                await interaction.update({ embeds: [updateEmbed], components: [historyButtons] }).catch(e => {});
            });
        } else if (interaction.customId === 'backGuilds') {
            let guildListButtons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Back`)
                .setCustomId('backGuilds')
            )
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Next`)
                .setCustomId('nextGuilds')
            )
            await con.query(`SELECT * FROM guilds`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return;
                let curr = Number(interaction.message.embeds[0].footer.text) - 1;
                if(!row[curr]) curr = 0;
                let guild = await client.guilds.cache.get(row[curr].guildid);
                if(guild == undefined) return;
                let owner = await client.users.fetch(guild.ownerId);
                if(owner == undefined) return;
                let guildList = new client.discord.MessageEmbed()
                .setColor(client.config.colorhex)
                .setTitle(`Guilds List`)
                .setDescription(`**○ Guild Name:** ${guild.name}\n**○ Guild Id:** ${guild.id}\n**○ Guild Members:** ${guild.members.cache.size}\n\n**○ Guild Owner Tag:** ${owner.tag}\n**○ Guild Owner Id:** ${owner.id}`)
                .setTimestamp()
                .setFooter({ text: `${curr}` })
                try { embed.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
                interaction.update({ embeds: [guildList], components: [guildListButtons] }).catch(e => {});
            });
        } else if (interaction.customId === 'nextGuilds') {
            let guildListButtons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Back`)
                .setCustomId('backGuilds')
            )
            .addComponents(
                new client.discord.MessageButton()
                .setStyle(`SECONDARY`)
                .setLabel(`Next`)
                .setCustomId('nextGuilds')
            )
            await con.query(`SELECT * FROM guilds`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return;
                let curr = Number(interaction.message.embeds[0].footer.text) + 1;
                if(!row[curr]) curr = 0;
                let guild = await client.guilds.cache.get(row[curr].guildid);
                if(guild == undefined) return;
                let owner = await client.users.fetch(guild.ownerId);
                if(owner == undefined) return;
                let guildList = new client.discord.MessageEmbed()
                .setColor(client.config.colorhex)
                .setTitle(`Guilds List`)
                .setDescription(`**○ Guild Name:** ${guild.name}\n**○ Guild Id:** ${guild.id}\n**○ Guild Members:** ${guild.members.cache.size}\n\n**○ Guild Owner Tag:** ${owner.tag}\n**○ Guild Owner Id:** ${owner.id}`)
                .setTimestamp()
                .setFooter({ text: `${curr}` })
                try { guildList.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
                interaction.update({ embeds: [guildList], components: [guildListButtons] }).catch(e => {});
            });
        }
    } catch(e) {}

}