const { MessageEmbed } = require('discord.js');

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
    .setDescription(`🏓 Latency is: **${Date.now() - message.createdTimestamp}ms.**`)
    message.channel.send({ embeds: [embed], components: [inviteButton] }).then((msg) => {
        if(client.config.deleteCommands) {
            setTimeout(() => {
                msg.delete().catch(e => {});
            }, 14000);
        }
    }).catch(e => {});

}

exports.info = {
    name: "ping",
    description: "A Command.",
    aliases: ['bing']
}