import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import {FaGoogle, FaTwitter, FaYoutube} from 'react-icons/fa'
import {RiInstagramFill} from 'react-icons/ri'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiUrlConstants = {
  initial: 'INTIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {
    booksDetailsObj: {},
    apiUrlStatus: apiUrlConstants.initial,
  }

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiUrlStatus: apiUrlConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookDetailsUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    console.log(bookDetailsUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(bookDetailsUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        id: data.book_details.id,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        aboutBook: data.book_details.about_book,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
        aboutAuthor: data.book_details.about_author,
      }
      this.setState({
        booksDetailsObj: updatedData,
        apiUrlStatus: apiUrlConstants.success,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="bookshelf-loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {booksDetailsObj} = this.state
    console.log(booksDetailsObj)
    return (
      <div>
        <div className="book-details-container">
          <div className="book-thumbnail-and-info-container">
            <img
              src={booksDetailsObj.coverPic}
              className="thumbnail-image"
              alt={booksDetailsObj.title}
            />
            <div className="book-info-container">
              <h1 className="book-details-title">{booksDetailsObj.title}</h1>
              <p className="book-details-author">
                {booksDetailsObj.authorName}
              </p>
              <p className="book-details-rating">
                Avg Rating <BsFillStarFill className="star-icon" />{' '}
                {booksDetailsObj.rating}
              </p>
              <p className="book-details-status">
                Status:{' '}
                <span className="book-status">
                  {booksDetailsObj.readStatus}
                </span>
              </p>
            </div>
          </div>
          <hr className="horizontal-line" />
          <h1 className="about-heading">About author</h1>
          <p className="about-info">{booksDetailsObj.aboutAuthor}</p>
          <h1 className="about-heading">about Book</h1>
          <p className="about-info">{booksDetailsObj.aboutBook}</p>
        </div>
        <div className="footer-icons">
          <FaGoogle />
          <FaTwitter />
          <RiInstagramFill />
          <FaYoutube />
        </div>
        <p className="contact-para">Contact Us</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="bookshelf-failure-section">
      <img
        src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708885227/bookhub%20assets/home/vzcccjrrhwmzoe7yanpg.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p className="failure-message">Something went wrong. Please try again</p>
      <button
        type="button"
        className="tryagain-btn"
        onClick={this.getBookDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderView = () => {
    const {apiUrlStatus} = this.state
    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.renderLoadingView()
      case apiUrlConstants.success:
        return this.renderSuccessView()
      case apiUrlConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="book-details-page">
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default BookDetails
