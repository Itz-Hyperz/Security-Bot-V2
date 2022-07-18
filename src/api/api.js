// Written entirely by Hyperz#0001
// Written entirely by Hyperz#0001
// Written entirely by Hyperz#0001
const express = require('express')
const app = express()
app.use(express.static('public'));
app.use('/assets', express.static(__dirname + '/public/assets'))
app.set('views', `${__dirname + '/views'}`);
app.set('view engine', 'ejs');

function apistart(client, con) {
    setTimeout(async () => {
        app.listen(client.config.website.port, null, null, () => console.log(`API is up and running on port ${client.config.website.port}.`));

        app.get('', async (req, res) => {
            await con.query(`SELECT COUNT(*) as total FROM bans WHERE active='true'`, async (err, row) => {
                if(err) throw err;
                let bcount = row[0].total
                res.render('index.ejs', { client: client, bans: bcount })
            });
        })

        // API Status
        app.get('/info', (req, res) => {
            res.set('Access-Control-Allow-Origin', '*');
            let json_ = {
                "error": false,
                "status": 200,
                "author": "Hyperz#0001",
                "endpoints": [
                    "/info",
                    "/stats",
                    "/fetchallbans",
                    "/bans/:userId",
                    "/activebans/:userId",
                    "/guilds/:guildId",
                    "/staff/:userId"
                ]
            }
            res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
        })

        app.get('/firewallgg/checkuser/:userid', async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            if(!req?.params?.userid) return res.redirect('/');
            req.params.userid == req.params.userid.replaceAll('`', '').replaceAll('"', '');
            await con.query(`SELECT * FROM bans WHERE userid="${req?.params?.userid}" AND active="true"`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    // If the user is not banned
                    let json_ = {
                        "active": false, // This means that the user is not banned
                    }
                    return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    // If the user is banned
                    let json_ = {
                        "active": true,
                        "userid": row[0].userid,
                        "reason": row[0].reason,
                        "proof": row[0].proof || 'None provided...',
                        "time": row[0].timeofban
                    }
                    return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                };
            });
        });

        // Statistics
        app.get('/stats', async function(req, res) { // Stats api
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(0, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            con.query(`SELECT COUNT(*) as total FROM bans`, (err, row) => {
                let json_ = {
                    "error": false,
                    "guilds": client.guilds.cache.size,
                    "users": client.users.cache.size,
                    "bans": row[0].total
                }
                res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            })
        })
        
        // Fetch Bans
        app.get('/fetchallbans', async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(1, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            await con.query(`SELECT * FROM bans`, async (err, rows) => {
                if(err) throw err;
                if(rows[0]) {
                    let json_ = {
                        "error": false,
                        "bans": rows
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    let json_ = {
                        "error": true,
                        "info": "No bans found in the database"
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                }
            });
        });

        // Ban History Viewing
        app.get(`/bans/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(2, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            let userid = req.params.userID
            userid = userid?.replaceAll('"', '') // SQL Injection Removal
            userid = userid?.replaceAll('`', '') // SQL Injection Removal
            con.query(`SELECT * FROM bans WHERE userid="${userid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    let json_ = {
                        "error": false,
                        "banHistory": true,
                        "previousBans": row
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    let json_ = {
                        "error": false,
                        "banHistory": false,
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                }
            });
        })

        // Active Ban Viewing
        app.get(`/activebans/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(3, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            let userid = req.params.userID
            userid = userid?.replaceAll('"', '') // SQL Injection Removal
            userid = userid?.replaceAll('`', '') // SQL Injection Removal
            con.query(`SELECT * FROM bans WHERE userid="${userid}" AND active="true"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    let json_ = {
                        "error": false,
                        "banned": true,
                        "info": row[0]
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    let json_ = {
                        "error": false,
                        "banned": false,
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                }
            });
        })

        // Guild Viewing
        app.get(`/guilds/:guildID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(4, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            let guildid = req.params.guildID
            guildid = guildid?.replaceAll('"', '') // SQL Injection Removal
            guildid = guildid?.replaceAll('`', '') // SQL Injection Removal
            con.query(`SELECT * FROM guilds WHERE guildid="${guildid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    let json_ = {
                        "error": false,
                        "exists": true,
                        "guildid": row[0].guildid,
                        "prefix": row[0].prefix,
                        "autobans": row[0].autobans,
                        "autounbans": row[0].autounbans,
                        "serverlock": row[0].serverlock,
                        "loggingchannelid": row[0].loggingchannelid
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    let json_ = {
                        "error": false,
                        "exists": false,
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                }
            });
        })

        // Staff DB Viewing (see if user is staff on the bot)   
        app.get(`/staff/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            let check = await checkSecret(5, req.headers.secret, client)
            if(!check) {
                let json_ = {
                    "error": true,
                    "info": "Invalid secret provided in headers of request."
                }
                return res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
            }
            let userid = req.params.userID
            userid = userid?.replaceAll('"', '') // SQL Injection Removal
            userid = userid?.replaceAll('`', '') // SQL Injection Removal
            con.query(`SELECT * FROM staff WHERE userid="${userid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    let json_ = {
                        "error": false,
                        "isStaff": true,
                        "userid": row[0].userid,
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                } else {
                    let json_ = {
                        "error": false,
                        "isStaff": false
                    }
                    res.type('json').send(JSON.stringify(json_, null, 4) + '\n');
                }
            });
        })

        app.get(`/hyperz`, async function(req, res) {
            res.redirect('https://hyperz.net');
        })

        client.config.website.redirects.forEach(element => {
            app.get(`/${element.name}`, (req, res) => {
                res.redirect(element.link);
            });
        });

        app.get('*', function(req, res){
            res.render('404.ejs', { client: client });
        });
    }, 6000);
}

function checkSecret(ep, dontuse, client) {
    // return true === Secret Validated
    // returb false === Secret Invalidated
    let spot = ep;
    let secret = dontuse;
    secret = secret?.replaceAll('"', '') // SQL Injection Removal
    secret = secret?.replaceAll('`', '') // SQL Injection Removal
    if(client.config.website.api.endpoints[spot].secretRequired) {
        let needed = client.config.website.api.secret;
        if(needed?.includes('"') || needed?.includes('`')) {
            console.log('SECRET INVALIDATED. Your secret cannot contain any quotations or backtics ( ` or " )');
            return true;
        }
        if(!secret || secret == undefined) {
            return false;
        }
        if(secret === needed) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

module.exports = {
    begin: apistart,
    checkSecret: checkSecret
}
// Written entirely by Hyperz#0001
// Written entirely by Hyperz#0001
// Written entirely by Hyperz#0001