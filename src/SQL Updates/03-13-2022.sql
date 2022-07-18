ALTER TABLE bans
ADD staffId varchar(255);

ALTER TABLE bans
ADD staffTag TEXT;

UPDATE bans SET staffTag="Unknown User#0000", staffId="0000000000000000" WHERE staffId="" OR staffTag="" OR staffId IS NULL OR staffTag IS NULL;