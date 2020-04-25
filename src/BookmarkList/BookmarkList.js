import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import BookmarkItem from '../BookmarkItem/BookmarkItem';
import './BookmarkList.css'

class BookmarkList extends Component {
  static proptTypes = {
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      })
    )
  };

  static defaultProps = {
    bookmarks: []
  };

  static contextType = BookmarksContext;

  componentDidMount() {
      if (this.context.bookmarks !== this.props.bookmarks) {

      }
  }

    render() {
    const { bookmarks } = this.context;
    return (
      <section className='BookmarkList'>
        <h2>Your bookmarks</h2>
        <ul className='BookmarkList__list' aria-live='polite'>
            {console.log(bookmarks)}
          {bookmarks.map(bookmark =>
            <BookmarkItem
              key={bookmark.id}
              {...bookmark}
            />
          )}
        </ul>
      </section>
    );
  }
}

export default BookmarkList;
