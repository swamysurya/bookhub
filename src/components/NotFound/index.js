import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      className="not-found-image"
      src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708931311/bookhub%20assets/notfound/pxydqfquwetmqsobktx8.png"
      alt="not found"
    />
    <h1 className="page-not-found-heading">Page Not Found</h1>
    <p className="page-not-found-para">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="go-back-home-button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
