# About The API

This API is used quite simply, it pulls data from the database and returns a JSON format.

It uses ExpressJS, along with MySQL.

```js
localhost:3000/                                         -- Grabs the API status & credits
localhost:3000/stats                                    -- Grabs the bots statistics
localhost:3000/fetchallbans/                            -- Grabs all bans
localhost:3000/bans/USER_ID_HERE                        -- Grabs a users ban history
localhost:3000/activebans/USER_ID_HERE                  -- Checks if a user is actively banned
localhost:3000/guilds/GUILD_ID_HERE                     -- Grabs a guild
localhost:3000/staff/STAFF_ID_HERE                      -- Grabs a provided staff user