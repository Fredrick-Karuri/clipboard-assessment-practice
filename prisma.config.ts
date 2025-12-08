// prisma.config.ts
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
      url: 'file:./dev.db',
  },
  migrations: {
    path: 'prisma/migrations',
  },
})
