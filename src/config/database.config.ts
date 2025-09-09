export default () => ({
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',  // Changed 'user' to 'username'
      password: process.env.DATABASE_PASSWORD || '',  // Added default password
      database: process.env.DATABASE_NAME || 'blinkit_user',  // Changed 'name' to 'database'
    },
  });
