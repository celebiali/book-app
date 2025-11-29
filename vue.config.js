const { defineConfig } = require('@vue/cli-service')

const scssResources = [
  '@/assets/variables/_colors.scss',
  '@/assets/variables/_sizes.scss',
  '@/assets/variables/_break-points.scss',
  '@/assets/variables/_fonts.scss',
  '@/assets/mixins/_mixins.scss'
].map(p => `@import "${p}";`).join('\n')

module.exports = defineConfig({
  transpileDependencies: true,

  css: {
    loaderOptions: {
      scss: {
        additionalData: scssResources
      }
    }
  }
})
