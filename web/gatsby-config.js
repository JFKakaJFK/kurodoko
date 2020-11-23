require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `Kurodoko`,
    siteUrl: `https://kurodoko.xyz`,
    description: `Play the Kurodoko and Oh No pen and paper puzzles.`,
    author: `Johannes Koch <1johannes.koch@gmail.com>`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `fonts`,
        path: `${__dirname}/src/fonts/`,
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#BC002D`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kurodoko`,
        short_name: `Kurodoko`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#101010`,
        display: `standalone`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    `gatsby-plugin-workerize-loader`,
  ],
}
