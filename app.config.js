// Значения из app.json дополняются переменными окружения, которые задаёт CI
module.exports = ({ config }) => ({
    ...config,
    version: process.env.APP_VERSION || config.version,
    android: {
        ...config.android,
        versionCode: Number(process.env.VERSION_CODE) || 1,
    },
});