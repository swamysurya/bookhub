import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const apiUrl = 'https://apis.ccbp.in/login'

class Login extends Component {
  state = {
    userNameInput: '',
    userPasswordInput: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onChangeInputHandle = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value,
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  handleOnSubmit = async event => {
    event.preventDefault()
    const {userNameInput, userPasswordInput} = this.state
    const userDetails = {
      username: userNameInput,
      password: userPasswordInput,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      console.log(data)
      const updatedData = {
        jwtToken: data.jwt_token,
      }
      this.onSubmitSuccess(updatedData.jwtToken)
    } else {
      this.setState({showErrorMsg: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {userNameInput, userPasswordInput, showErrorMsg, errorMsg} =
      this.state
    return (
      <div className="login-page-container">
        <img
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708770996/bookhub%20assets/login%20images/n2xha4kam1du5lrxtwzi.png"
          alt="website login"
          className="login-page-image"
        />
        <div className="login-logo-form-image-container">
          <img
            src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708770994/bookhub%20assets/login%20images/r76zrhjbysyrxoum6fmh.png"
            alt="login website logo"
            className="login-logo-image"
          />

          <form className="login-form-container" onSubmit={this.handleOnSubmit}>
            <div className="input-element-container">
              <label className="label-element" htmlFor="username">
                Username*
              </label>
              <input
                value={userNameInput}
                name="userNameInput"
                id="username"
                type="text"
                className="input-element"
                onChange={this.onChangeInputHandle}
              />
            </div>
            <div className="input-element-container">
              <label className="label-element" htmlFor="password">
                Password*
              </label>
              <input
                value={userPasswordInput}
                name="userPasswordInput"
                id="password"
                type="Password"
                className="input-element"
                onChange={this.onChangeInputHandle}
              />
            </div>
            {showErrorMsg ? (
              <p className="login-error-message">{errorMsg}</p>
            ) : null}
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
