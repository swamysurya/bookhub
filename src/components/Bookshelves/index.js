import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {FaGoogle, FaTwitter, FaYoutube} from 'react-icons/fa'
import {RiInstagramFill} from 'react-icons/ri'

import Header from '../Header'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiUrlConstants = {
  initial: 'INTIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Bookshelves extends Component {
  state = {
    apiUrlStatus: apiUrlConstants.initial,
    bookSearchInputValue: '',
    fetchedBooksObject: {},
    activeShelfId: bookshelvesList[0].value,
    activeHeading: bookshelvesList[0].label,
    noBooksMsgValue: '',
  }

  componentDidMount() {
    this.getGetBooks()
  }

  getGetBooks = async () => {
    const {bookSearchInputValue, activeShelfId} = this.state
    this.setState({
      apiUrlStatus: apiUrlConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const getBooksApiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeShelfId}&search=${bookSearchInputValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(getBooksApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        books: data.books.map(eachBook => ({
          authorName: eachBook.author_name,
          coverPic: eachBook.cover_pic,
          id: eachBook.id,
          rating: eachBook.rating,
          readStatus: eachBook.read_status,
          title: eachBook.title,
        })),
        total: data.total,
      }
      this.setState({
        fetchedBooksObject: updatedData,
        apiUrlStatus: apiUrlConstants.success,
        noBooksMsgValue: bookSearchInputValue,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failure})
    }
  }

  loadingView = () => (
    <div className="bookshelf-loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {fetchedBooksObject, noBooksMsgValue} = this.state
    const {books, total} = fetchedBooksObject
    return (
      <>
        {total !== 0 ? (
          <>
            <ul className="book-list-container">
              {books.map(eachBook => this.renderBookCard(eachBook))}
            </ul>
            <div className="footer-icons">
              <FaGoogle />
              <FaTwitter />
              <RiInstagramFill />
              <FaYoutube />
            </div>
            <p className="contact-para">Contact Us</p>
          </>
        ) : (
          <div className="no-books-view">
            <img
              src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708988217/bookhub%20assets/bookShelf/t0hvfofcs8xhlkv9ouax.png"
              className="no-books-image"
              alt="no books"
            />
            <p className="no-books-msg">
              Your search for {noBooksMsgValue} did not find any matches.
            </p>
          </div>
        )}
      </>
    )
  }

  renderBookCard = bookDetails => (
    <li key={bookDetails.id} className="book-list-element">
      <Link to={`/books/${bookDetails.id}`} className="book-link-element">
        <div className="book-image-container">
          <img
            src={bookDetails.coverPic}
            className="book-image"
            alt={bookDetails.title}
          />
        </div>
        <div>
          <h1 className="book-title">{bookDetails.title}</h1>
          <p className="book-author">{bookDetails.authorName}</p>
          <p className="book-rating">
            Avg Rating <BsFillStarFill className="star-icon" />{' '}
            {bookDetails.rating}
          </p>
          <p className="book-reading-status">
            Status:{' '}
            <span className="book-reading-status-info">
              {bookDetails.readStatus}
            </span>
          </p>
        </div>
      </Link>
    </li>
  )

  failureView = () => (
    <div className="bookshelf-failure-section">
      <img
        src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708885227/bookhub%20assets/home/vzcccjrrhwmzoe7yanpg.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p className="failure-message">Something went wrong. Please try again</p>
      <button type="button" className="tryagain-btn" onClick={this.getGetBooks}>
        Try Again
      </button>
    </div>
  )

  handleOnChangeSearchInput = event => {
    this.setState({bookSearchInputValue: event.target.value})
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.getGetBooks()
    }
  }

  onHandleSearch = () => {
    const {bookSearchInputValue} = this.state
    if (bookSearchInputValue !== '') {
      this.getGetBooks()
    }
  }

  handleClickShelf = (value, label) => {
    this.setState(
      {activeShelfId: value, activeHeading: label},
      this.getGetBooks,
    )
  }

  renderView = () => {
    const {apiUrlStatus} = this.state
    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.loadingView()
      case apiUrlConstants.success:
        return this.successView()
      case apiUrlConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {bookSearchInputValue, activeShelfId, activeHeading} = this.state
    console.log(bookSearchInputValue)
    return (
      <div className="bookshelves-container">
        <Header />
        <div className="search-shelf-and-bookslist-container">
          <div className="search-and-shelf-container">
            <div className="search-input-container">
              <input
                type="search"
                value={bookSearchInputValue}
                className="search-input-element"
                placeholder="search"
                onChange={this.handleOnChangeSearchInput}
                onKeyDown={this.handleKeyDown}
              />
              <button
                className="seach-btn-element"
                type="button"
                onClick={this.onHandleSearch}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="shelf-container">
              <h1 className="bookshelves-heading">Bookshelves</h1>
              <ul className="bookshelf-list-container">
                {bookshelvesList.map(eachShelfName => (
                  <li key={eachShelfName.id}>
                    <button
                      type="button"
                      className={`shelf-name ${
                        eachShelfName.value === activeShelfId ? 'highlight' : ''
                      }`}
                      onClick={() =>
                        this.handleClickShelf(
                          eachShelfName.value,
                          eachShelfName.label,
                        )
                      }
                    >
                      {eachShelfName.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="search-and-lsit-footer-container">
            <div className="shelf-name-and-search-container">
              <h1 className="shelf-name">{activeHeading} Books</h1>
              <div className="search-input-container1">
                <input
                  value={bookSearchInputValue}
                  type="search"
                  className="search-input-element"
                  placeholder="search"
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleOnChangeSearchInput}
                />
                <button
                  className="seach-btn-element"
                  type="button"
                  onClick={this.onHandleSearch}
                  testid="searchButton"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            {this.renderView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Bookshelves
