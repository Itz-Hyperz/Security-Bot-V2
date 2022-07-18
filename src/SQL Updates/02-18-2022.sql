ALTER TABLE guilds
ADD prefix TEXT;

ALTER TABLE guilds
ADD serverlock varchar(255);

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

UPDATE guilds SET prefix="?";
UPDATE guilds SET serverlock="false";