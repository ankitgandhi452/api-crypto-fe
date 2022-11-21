import { Component } from 'react'
import HttpClient from './configurations/network/HttpClient'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})
export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      publicKey: '',
      response: {},
      reqData: { test: 'test' }
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
    const { reqData } = this.state
    const serviceOptions = {
      apiPath: 'API_CRYPTO.SERVICE.POST',
      data: reqData
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
    const { publicKey, reqData, response } = this.state
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant='h5' gutterBottom>Public Key:</Typography>
                <Typography sx={{ wordWrap: 'break-word' }} variant='body1'>{publicKey}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant='h5' gutterBottom>Request Body:</Typography>
                <Typography variant='body1'>
                  <pre>{JSON.stringify(reqData, null, 2)}</pre>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant='h5' gutterBottom>Response Body:</Typography>
                <Typography variant='body1'>
                  <pre>{JSON.stringify(response, null, 2)}</pre>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    )
  }
}
