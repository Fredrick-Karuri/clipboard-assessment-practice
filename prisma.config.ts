// prisma.config.ts
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
      url: 'file:./dev.db', // The URL goes here now
  },
  migrations: {
    path: './prisma/migrations',
  },
})
