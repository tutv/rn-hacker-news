# Sử dụng Fetch API xây dựng ứng dụng Hacker News

## Mục tiêu

- Biết cách sử dụng `Fetch API` để tạo HTTP request.
- Biết thay đổi các tham số trong `Fetch API` để tạo các request khác nhau.
- Biết cách gọi request trong `life cycle` của React một cách đúng đắn.

## Mô tả

- Tạo 1 ứng dụng với chức năng hiển thị danh sách tin tức từ [Hacker News](https://github.com/HackerNews/API)

## Hướng dẫn

### Bước 1

- Tạo project với `create-react-native-app`.

### Bước 2

- Tạo 1 component `HomePage` trong đó có chứa 2 component `Header` và `TopNews`.

### Bước 3

- Trong `TopNews` component chúng ta sẽ gọi đến API tại hook `componentDidMount`:

```javascript
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
```

Note: Ở trong component này có sử dụng `RefreshControl` để cho phép người dùng refesh lại danh sách news.

### Bước 4

- Do API lấy danh sách news chỉ lấy ra được `ID` của news nên trong từng `NewsItem` chúng ta sẽ gọi tiếp API để lấy ra nội dung của news đó.

- Trong component `NewsItem` chúng ta sẽ gọi API tại hook `componentDidMount` và gọi lại API khi `ID` của nó thay đổi bằng cách kiểm tra trong hook `componentDidUpdate`.

```javascript
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
```

### Bước 5

- Chạy chương trình và quan sát kết quả.

## Mã nguồn

Tham khảo tại: https://github.com/tutv/rn-hacker-news

## Ảnh demo
![Home page](/demo/home.jpeg)