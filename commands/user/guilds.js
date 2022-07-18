exports.run = async (client, message, args, con, data) => {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Back`)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Next`)
        .setCustomId('nextGuilds')
    )
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let guild = await client.guilds.cache.get(row[0].guildid);
        if(guild == undefined) return;
        let owner = await client.users.fetch(guild.ownerId);
        if(owner == undefined) return;
        let embed = new client.discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setTitle(`Guilds List`)
        .setDescription(`**○ Guild Name:** ${guild.name}\n**○ Guild Id:** ${guild.id}\n**○ Guild Members:** ${guild.members.cache.size}\n\n**○ Guild Owner Tag:** ${owner.tag}\n**○ Guild Owner Id:** ${owner.id}`)
        .setTimestamp()
        .setFooter({ text: '0' })
        try { embed.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
        message.channel.send({ embeds: [embed], components: [buttons] }).catch(e => {});
    });

}

exports.info = {
    name: "guilds",
    description: "A Command.",
    aliases: ['guildlist', 'servers', 'serverlist']
}