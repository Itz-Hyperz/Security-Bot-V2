exports.run = async (client, message, args, con, data) => {

    let check = await client.utils.checkAdmin(message.member)
    if(!check) return message.channel.send({ content: "You are missing the permission(s): `ADMINISTRATOR`.", ephemeral: true }).catch(e => {});

    await con.query(`SELECT * FROM stickymsgs WHERE channel='${message.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            await con.query(`DELETE FROM stickymsgs WHERE channel='${message.channel.id}'`, async(err, row) => {
                if(err) throw err;
            });
            message.channel.send({ content: `**Sticky Message Deleted!**` }).catch(e => {});
        } else {
            message.channel.send({ content: `**There is no sticky message in this channel.**` }).catch(e => {});
        }
    });

}

exports.info = {
    name: "stickyremove",
    description: "Delete a sticky message.",
    aliases: ['deletesticky', 'delsticky', 'removesticky', 'remsticky']
}