import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet} from 'react-native'
import moment from 'moment'

class NewsItem extends Component {
    state = {
        news: {},
        loading: false
    }

    componentDidMount() {
        const {index} = this.state
        setTimeout(() => {
            this._fetchDetail()
        }, index * 1000 || 0)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.id !== this.props.id) {
            this._fetchDetail()
        }
    }

    _fetchDetail = () => {
        const {id} = this.props

        this.setState({
            loading: true
        })

        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    news: result ? result : {},
                    loading: false
                })
            })
            .catch(error => {
                console.error('Fetch error', error)

                this.setState({loading: false})
            })
    }

    render() {
        const {index} = this.props
        const {news, loading} = this.state

        const score = news.score || 0;
        const pointText = score > 1 ? 'points' : 'point'
        const timeAgo = moment(news.time * 1000).fromNow()

        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <Text style={styles.index}>{index + 1}.</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.title}>
                        {
                            loading ? 'Loading...' : news.title
                        }
                    </Text>
                    {
                        !!news && Object.keys(news).length &&
                        <Text style={styles.meta}>{news.score || 0} {pointText} {timeAgo}</Text>
                    }
                </View>
            </View>
        )
    }
}

NewsItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    index: PropTypes.number.isRequired,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },

    left: {
        marginRight: 10
    },

    right: {},

    index: {
        color: '#828282',
        fontSize: 14,
        minWidth: 15,
        textAlign: 'right'
    },

    title: {
        color: '#000',
        fontSize: 14,
        marginRight: 20,
        flex: 1,
        flexWrap: 'wrap'
    },

    meta: {
        color: '#828282',
        fontSize: 12
    }
})

export default NewsItem