import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    auth: (ctx) =>
      ctx.inertia.always(() => ({
        user: (ctx.auth.user as { id: number; fullName: string | null; email: string } | null)
          ? {
              id: (ctx.auth.user as { id: number; fullName: string | null; email: string }).id,
              fullName: (ctx.auth.user as { id: number; fullName: string | null; email: string })
                .fullName,
              email: (ctx.auth.user as { id: number; fullName: string | null; email: string })
                .email,
            }
          : null,
      })),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
