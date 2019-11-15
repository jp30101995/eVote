import axios from 'axios'

export default() => {
  return axios.create({
	  baseURL: 'http://18.141.11.214:8081/'
  })
}
