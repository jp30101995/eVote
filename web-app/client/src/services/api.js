import axios from 'axios'

export default() => {
  return axios.create({
	  baseURL: 'http://13.229.249.168:8081/'
  })
}
