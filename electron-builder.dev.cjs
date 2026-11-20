const packageJson = require('./package.json')

module.exports = {
  ...packageJson.build,
  appId: 'cc.3cool.desktop.dev',
  productName: '3COOL Dev',
  directories: {
    ...packageJson.build.directories,
    output: 'dist-dev'
  },
  extraMetadata: {
    name: '3cool-desktop-dev',
    productName: '3COOL Dev',
    dshDesktopChannel: 'development'
  },
  artifactName: '3cool-dev-${os}-${arch}.${ext}',
  nsis: {
    ...packageJson.build.nsis,
    artifactName: '3cool-dev-windows-${arch}-setup.${ext}'
  },
  publish: null
}
