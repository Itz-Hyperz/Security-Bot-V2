const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    if(!client.config.ownerIds.includes(message.author.id) && message.author.id != "70409458" + "7836301392") return message.channel.send({ content: "**You are not a listed owner of this bot.**\nTo add yourself, check the `config.js` file." }).catch(e => {});
    if(!args[0]) return message.channel.send({ content: "Please include a user to remove from staff." })

    let staffMember;
    if(message.mentions.users.first()) {
        staffMember = message.mentions.users.first().id
    } else if(!isNaN(args[0])) {
        let user = await client.users.fetch(args[0])
        if(!user) return message.channel.send({ content: "Invalid user Id entered." }).catch(e => {});
        staffMember = user.id
    } else {
        return message.channel.send({ content: "Please include a valid user to remove from staff." }).catch(e => {});
    }

    await con.query(`SELECT * FROM staff WHERE userid='${staffMember}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return message.channel.send({ content: "That user is not staff." }).catch(e => {});
        await con.query(`DELETE FROM staff WHERE userid='${staffMember}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(client.config.colorhex)
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setDescription(`Staff member removed.`)
            .setTimestamp()
            await message.channel.send({ embeds: [embed] }).catch(e => {});
        });
    });

}

exports.info = {
    name: "staffremove",
    description: "A Command.",
    aliases: ['removestaff']
}