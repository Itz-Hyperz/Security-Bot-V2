exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, message.guild);
        if(row[0].serverlock == 'true') {
            await con.query(`UPDATE guilds SET serverlock='false' WHERE guildid='${message.guild.id}'`, async (err, row) => {
                if(err) throw err;
                let embed = new client.discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor(client.config.colorhex)
                .setDescription(`**Server lockdown has been toggled **\`false\`.`)
                await message.channel.send({ embeds: [embed] }).catch(e => {});
            });
        } else {
            await con.query(`UPDATE guilds SET serverlock='true' WHERE guildid='${message.guild.id}'`, async (err, row) => {
                if(err) throw err;
                let embed = new client.discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor(client.config.colorhex)
                .setDescription(`**Server lockdown has been toggled **\`true\`.`)
                await message.channel.send({ embeds: [embed] }).catch(e => {});
            });
        }
    });

}

exports.info = {
    name: "serverlock",
    description: "Enable server lock for this guild!",
    aliases: ['lockserver', 'antiraid', 'lockdown', 'lockdownserver', 'serverlockdown']
}