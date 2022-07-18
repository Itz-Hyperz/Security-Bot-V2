exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId(`confirmBanUpdates`)
        .setLabel(`Confirm`)
        .setStyle(`PRIMARY`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId(`cancelBanUpdates`)
        .setLabel(`Cancel`)
        .setStyle(`DANGER`)
    )

    let confirmEmbed = new client.discord.MessageEmbed()
    .setColor(client.config.colorhex)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setTitle(`Update Bans`)
    .setDescription(`Please confirm that you would like to update your guilds bans to include all currently active bans that are stored inside of the ${client.user.username} ban database.`)
    .setTimestamp()
    .setFooter({ text: `${message.guild.id}` })
    try { confirmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true })) } catch(e) {}
    await message.channel.send({ content: "**Please check your private messages.**" }).catch(e => {})
    await message.author.send({ embeds: [confirmEmbed], components: [buttons] }).catch(async (e) => {
        await message.channel.send({ content: "Please set your private messages to public for me to message you the confirmation message." })
    });

}

exports.info = {
    name: "updatebans",
    description: "Update this guilds bans to include all the active bans in the bot!",
    aliases: ['update']
}