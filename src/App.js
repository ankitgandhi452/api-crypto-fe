import { Component } from 'react'
import HttpClient from './configurations/network/HttpClient'
import './App.css'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      publicKey: '',
      response: {}
    }

    this.setPublicKey = this.setPublicKey.bind(this)
    this.setResponse = this.setResponse.bind(this)

    this.doHandshake = this.doHandshake.bind(this)
    this.doService = this.doService.bind(this)
  }

  async componentDidMount () {
    console.log('componentDidMount')
    this.doHandshake()
  }

  async doHandshake () {
    const handshakeOptions = {
      apiPath: 'API_CRYPTO.HANDSHAKE.GET',
      disableCrypto: true
    }

    try {
      const handshakeResponse = await HttpClient.request(handshakeOptions)
      const resPublicKey = handshakeResponse.data.data.publicKey
      this.setPublicKey(resPublicKey)
      HttpClient.set('PUBLIC_KEY', resPublicKey)
    } catch (error) {
      console.log('error', error)
    }

    await this.doService()
  }

  async doService () {
    const serviceOptions = {
      apiPath: 'API_CRYPTO.SERVICE.POST',
      data: { test: 'test' }
    }

    try {
      const serviceResponse = await HttpClient.request(serviceOptions)
      const serviceResponseData = serviceResponse.data.data
      this.setResponse(serviceResponseData)
    } catch (error) {
      console.log('error', error)
    }
  }

  setPublicKey (publicKey) {
    this.setState({ publicKey })
  }

  setResponse (response) {
    this.setState({ response })
  }

  render () {
    const { publicKey, response } = this.state
    return (
      <div className='App'>
        <p>publicKey: {publicKey}</p>
        <p>response: {JSON.stringify(response, null, 2)}</p>
      </div>
    )
  }
}
