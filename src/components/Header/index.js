import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'
import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {
    isNavMenuOpen: false,
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  handleNavMenu = () => {
    this.setState({isNavMenuOpen: true})
  }

  handleCloseNav = () => {
    this.setState({isNavMenuOpen: false})
  }

  render() {
    const {isNavMenuOpen} = this.state
    return (
      <>
        <nav className="nav-header">
          <div className="nav-contents">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708770994/bookhub%20assets/login%20images/r76zrhjbysyrxoum6fmh.png"
                alt="website logo"
                className="home-nav-icon"
              />
            </Link>

            <ul className="nav-ul-container">
              <Link className="link-element" to="/">
                <li className="nav-list-element">Home</li>
              </Link>
              <Link className="link-element" to="/shelf">
                <li className="nav-list-element">Bookshelves</li>
              </Link>
              <li>
                <button
                  type="button"
                  className="desktop-logout-button"
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </li>
            </ul>

            <button type="button" className="home-menu-button">
              <GiHamburgerMenu onClick={this.handleNavMenu} />
            </button>
          </div>
        </nav>
        {isNavMenuOpen ? (
          <div className="small-nav-menu-items">
            <ul className="nav-ul-container1">
              <Link className="link-element" to="/">
                <li className="nav-list-element">Home</li>
              </Link>
              <Link className="link-element" to="/shelf">
                <li className="nav-list-element">Bookshelves</li>
              </Link>
            </ul>
            <button
              type="button"
              className="desktop-logout-button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
            <AiFillCloseCircle onClick={this.handleCloseNav} />
          </div>
        ) : null}
      </>
    )
  }
}
export default withRouter(Header)
