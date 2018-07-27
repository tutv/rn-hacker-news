import React, {Component} from 'react'
import {View, Image, Text, StyleSheet} from 'react-native'

class Header extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.list}>
                    <Image style={styles.logo} source={{uri: 'https://news.ycombinator.com/y18.gif'}}/>
                    <Text style={styles.title}>Hacker News</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 5,
        paddingTop: 30,
        backgroundColor: '#ff6600',
    },

    list: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    },

    logo: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 5
    },

    title: {
        color: '#222',
        fontWeight: 'bold'
    },

    new: {
        color: '#fff'
    }
})

export default Header