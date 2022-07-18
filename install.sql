CREATE TABLE guilds (
    guildid varchar(255),
    autobans varchar(255),
    autounbans varchar(255),
    loggingchannelid varchar(255),
    prefix TEXT,
    serverlock varchar(255)
);

CREATE TABLE bans (
    active varchar(255),
    userid varchar(255),
    reason TEXT,
    proof TEXT,
    timeofban TEXT,
    staffId varchar(255),
    staffTag TEXT
);

CREATE TABLE staff (
    userid varchar(255)
);

CREATE TABLE blockurls (
    guildid varchar(255),
    link TEXT
);

CREATE TABLE stickymsgs (
    channel varchar(255),
    message TEXT,
    embed varchar(255),
    color TEXT
);