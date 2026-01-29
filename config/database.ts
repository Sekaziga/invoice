import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  // Default connection comes from .env, fallback to 'postgres'
  connection: env.get('DB_CONNECTION', 'postgres'),

  connections: {
    // Postgres config
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST', '127.0.0.1'),
        port: env.get('DB_PORT', 5432),
        user: env.get('DB_USER', 'postgres'),
        password: env.get('DB_PASSWORD', ''),
        database: env.get('DB_DATABASE', 'adonis_db'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },

    // MySQL config
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST', '127.0.0.1'),
        port: env.get('DB_PORT', 3306),
        user: env.get('DB_USER', 'root'),
        password: env.get('DB_PASSWORD', ''),
        database: env.get('DB_DATABASE', 'adonis_db'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
