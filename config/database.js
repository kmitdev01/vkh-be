module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'ec2-44-194-113-156.compute-1.amazonaws.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'dbg3ktnnugeg58'),
      user: env('DATABASE_USERNAME', 'hqsjtvrnctlczj'),
      password: env('DATABASE_PASSWORD', 'b8935cf9c9bdd4cc256ea7f43dcec83cfc76e3a54bb9efe19122a18915acc587'),
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
