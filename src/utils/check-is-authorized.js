const axios = require("axios");


module.exports = function (token) {
  return axios.get(`http://${ process.env.AUTHORIZATION_SERVICE_NAME}:${ process.env.AUTHORIZATION_SERVICE_PORT_INNER}/profile`, {
    headers: { Authorization: token },
  });
};
