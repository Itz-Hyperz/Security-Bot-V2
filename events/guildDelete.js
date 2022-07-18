module.exports = async(client, con, guild) => {

    await con.query(`DELETE FROM guilds WHERE guildid='${guild.id}' LIMIT 1`, async (err, row) => {
        if(err) throw err;
    });

    let owner = await client.users.fetch(guild.ownerId);
    if(owner == undefined) return;

    let channel = await client.channels.cache.get(client.config.guildNotifsChannelId);
    if(channel == undefined) return;
    let embed = new client.discord.MessageEmbed()
    .setColor(client.config.colorhex)
    .setTitle("Left Server!")
    .setDescription(`**○ Guild Name:** ${guild.name}\n**○ Guild Id:** ${guild.id}\n**○ Guild Members:** ${guild.members.cache.size}\n\n**○ Guild Owner Tag:** ${owner.tag}\n**○ Guild Owner Id:** ${owner.id}`)
    .setTimestamp()
    .setFooter({ text: client.config.copyright })
    try { embed.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
    await channel.send({ embeds: [embed] }).catch(e => {});

}