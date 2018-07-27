import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import TopNews from "./TopNews"
import Header from "./Header"

class HomePage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Header/>
                <TopNews/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }
})

export default HomePage