module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'ec2-52-204-196-4.compute-1.amazonaws.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'dejqrcpfu9k1hq'),
      user: env('DATABASE_USERNAME', 'thwcywdeerztpa'),
      password: env('DATABASE_PASSWORD', '994d67c6f9850f93b6ae43dc7a4ba446e6c067abf075fa12c5f16f68f5606d7b'),
      ssl: env.bool('DATABASE_SSL', false),
      ssl: {
        rejectUnauthorized: false
      }
    },
    options: {
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
