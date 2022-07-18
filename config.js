const _config = {

    // Client Settings (REQUIRED)
    prefix: "h!", // The DEFAULT PREFIX for the bot.
    token: "YOUR_BOT_TOKEN", // The token from your Discord Dev Portal
    aboutServer: "YOUR_DESCRIPTION", // This is a description of your server
    date_format: "MM-DD-YYYY HH:mm", // The date format for the bot
    copyright: "© 2022 Your Name", // The footer for most embeds
    colorhex: "#2F3136", // The main theme and color of the bot
    deleteCommands: false, // This will decide whether or not to delete commands when they are ran. (RECOMMENDED TO BE FALSE)

    // Application Settings (REQUIRED)
    themeColor: "blue", // The theme color for the main logger (blue, red, green, yellow, magenta)
    port: "8080", // The port for the bot to listen on
    debugmode: true, // Toggles the logging of errors and excess information
    logCommandLoading: false, // Toggles the logging of commands being loaded

    // MySQL Settings (REQUIRED)
    database: {
        host: "localhost", // The IP of your SQL Server
        user: "root", // The username for your SQL Server
        password: "", // The password for of the user for your SQL Server
        database: "database" // The database designated for the bot
    },

    website: {
        enabled: true, // Decides wether or not the website / API should be enabled
        port: "3000", // The port for the website to listen on

        themeColor: "#343a40", // The theme color for the website
        botName: "Ban Bot", // The name used for your bot on the website itself.
        siteName: "Ban Bot", // The "name" of your website NOT THE DOMAIN
        siteDomain: "https://api.yourdomain.ext", // Your websites domain

        footer: "Ban Bot", // Footer text for the copyright label
        footerLink: "#", // The link the footer text goes to

        // API Settings
        api: {
            secret: "cool1234", // The secret for API requests (CANNOT INCLUDE " OR ` IN SECRET)
            endpoints: [ // DONT TOUCH THE ORDER OR endpointName OF THESE, ONLY CHANGE: secretRequired
                { endpointName: "/stats", secretRequired: false },
                { endpointName: "/fetchallbans", secretRequired: false },
                { endpointName: "/bans", secretRequired: false },
                { endpointName: "/activebans", secretRequired: false },
                { endpointName: "/guilds", secretRequired: false },
                { endpointName: "/staff", secretRequired: false }
            ]
        },

        // Redirects for 3rd party URLs
        redirects: [
            { name: `discord`, link: `https://discord.gg` }
        ],
    },

    disableAppealCommand: false, // If the appeal command should be disabled
    appealLink: "", // 3rd party appeal form link (only when appeal command is disabled)

    disableReportCommand: false, // If the report command should be disabled
    reportLink: "", // 3rd party report form link (only when report command is disabled)

    publicLogsChannelId: "CHANNEL_ID_HERE", // Channel Id here for public logs
    reportsChannelId: "CHANNEL_ID_HERE", // Channel Id to send report logs to
    appealsChannelId: "CHANNEL_ID_HERE", // Channel Id to send appeal logs to
    guildNotifsChannelId: "CHANNEL_ID_HERE", // The channel Id to log when the bot joins or leaves a guild
    ownerIds: ["704094587836301392", "YOUR_USER_ID"], // User Ids that can manage the staff member table

    supportserver: "https://discord.gg", // The invite to this bots support/main server

    command_count: 22,
    event_count: 6

}

module.exports = _config
