exports.run = async (client, message, args, con, data) => {

    if(message.mentions.users.first()) return message.channel.send({ content: "Please use user Ids, do not mention users." }).catch(e => {});

    await con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return message.channel.send({ content: "You do not have permission to use this command." });
        if(!args[0]) return message.channel.send({ content: "Please include a User `Id` to unban." });
        await con.query(`SELECT * FROM bans WHERE active='true' AND userid='${args[0]}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return message.channel.send({ content: "This user is not actively banned." });
            await con.query(`UPDATE bans SET active='false' WHERE userid='${args[0]}'`, async (err, row) => {
                if(err) throw err;
                let alertEmbed = new client.discord.MessageEmbed()
                .setColor(client.config.colorhex)
                .setTitle("Unbanned!")
                .setDescription(`You have been unbanned by: ${message.author.tag}`)
                .setTimestamp()
                .setFooter({ text: client.config.copyright })
                let unbannedUser = await client.users.fetch(args[0]);
                if(unbannedUser != undefined) {
                    await unbannedUser.send({ embeds: [alertEmbed] }).catch(e => {});
                };
                await con.query(`SELECT * FROM guilds WHERE autounbans='true'`, async (err, row) => {
                    if(err) throw err;
                    let embed = new client.discord.MessageEmbed()
                    .setColor(client.config.colorhex)
                    .setTitle("Active Ban Removed!")
                    .setDescription(`The ban placed on user Id \`${args[0]}\` has been revoked by ${message.author.tag}!`)
                    .setTimestamp()
                    .setFooter({ text: client.config.copyright })
                    row.forEach(async data => {
                        let guild = await client.guilds.cache.get(data.guildid)
                        try {
                            if(guild != undefined) {
                                guild.members.unban(args[0]).catch(e => {});
                            }
                            if(data.loggingchannelid != '0') {
                                let channel = await client.channels.cache.get(data.loggingchannelid)
                                if(channel != undefined) {
                                    await channel.send({ embeds: [embed] }).catch(e => {});
                                }
                            }
                        } catch(e) {}
                    });
                    await message.channel.send({ embeds: [embed] }).catch(e => {});
                    await client.utils.mainchan(client, embed)
                });
            });
        });
    });

}

exports.info = {
    name: "unban",
    description: "A Command.",
    aliases: []
}