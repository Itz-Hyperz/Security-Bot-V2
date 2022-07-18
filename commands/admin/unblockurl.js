exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    if(!args[0]) return message.channel.send({ content: `**Please include a URL to unblock.**`}).catch(e => {});

    await con.query(`DELETE FROM blockurls WHERE guildid='${message.guild.id}' AND link="${args[0]}" LIMIT 1`, async(err, row) => {
        if(err) throw err;
        let embed = new client.discord.MessageEmbed()
        .setTitle(`URL Block Removed`)
        .setColor(client.config.colorhex)
        .setDescription(`URL block removed from this guilds database.`)
        await message.channel.send({ embeds: [embed] }).catch(e => {});
    });

}

exports.info = {
    name: "unblockurl",
    description: "Unblock a URL link from being said in the server!",
    aliases: ['unurlblock', 'unblacklisturl', 'unblocklink', 'unlinkblock', 'unurlblacklist']
}