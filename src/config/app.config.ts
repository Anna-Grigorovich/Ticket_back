export const  appConfig = () => ({
    port: Number(process.env.PORT),
    mongoConnectURI: process.env.MONGODB_URI,
    imagesPath: process.env.IMAGES_PATH,
    auth: {
        secret: process.env.JWT_AUTH_SECRET,
        signOptions: {
            expiresIn: process.env.JWT_AUTH_EXPIRES,
            algorithm: 'HS256',
            noTimestamp: true
        }
    }
});
