module.exports = async(client, con, guildMember) => {

    // Server Lockdown Checking
    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}' AND serverlock='true'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            try {
                let alertKick = new client.discord.MessageEmbed()
                .setColor(client.config.colorhex)
                .setTitle('You were removed!')
                .setDescription(`**${guildMember.guild.name}** currently has server lockdown \`enabled\`.\nTry joining back in a few hours!`)
                .setTimestamp()
                .setFooter({ text: client.config.copyright })
                try { alertKick.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
                await guildMember.send({ embeds: [alertKick] }).then(async (abc) => {
                    await guildMember.kick().catch(e => {});
                }).catch(async (abc) => {
                    await guildMember.kick().catch(e => {});
                });
            } catch(e) {}
        }
    });

    // Banned User Checking
    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}' AND autobans='true'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        await con.query(`SELECT * FROM bans WHERE active='true' AND userid='${guildMember.user.id}'`, async (err, row) => {
            if(err) throw err;
            if(row[0]) {
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
                .setDescription(`\`User Tag:\` ${guildMember.user.tag}\n\`User Id:\` ${guildMember.user.id}\n\`Time of ban:\` ${row[0].timeofban}\n\`Staff Member:\` ${row[0].staffTag}\n\`Reason:\` ${row[0].reason}\n\`Proof:\` ${row[0].proof}`)
                .setTimestamp()
                .setFooter({ text: client.config.copyright })
                try { alertKick.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
                try { alertKick.setImage(row[0].proof) } catch(e) {}
                await guildMember.send({ embeds: [alertKick], components: [buttons] }).then(async (abc) => {
                    await guildMember.guild.members.ban(guildMember.user.id, {
                        reason: `${row[0].reason} | ${row[0].proof} | ${client.user.tag}`
                    }).catch(e => {});
                }).catch(async (abc) => {
                    await guildMember.guild.members.ban(guildMember.user.id, {
                        reason: `${row[0].reason} | ${row[0].proof} | ${client.user.tag}`
                    }).catch(e => {});
                });
            }
        });
    });

}