export default () => ({
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'password',
        name: process.env.DB_NAME || 'nestdb',
    },
});
