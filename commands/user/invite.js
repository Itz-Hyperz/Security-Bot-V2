exports.run = async (client, message, args, con, data) => {

    let inviteButton = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`LINK`)
        .setLabel(`Invite Me`)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    )
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.colorhex)
    .setDescription(`You can invite me below with the button!`)
    message.channel.send({ embeds: [embed], components: [inviteButton] }).catch(e => {});

}

exports.info = {
    name: "invite",
    description: "Get an invite for this bot!",
    aliases: ['inv', 'bot']
}