export const  appConfig = () => ({
    port: Number(process.env.PORT),
    mongoConnectURI: process.env.MONGODB_URI,
    imagesPath: process.env.IMAGES_PATH,
    tempPath: process.env.TEMP_PATH,
    auth: {
        secret: process.env.JWT_AUTH_SECRET,
        signOptions: {
            expiresIn: process.env.JWT_AUTH_EXPIRES,
            algorithm: 'HS256',
            noTimestamp: true
        }
    },
    mail:{
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }
});
