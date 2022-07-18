exports.run = async (client, message, args, con, data) => {

    let inviteButton = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`LINK`)
        .setLabel(`Invite Me`)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    )
    if(client.config.website.siteDomain != "" && client.config.website.enabled) {
        inviteButton.addComponents(
            new client.discord.MessageButton()
            .setStyle(`LINK`)
            .setLabel(`Our Website`)
            .setURL(client.config.website.siteDomain)
        )
    }
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.colorhex)
    .setDescription(`**🏓 Ping**: ${Date.now() - message.createdTimestamp}ms.\n**😎 Users**: ${client.users.cache.size}\n**🛡️ Guilds**: ${client.guilds.cache.size}\n\n**[Support Server](${client.config.supportserver})**\n**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)**`)
    message.channel.send({ embeds: [embed], components: [inviteButton] }).catch(e => {});

}

exports.info = {
    name: "stats",
    description: "See this bots statistics!",
    aliases: ['statz', 'statistics']
}