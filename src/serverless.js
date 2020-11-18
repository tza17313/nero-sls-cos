const { Component } = require('@serverless/core')
const Cos = require('./cos')
const { TypeError } = require('./utils/error')
const util = require('util')
const CONFIGS = require('./config')

class ServerlessComopnent extends Component {
  getCredentials() {
    const { tmpSecrets } = this.credentials.tencent

    if (!tmpSecrets || !tmpSecrets.TmpSecretId) {
      throw new TypeError(
        'CREDENTIAL',
        'Cannot get secretId/Key, your account could be sub-account and does not have the access to use SLS_QcsRole, please make sure the role exists first, then visit https://cloud.tencent.com/document/product/1154/43006, follow the instructions to bind the role to your account.'
      )
    }

    return {
      SecretId: tmpSecrets.TmpSecretId,
      SecretKey: tmpSecrets.TmpSecretKey,
      Token: tmpSecrets.Token
    }
  }

  getAppId() {
    return this.credentials.tencent.tmpSecrets.appId
  }

  getDefaultProtocol(protocols) {
    if (String(protocols).includes('https')) {
      return 'https'
    }
    return 'http'
  }

  async deploy(inputs) {
    console.log(`Deploying COS... `)

    if(inputs.website || inputs.acl || inputs.cors  ){
      console.log('提示：nero-sls-cos只上传文件，并不新建bucket或修改bucket的website、acl、cors，如需修改，请登录网站修改' )
    }

    const credentials = this.getCredentials()
    const { region } = inputs
    const cos = new Cos(credentials, region)

    let files = null
    if (inputs.src) {
      files = await this.unzip(inputs.src)
    }

    const appId = this.getAppId()

    inputs.bucket =
      inputs.bucket.indexOf(`-${appId}`) === -1 ? `${inputs.bucket}-${appId}` : inputs.bucket

    inputs.force = true

    // upload to target directory
    inputs.keyPrefix = inputs.targetDir || '/'

    const outputs = {
      region: region,
      bucket: inputs.bucket,
      cosOrigin: `${inputs.bucket}.cos.${region}.myqcloud.com`
    }

    inputs.src = files
    await cos.deploy(inputs)
    outputs.url = `${this.getDefaultProtocol(inputs.protocol)}://${inputs.bucket}.cos.${region}.myqcloud.com`

    this.state = inputs
    await this.save()

    return outputs
  }

  async remove() {
    console.log(`禁用remove，请登录网站删除`)

    // const { state } = this

    // const credentials = this.getCredentials()
    // const cos = new Cos(credentials, state.region)

    // await cos.remove(state)

    this.state = {}
  }
}

module.exports = ServerlessComopnent
