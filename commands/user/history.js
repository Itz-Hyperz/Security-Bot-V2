const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    if(!args[0]) return message.channel.send({ content: "Please include a user `Id` to check in the database." })
    if(message.mentions.users.first()) return message.channel.send({ content: "Please use user Ids, do not mention users." }).catch(e => {});

    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Back`)
        .setCustomId(`backHistory`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Next`)
        .setCustomId(`nextHistory`)
    )

    await con.query(`SELECT * FROM bans WHERE userid='${args[0]}' AND active='false'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) {
            await message.channel.send({ content: `\`${args[0]}\` does not have any past bans in our database.` })
        } else {
            let user = await client.users.fetch(args[0])
            if(user == undefined) return message.channel.send({ content: "" }).catch(e => {});
            let embed = new client.discord.MessageEmbed()
            .setTitle(`Inactive Ban!`)
            .setColor(client.config.colorhex)
            .setAuthor({ name: user.id, iconURL: user.avatarURL({ dynamic: true }) })
            .addFields(
                { name: "User Tag", value: `${user.tag}`, inline: true },
                { name: "User Id", value: `${args[0]}`, inline: true },
                { name: "Time", value: `${row[0].timeofban}`, inline: true },
                { name: "Reason", value: `${row[0].reason}`, inline: true },
            )
            .setImage(row[0].proof)
            .setFooter({ text: `0` })
            message.channel.send({ embeds: [embed], components: [buttons] }).catch(e => {});
        }   
    });

}

exports.info = {
    name: "history",
    description: "Check the history of bans on a user.",
    aliases: ['past', 'bans', 'pastbans']
}