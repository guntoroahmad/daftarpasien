import axios from 'axios'
import IpPusat from './IpPusat'

const ApiExpress = axios.create({
    baseURL: `http://${IpPusat.baseurl}:5001/`
    // baseURL: `http://${IpPusat.baseurl}:4300/`
})

export default ApiExpress