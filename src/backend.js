import axios from 'axios';

export default function install(Vue) {
  const api = axios.create({
    baseURL: '/api',
    headers: {}
  });

  const session = {
    token: null
  };

  Vue.prototype.$xhr = {
    signIn(username, password) {
      return api.post('/rest-auth/login/', {
        email: username,
        password: password
      }).then(res => {
        console.log(res)
        session.token = res.data.token;
      });
    },
    getTeamList() {
      return api.get('/orgs/', {
        headers: {
          authorization: `Token ${session.token}`
        }
      }).then(res => res.data);
    }
  }
}
