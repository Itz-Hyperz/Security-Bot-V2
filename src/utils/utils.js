const { Permissions } = require('discord.js')
const chalk = require('chalk');

async function colorize(color, content) {
    switch (color, content) {
        case "red":
            return chalk.red(content)
        case "green":
            return chalk.green(content)
        case "yellow":
            return chalk.yellow(content)
        case "blue":
            return chalk.blue(content)
        case "cyan":
            return chalk.cyan(content)
        case "white":
            return chalk.white(content)
        case "black":
            return chalk.black(content)
        default:
            return chalk.white(content);
    };
};

async function checkAdmin(member) {
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return true;
    } else {
        return false;
    }
}

async function guildAdd(client, con, guild) {
    await con.query(`INSERT INTO guilds (guildid, autobans, autounbans, loggingchannelid, prefix, serverlock) VALUES ('${guild.id}', 'false', 'false', '0', '${client.config.prefix}', 'false')`, async (err, row) => {
        if(err) throw err;
    });
}

async function error(client, content) {
    if(client.config.debugmode) {
        console.log(chalk.red('DEBUG MODE ERROR: ', content, `\n ${content.stack}`))
    }
};

async function sendError(string, channel) {
    await channel.send({ content: string }).catch(e => {});
};

async function maths(array) {
    let bruh = array[Math.floor(array.length * Math.random())];
    return bruh;
};

async function mainchan(client, embed) {
    let channel = await client.channels.cache.get(client.config.publicLogsChannelId)
    if(channel == undefined) return console.log(`ERROR: Invalid public logs channel Id in config.js`);
    await channel.send({ embeds: [embed] }).catch(e => { console.log(e) });
}

exports.checkAdmin = checkAdmin;
exports.error = error;
exports.colorize = colorize;
exports.sendError = sendError;
exports.maths = maths;
exports.guildAdd = guildAdd;
exports.mainchan = mainchan;