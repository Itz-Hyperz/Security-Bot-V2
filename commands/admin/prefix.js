exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    if(!args[0]) return message.channel.send({ content: `**Please include a new prefix in your message.**`}).catch(e => {});
    if(args[1]) return message.channel.send({ content: `**Your prefix cannot include a space.**` }).catch(e => {});

    await con.query(`UPDATE guilds SET prefix='${args[0]}' WHERE guildid='${message.guild.id}'`, async(err, row) => {
        if(err) throw err;
    });

    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.colorhex)
    .setDescription(`**This guilds prefix has been updated to \`${args[0]}\`**`)
    await message.channel.send({ embeds: [embed] }).catch(e => {});

}

exports.info = {
    name: "prefix",
    description: "Change the bots prefix for this guild!",
    aliases: ['p']
}