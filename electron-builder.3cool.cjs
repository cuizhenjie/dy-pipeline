const packageJson = require('./package.json')

module.exports = {
  ...packageJson.build,
  appId: 'cc.3cool.desktop',
  productName: '3COOL',
  directories: {
    ...packageJson.build.directories,
    output: 'dist-3cool'
  },
  extraMetadata: {
    name: '3cool-desktop',
    productName: '3COOL',
    dshDesktopChannel: '3cool'
  },
  artifactName: '3cool-${os}-${arch}.${ext}',
  nsis: {
    ...packageJson.build.nsis,
    artifactName: '3cool-windows-${arch}-setup.${ext}'
  },
  win: {
    ...packageJson.build.win,
    verifyUpdateCodeSignature: false
  },
  publish: null
}
