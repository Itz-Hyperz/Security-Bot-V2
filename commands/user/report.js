const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con, data) => {

    if(client.config.disableReportCommand) return message.channel.send({ content: `You can submit a report at the below link.\n${client.config.reportLink}` }).catch(e => {});

    const filter = m => m.author.id === message.author.id;
    let count = 0;
    let answers = [];
    let questions = [
        "`Q:` **Please provide the Users Id.**\nEx: `825162734450638848`",
        "`Q:` **Please provide the Users Tag.**\nEx: `Hyperz#0001`",
        "`Q:` **Please provide the reason for reporting them.**\nEx: `He smells bad.`",
        "`Q:` **Please provide link proof for their actions.**\nEx: `https://imgur.com/images/evidence.png`",
        "`Q:` **Is there anything else we need to know?**\nEx: `They are a leaker.`"
    ];

    try {
        message.channel.send({ content: "A report has been started in your DMs." }).catch(e => {})
        message.author.send({ content: `**__Report Process Started!__**\n${questions[count]}` }).then((msg) => {
            const collector = msg.channel.createMessageCollector({ filter, time: 1000000, max: questions.length });

            collector.on('collect', async m => {
                let refined = `${questions[count].split('\n')[0]}\n\`A:\` ${m.content}`
                answers.push(refined)
                count++
                if(!questions[count]) return;
                await message.author.send({ content: `${questions[count]}` }).catch(e => {})
            });

            collector.on('end', async collected => {
                await message.author.send({ content: "Your report has been filed." }).catch(e => {})
                let logChannel = await client.channels.cache.get(client.config.reportsChannelId)
                let embed = new client.discord.MessageEmbed()
                .setAuthor({ name: `Author: ${message.author.tag} (${message.author.id})`, iconURL: message.author.avatarURL({ dynamic: true }) })
                .setColor(client.config.colorhex)
                .setTitle(`New Report!`)
                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                .setDescription(`${answers.join("\n\n")}\n\n**To accept this report, run:** \`${data.prefix}ban {userId} {reason}\``)
                .setFooter({ text: `Guild: ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                await logChannel.send({ embeds: [embed] }).catch(e => {});
            });
        }).catch(e => {})
    } catch(e) {}

}

exports.info = {
    name: "report",
    description: "A Command.",
    aliases: ['newreport']
}