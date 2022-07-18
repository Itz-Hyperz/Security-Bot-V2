const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    if(!args[0]) return message.channel.send({ content: "Please include a user `Id` to check in the database." })
    if(message.mentions.users.first()) return message.channel.send({ content: "Please use user Ids, do not mention users." }).catch(e => {});

    await con.query(`SELECT * FROM bans WHERE active='true' AND userid='${args[0]}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) {
            await message.channel.send({ content: `\`${args[0]}\` does not have a currently active ban in our database.` })
        } else {
            let user = await client.users.fetch(args[0])
            if(user == undefined) return message.channel.send({ content: "User not found." }).catch(e => {});
            let embed = new client.discord.MessageEmbed()
            .setTitle(`Active Ban Found!`)
            .setColor(client.config.colorhex)
            .setDescription(`**○ User Object:** <@${user.id}>\n**○ User Tag:** ${user.tag}\n**○ User Id:** ${user.id}\n\n**○ Time:** ${row[0].timeofban}\n**○ Staff Member:** ${row[0].staffTag}\n\n**○ Reason:** ${row[0].reason}`)
            .setImage(row[0].proof)
            .setFooter({ text: `Requested by ${message.author.tag}` })
            .setTimestamp()
            try { embed.setThumbnail(user.avatarURL({ dynamic: true })) } catch(e) {}
            message.channel.send({ embeds: [embed] }).catch(e => {});
        }   
    });

}

exports.info = {
    name: "search",
    description: "A Command.",
    aliases: ['check', 'user', 'find', 'get']
}