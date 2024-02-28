import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cartes.io Docs",
  titleTemplate: "Cartes.io Docs",
  description: "The official docs of Cartes.io",
  lastUpdated: true,
  themeConfig: {
    aside: 'left',
    outline: [2, 3],
    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guides',
        items: [
          { text: 'Usage Guide', link: '/guides/usage' },
        ]
      },
      {
        text: 'Developers',
        items: [
          { text: 'API Reference', link: '/developers/api/' },
          { text: 'iFrame embed', link: '/developers/iframe/' },
          // Wordpress https://wordpress.org/plugins/cartes/
          { text: 'Wordpress Plugin', link: 'https://wordpress.org/plugins/cartes/' },
          { text: 'Python Package', link: 'https://pypi.org/project/py-cartes-io/' },
          { text: 'NPM Package', link: 'https://www.npmjs.com/package/@m-media/npm-cartes-io/' },
          { text: 'Demos & Examples', link: '/developers/demos' }
        ]
      },
      // The sign-in link
      { text: 'Sign in', link: 'https://app.cartes.io/login' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      "message": "Cartes.io Docs",
      "copyright": `Copyright © ${new Date().getFullYear()}`
    }
  }
})
