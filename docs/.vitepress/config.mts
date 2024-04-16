import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "remix-adonisjs",
  description: "Documentation for @matstack/remix-adonisjs",
  sitemap: {
    hostname: 'https://matstack.dev/remix-adonisjs'
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '@matstack/remix-adonisjs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/getting-started/quickstart' },
      { text: 'About', link: '/about' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Quickstart', link: '/getting-started/quickstart' },
          { text: 'Migrate a Remix application', link: '/getting-started/migrate-from-remix' },
          { text: 'Migrate an AdonisJS application', link: '/getting-started/add-to-existing-adonisjs-project' }
        ],
        collapsed: false
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jarle/remix-adonisjs' },
      { icon: 'twitter', link: 'https://twitter.com/jarlemathiesen' }
    ]
  }
})
