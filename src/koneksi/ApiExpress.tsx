import axios from 'axios'
import IpPusat from './IpPusat'

const ApiExpress = axios.create({
    baseURL: `http://${IpPusat.baseurl}:3004/`
})

export default ApiExpress