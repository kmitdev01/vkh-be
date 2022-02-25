module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bff24bd917fe1d58dd7781d1cd0e2b81'),
  },
});
