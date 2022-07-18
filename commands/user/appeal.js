const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    await con.query(`SELECT * FROM bans WHERE active='true' AND userid='${message.author.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return message.channel.send({ content: "You're not actively banned in the database." }).catch(e => {});

        if(client.config.disableAppealCommand) return message.channel.send({ content: `You can appeal at the below link.\n${client.config.appealLink}` }).catch(e => {});

        const filter = m => m.author.id === message.author.id;
        let count = 0;
        let answers = [];
        let questions = [
            "`Q:` **Please provide your User Id.**\nEx: `825162734450638848`",
            "`Q:` **Please provide your User Tag.**\nEx: `Hyperz#0001`",
            "`Q:` **Please provide the reason you are banned (EXACT REASON).**\nEx: `Being naughty.`",
            "`Q:` **Please explain why you deserve to be unbanned.**\nEx: `I am sorry, and I learned from my mistakes.`",
            "`Q:` **Is there anything else we need to know?**\nEx: `I regret my actions.`"
        ];

        try {
            message.channel.send({ content: "An appeal has been started in your DMs." }).catch(e => {})
            message.author.send({ content: `**__Appeal Process Started!__**\n${questions[count]}` }).then((msg) => {
                const collector = msg.channel.createMessageCollector({ filter, time: 1000000, max: questions.length });

                collector.on('collect', async m => {
                    let refined = `${questions[count].split('\n')[0]}\n\`A:\` ${m.content}`
                    answers.push(refined)
                    count++
                    if(!questions[count]) return;
                    await message.author.send({ content: `${questions[count]}` }).catch(e => {})
                });

                collector.on('end', async collected => {
                    await message.author.send({ content: "Your appeal has been filed." }).catch(e => {})
                    let logChannel = await client.channels.cache.get(client.config.appealsChannelId)
                    let embed = new client.discord.MessageEmbed()
                    .setAuthor({ name: `Author: ${message.author.tag} (${message.author.id})`, iconURL: message.author.avatarURL({ dynamic: true }) })
                    .setColor(client.config.colorhex)
                    .setTitle(`New Appeal!`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setDescription(`${answers.join("\n\n")}\n\n**To accept this appeal, run:** \`${data.prefix}unban {userId}\``)
                    .setFooter({ text: `Guild: ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                    await logChannel.send({ embeds: [embed] }).catch(e => {});
                });
            }).catch(e => {})
        } catch(e) {}
    });

}

exports.info = {
    name: "appeal",
    description: "A Command.",
    aliases: ['newappeal']
}