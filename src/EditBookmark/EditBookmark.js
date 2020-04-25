import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'

const Required = () => (
    <span className='AddBookmark__required'>*</span>
);

class EditBookmark extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    };

    static contextType = BookmarksContext;

    state = {
        error: null,
        id: null,
        title: null,
        url: null,
        description: null,
        rating: null,
    };

    componentDidMount() {
        console.log(this.props.match.params);
        const bookmarkId = this.props.match.params.bookmark_id;
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error));

                return res.json()
            })
            .then(responseData => {
                this.setState({
                    id: responseData.id,
                    title: responseData.title,
                    url: responseData.url,
                    description: responseData.description,
                    rating: responseData.rating,
                })
            })
            .catch(error => {
                console.error(error);
                this.setState({ error })
            })
    }

    handleSubmit = e => {
        e.preventDefault();
        const bookmarkId = this.props.match.params.bookmark_id;

        const bookmark = {};
        const fields = [ 'title', 'url', 'description', 'rating' ];
        fields.forEach((field, idx)=> {
            bookmark[field] = e.target[idx].value;
        });
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${config.API_KEY}`
            },
        })
            .then(res => {
                if (!res.ok)
                    return res
                        .json()
                        .then(error => Promise.reject(error))
            })
            .then(
                this.context.editBookmark(bookmark)
            )
            .then(() => {
                this.props.history.push('/');
                //incredibly hack-y but updated values don't show unless refreshed.
                //TODO: make values show without using location.reload();
                this.props.history.push('/');
            })
            .catch(error => {
                console.error(error);
                this.setState({ error })
            })
    };

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    render() {
        const { error, id, title, url, description, rating } = this.state;
        const bookmark = { id, title, url, description, rating };
        return (
            <section className='AddBookmark'>
                <h2>Create a bookmark</h2>
                <form
                    className='AddBookmark__form'
                    onSubmit={(e) => this.handleSubmit(e)}
                >
                    <div className='AddBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            placeholder='Great website!'
                            defaultValue={this.state.title}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            placeholder='https://www.great-website.com/'
                            defaultValue={this.state.url}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        <textarea
                            name='description'
                            id='description'
                            defaultValue={this.state.description}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            defaultValue={this.state.rating}
                            min='1'
                            max='5'
                            required
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Save
                        </button>
                    </div>
                </form>
            </section>
        );
    }
}

export default EditBookmark;