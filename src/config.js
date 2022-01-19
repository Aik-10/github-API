module.exports = {
    files: {
        pushBeforePullFiles: [
            `src/index.js`,
            `src/config.js`
        ],
    },
    discordLog: {
        enabled: true,
        logo: "https://cdn.discordapp.com/attachments/756985427948339241/933128492692942859/sun-airplane-01.png",
        hideWords: [ "HIDE", "HIDDEN", "MERGE", "BRANCH", "REVERT", "REVERTS" ],
        mainPatch: [
            { guild: "465848365150896139", channels: "906142904383328316" }
        ],
        devPatch: [
            { guild: "465848365150896139", channels: "906142904383328316" }
        ]
    }
}