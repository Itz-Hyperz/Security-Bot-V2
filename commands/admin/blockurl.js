exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    if(!args[0]) return message.channel.send({ content: `**Please include a URL to block.**`}).catch(e => {});

    await con.query(`INSERT INTO blockurls (guildid, link) VALUES ("${message.guild.id}", "${args[0]}")`, async(err, row) => {
        if(err) throw err;
        let embed = new client.discord.MessageEmbed()
        .setTitle(`URL Block Added`)
        .setColor(client.config.colorhex)
        .setDescription(`URL block added to this guilds database.`)
        await message.channel.send({ embeds: [embed] }).catch(e => {});
    });

}

exports.info = {
    name: "blockurl",
    description: "Block a URL link from being said in the server!",
    aliases: ['urlblock', 'blacklisturl', 'blocklink', 'linkblock', 'urlblacklist']
}