import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Readability } from "readability-node";
import * as Animatable from "react-native-animatable";
import { Font, LinearGradient } from "expo";
import TypeWriter from "react-native-typewriter";
import { RkCard } from 'react-native-ui-kitten';
import ReaderView from "./ReaderView"
// import { JSDOM } from "jsdom";

let SCREEN_WIDTH = Dimensions.get('window').width;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      greetingLoaded: false,
      listenVoice: false,
      showArticle: false,
      article: 0
    };
  }
  componentDidMount() {
    Font.loadAsync({ "open-sans-semibold": require("./assets/OpenSans-SemiBold.ttf") }).then(() => this.setState({ fontLoaded: true }));
    // const html = await this.getPageContent("http://sreejithr.in/notes/lego-software-engineers-and-the-bubble");
    // const documentRef = this.getPageDocumentReference(html);
    // const text = await this.getCleanedContent(documentRef);
    // this.setState({ text });
  }

  async getPageContent(url) {
    return (await fetch(url)).text()
  }

  // getPageDocumentReference(contents) {
  //   const dom = new JSDOM(contents);
  //   return dom && dom.window && dom.window.document;
  // }

  async getCleanedContent(documentRef) {
    return new Readability(documentRef).parse();
  }

  onPressArticle(id) {
    this.setState({
      showArticle: true,
      article: id
    });
  }

  _renderList() {
    return (
      <Animatable.View animation="fadeInUp">
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Suggested reads</Text>
        </View>
        <RkCard style={styles.card} shadowColor="black">
          <TouchableOpacity onPress={() => this.onPressArticle(1)}>
            <Text style={styles.titleText}>How a TV Sitcom Triggered the Downfall of Western Civilization</Text>
            <View style={styles.description}>
              <Text style={styles.descriptionText}>Added on 19th Apr</Text>
              <Text style={styles.descriptionText}>9min read</Text>
            </View>
          </TouchableOpacity>
        </RkCard>
        <RkCard style={styles.card}>
          <TouchableOpacity onPress={() => this.onPressArticle(2)}>
            <Text style={styles.titleText}>Travel Is No Cure for the Mind</Text>
            <View style={styles.description}>
              <Text style={styles.descriptionText}>Added on 3rd Jun</Text>
              <Text style={styles.descriptionText}>12min read</Text>
            </View>
          </TouchableOpacity>
        </RkCard>
        <RkCard style={styles.card}>
          <TouchableOpacity onPress={() => this.onPressArticle(3)}>
            <Text style={styles.titleText}>How To Write Better Code In React</Text>
            <View style={styles.description}>
              <Text style={styles.descriptionText}>Added on 4th Mar</Text>
              <Text style={styles.descriptionText}>13min read</Text>
            </View>
          </TouchableOpacity>
        </RkCard>
      </Animatable.View>
    );
  }

  _renderArticle() {
    return (
      <View style={styles.articleContainer}>
        <TouchableOpacity
          style={{ paddingVertical: 15, paddingHorizontal: 20 }}
          onPress={() => this.setState({showArticle: false})}
        >
          <Text style={{color: 'black', fontWeight: 'bold'}}>Back</Text>
        </TouchableOpacity>
        <ReaderView previouslyRead={this.state.article === 2} stop={() => this.setState({ showArticle: false })}/>
      </View>
    );
  }

  _renderContents() {
    if (this.state.listenVoice) {
      return this._renderVoiceUI();
    }

    if (!this.state.greetingLoaded) {
      return null;
    }

    return (
      <View>
        { this.state.greetingLoaded && this._renderList() }
      </View>
    );
  }

  _renderVoiceUI() {
    setTimeout(() => this.setState({showUsersVoice: true}), 5000);
    return (
      <View>
        { this.state.showUsersVoice ?
            (
              <Text style={styles.usersVoice}>
                <TypeWriter typing={1} onTypingEnd={() => setTimeout(() => this.setState({ listenVoice: false, showUsersVoice: false }), 3000)}>
                  Cortana, I have 15 mins to spare. Get me something to read.
                </TypeWriter>
              </Text>
            ) :
            <Text style={styles.listeningText}>Listening...</Text>
        }
      </View>
    );
  }

  onPressVoiceInput = () => {
    this.setState({ listenVoice: true });
  }

  render() {
    if (!this.state.fontLoaded) {
      return null;
    }

    if (this.state.showArticle) {
      return this._renderArticle();
    }

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4a50ae', '#60abc0']}
          style={{flex: 1, alignItems: 'center'}}
        >
          <View style={styles.conversationSection}>
            <View style={styles.introGreeting}>
              <Animatable.Text animation="fadeInDown" style={styles.introGreetingText} onAnimationEnd={() => this.setState({ greetingLoaded: true})}>
                Good evening, John!
              </Animatable.Text>
            </View>
            { this.state.greetingLoaded ? (
                <View style={styles.chat}>
                  <Text style={styles.greetingText}>
                    <TypeWriter typing={1}>
                      Say "Cortana" and I can help you around!
                    </TypeWriter>
                  </Text>
                </View>
              ) : null
            }
          </View>
          { this._renderContents() }
          <TouchableOpacity style={styles.micButton} onPress={this.onPressVoiceInput}>
            <Image source={require('./assets/mic.png')} style={{height: 60, width: 60, paddingBottom: 10}}/>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative'
  },
  articleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20
  },
  introGreeting: {
    width: SCREEN_WIDTH,
    paddingTop: 60,
    alignItems: 'center'
  },
  introGreetingText: {
    fontFamily: "open-sans-semibold",
    fontSize: 24,
    color: 'white'
  },
  greetingText: {
    fontFamily: "open-sans-semibold",
    fontSize: 18,
    color: '#707bc1',
//    color: 'white',
    textAlign: 'center'
  },
  chat: {
    margin: 20,
    alignItems: 'center',
    paddingBottom: 20
  },
  card: {
    margin: 10,
    borderRadius: 5,
    padding: 8,
    elevation: 3
  },
  titleText: {
    fontFamily: 'open-sans-semibold',
    fontSize: 18,
    fontWeight: 'bold'
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionText: {
    color: 'gray'
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'open-sans-semibold',
    marginLeft: 20
  },
  conversationSection: {
    height: 180
  },
  micButton: {
    position: 'absolute',
    bottom: 0
  },
  usersVoice: {
    color: 'white',
    fontSize: 18,
    margin: 20
  },
  listeningText: {
    color: '#707bc1',
    fontSize: 18
  }
});
