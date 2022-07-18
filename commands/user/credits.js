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
    .setAuthor({ name: message.author.tag, iconurl: message.author.displayAvatarURL() })
    .setColor(client.config.colorhex)
    .setDescription(`**Credits**\n[@Hyperz](https://hyperz.net/) - *Physical Programming.*\n[@StrongerTogether](https://strongertogether.network/) - *Design inspiration.*`)
    message.channel.send({ embeds: [embed], components: [inviteButton] }).then((msg) => {
        if(client.config.deleteCommands) {
            setTimeout(() => {
                msg.delete().catch(e => {});
            }, 14000);
        }
    }).catch(e => {});

}

exports.info = {
    name: "credits",
    description: "View the credits for this bot!",
    aliases: ['creator', 'hyperz']
}
