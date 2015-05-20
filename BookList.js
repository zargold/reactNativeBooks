'use strict';

var REQUEST_URL = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';

var BookDetail = require('./BookDetail');

var React = require('react-native');

var {
    Image,
    StyleSheet,
    Text,
    View,
    Component,
    ListView,
    TouchableHighlight,
    ActivityIndicatorIOS
   } = React;
 
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B5F1FF',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    listView: {
       backgroundColor: '#AFBCFF'
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
    },
    rightContainer: {
        flex: 1,
        backgroundColor: 'rgba(50,200,200, 0.8)'
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    author: {
        color: '#48408F'
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(200,200,200,.8)"
    }
});
 
class BookList extends Component {
    constructor(props) {
       super(props);
       this.state = {
           isLoading: true,
           dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
           })
       };
   }
   componentDidMount() {
    this.fetchData();
   }
   fetchData(){
     fetch(REQUEST_URL)
       .then((response) => response.json())
       .then((responseData) => {
           this.setState({
               dataSource: this.state.dataSource.cloneWithRows(responseData.items),
               isLoading: false
           });
       })
       .done();
   }
   renderBook(book) {
       return (
            <TouchableHighlight onPress={() => this.showBookDetail(book)}  underlayColor='#dddddd'>
                <View>
                    <View style={styles.container}>
                        <Image
                            source={{uri: book.volumeInfo.imageLinks.thumbnail}}
                            style={styles.thumbnail} />
                        <View style={styles.rightContainer}>
                            <Text style={styles.title}>{book.volumeInfo.title}</Text>
                            <Text style={styles.author}>{book.volumeInfo.authors}</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                </View>
            </TouchableHighlight>
       );
   }
   showBookDetail(book) {
       this.props.navigator.push({
           title: book.volumeInfo.title,
           component: BookDetail,
           passProps: {book}
       });
   }
    render() {
    if (this.state.isLoading) {
            return this.renderLoadingView();
    }
 
       return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderBook.bind(this)}
                style={styles.listView}
                />
        );
    }
    renderLoadingView() {
    return (
        <View style={styles.loading}>
            <ActivityIndicatorIOS
                size='large'/>
            <Text>
                Loading books...
            </Text>
        </View>
    );
}
}
 
module.exports = BookList;