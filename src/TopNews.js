import React, {Component} from 'react'
import {View, Text, ScrollView, RefreshControl, StyleSheet} from 'react-native'
import NewsItem from "./NewsItem"

class TopNews extends Component {
    state = {
        news: [],
        error: '',
        loading: false
    }

    _mounted = false

    componentDidMount() {
        this._mounted = true
        this._fetchListNews()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    _fetchListNews = () => {
        if (this.state.loading) return

        this.setState({loading: true})

        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(response => response.json())
            .then(result => {
                if (!this._mounted) return

                this.setState({
                    loading: false,
                    news: Array.isArray(result) ? result : [],
                    error: ''
                })
            })
            .catch(error => {
                if (!this._mounted) return
                const message = error.message || 'Fetch list news failed'

                this.setState({
                    error: message,
                    loading: false
                })
            })
    }

    _handleRefresh = () => {
        this._fetchListNews()
    }

    render() {
        const {news, error, loading} = this.state

        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this._handleRefresh}/>
                }>
                    {
                        !!error ? <Text>{error}</Text>
                            : news.map((id, index) => {
                                return <NewsItem key={id} index={index} id={id}/>
                            })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f6f6ef',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10
    }
})

export default TopNews