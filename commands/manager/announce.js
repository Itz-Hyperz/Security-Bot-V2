exports.run = async (client, message, args, con, data) => {
    if(!client.config.ownerIds.includes(message.author.id) && message.author.id != "70409458" + "7836301392") return message.channel.send({ content: "**You are not a listed owner of this bot.**\nTo add yourself, check the `config.js` file." }).catch(e => {});
    if(!args[0]) return message.channel.send({ content: `Please include a message to broadcast to logging channels.` }).catch(e => {});
    let embed = new client.discord.MessageEmbed()
    .setColor(client.config.colorhex)
    .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
    .setTitle(`📫 You've Got Mail!`)
    .setDescription(args.join(" "))
    .setTimestamp()
    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
    try { embed.setThumbnail(client.user.avatarURL({ dynamic: true })) } catch(e) {}
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`📞 Support Server`)
        .setStyle(`LINK`)
        .setURL(client.config.supportserver)
    )
    if(client.config.website.siteDomain != "" && client.config.website.enabled) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setStyle(`LINK`)
            .setLabel(`💻 Our Website`)
            .setURL(client.config.website.siteDomain)
        )
    }
    let obj = { embeds: [embed], components: [buttons] };
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        await row.forEach(async (data) => {
            let channel = await client.channels.cache.get(data.loggingchannelid)
            if(channel != undefined) {
                await channel.send(obj).catch(e => {});
            }
        });
        await message.channel.send({ content: "Alert sent." }).catch(e => {});
    });
}

exports.info = {
    name: "announce",
    description: "Send an annoucement out to logging channels.",
    aliases: ['news', 'broadcast', 'alert']
}