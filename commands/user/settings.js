const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`." }).catch(e => {});

    let guild = message.guild.id
    await con.query(`SELECT * FROM guilds WHERE guildid='${guild}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let autobans;
            let autounbans;
            let loggingchannelid;
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

        
            let embed = new client.discord.MessageEmbed()
            .setColor(client.config.colorhex)
            .setAuthor({ name: `Guild Settings | ${message.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setDescription(`Update the settings for this guild.`)
            .setFooter({ text: message.author.id })
            .setTimestamp()
        
            await message.channel.send({ embeds: [embed], components: [topRow, bottomRow, channelRow] }).catch(e => { console.log(e) });
        } else {
            let info = { id: guild }
            await client.utils.guildAdd(client, con, info);
        }
    });

}

exports.info = {
    name: "settings",
    description: "A Command.",
    aliases: ['config', 'setup']
}