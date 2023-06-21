/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
/* eslint-disable keyword-spacing */

const logOut = async sessionData => {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('menu')
    window.location.href = '/'
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: `Bearer ${loggedUser.refreshToken}` })
    }
    window.localStorage.clear()
    await fetch("http://desa.goitsa.me:8988/goit-security-api/v2/autenticacion/revocar-token", requestOptions)
    const response = {
      header: '',
      body: '',
      url: '',
      error: 0
    }
    return response
  }
  
//   const grantedUser = async idUsuario => {
//     const headers = { 'Content-Type': 'application/json' }
//     headers.Canal = global.CANAL
//     const data = {
//       idUsuario
//     }
//     const requestOptions = {
//       method: 'PUT',
//       headers,
//       body: JSON.stringify(data)
//     }
//     const resp = await fetch(global.VALIDATE_USER + idUsuario, requestOptions)
//     const items = await resp.json()
//     if (items.success) {
//       global.ERROR = 0
//       global.REDIRECT_URL = '*'
//     } else {
//       global.ERROR = 1
//     }
//     const response = {
//       header: 'token',
//       body: '',
//       url: global.REDIRECT_URL,
//       error: global.ERROR,
//       expire_date: global.EXPIRE_DATE
//     }
//     return response
//   }
  
  const refreshTokenInactivity = async credenciales => {
    global.EXPIRE_DATE = 0
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
    if (loggedUser) {
      const date = `${getDate()} ${getHour()}`;
      if (date >= loggedUser.fechaExpiracionToken) {
        global.EXPIRE_DATE = 1
      } else {
        global.EXPIRE_DATE = 0
      }
    }
    const response = {
      header: 'token',
      body: '',
      url: global.REDIRECT_URL,
      error: 0,
      expire_date: global.EXPIRE_DATE
    }
    return response
  }
  
  const verificaToken = async () => {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
    const date = `${getDate()} ${getHour()}`;
    if (loggedUser){
      const fechaExpira = restMin(new Date(loggedUser.fechaExpiracionToken), 30);
      if (new Date(date) >= fechaExpira){
        
        await getRefresh(loggedUser)
      }else{
      }
    }
    return 0;
  }
  
  const restMin = (date, min) => {
    const numberOfMlSeconds = date.getTime();
    const remMlSeconds = min * 60000;
    const newDateObj = new Date(numberOfMlSeconds - remMlSeconds);
    return newDateObj;
  }
  const getRefresh = async (loggedUser) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: `Bearer ${loggedUser.refreshToken}` })
    }
    const resp = await fetch("http://desa.goitsa.me:8988/goit-security-api/v2/autenticacion/refresh-token", requestOptions)
    const items = await resp.json()
    if (items.success) {
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(items.data)
      )
    } else {
      window.localStorage.removeItem('loggedUser')
      window.localStorage.removeItem('menu')
      window.location.href = '/'
    }
  }
  
  const getDate = () => {
    const dateData = new Date()
    const date = dateData.getDate()
    const month = dateData.getMonth() + 1
    const year = dateData.getFullYear()
    const dateChange = `${year}${global.DATE_SEPARATOR}${month < 10 ? `0${month}` : `${month}`}${global.DATE_SEPARATOR}${date < 10 ? `0${date}` : `${date}`}`
    return dateChange
  }
  
  const getHour = () => {
    const dateData = new Date()
    const hours = `${dateData.getHours() < 10 ? `0${(dateData.getHours() % 12) || 12}` : `${dateData.getHours()}`}`
    const minutes = `${dateData.getMinutes() < 10 ? `0${dateData.getMinutes()}` : `${dateData.getMinutes()}`}`
    const seconds = `${dateData.getSeconds() < 10 ? `0${dateData.getSeconds()}` : `${dateData.getSeconds()}`}`
    const time = `${hours}:${minutes}:${seconds}`;
    return time
  }
  
  const getTime = () => {
    const dateData = new Date()
    const hours = `${dateData.getHours() < 10 ? `0${(dateData.getHours() % 12) || 12}` : `${dateData.getHours()}`}`
    const minutes = `${dateData.getMinutes() < 10 ? `0${dateData.getMinutes()}` : `${dateData.getMinutes()}`}`
    const time = `${hours}:${minutes}`;
    return time
  }
  
  export default {
    logOut,
    getDate,
    getHour,
    // grantedUser,
    getTime,
    refreshTokenInactivity,
    verificaToken
  }
  