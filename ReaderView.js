import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';

let SCREEN_WIDTH = Dimensions.get('window').width;

export default class ReaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: true,
      currentParagraph: 0,
      showUsersVoice: false
    };
  }

  componentDidMount() {
    const self = this;
    const timer = setInterval(() => {
      if (self.state.currentParagraph > 2) {
        clearInterval(timer);
      }
      this.setState({ currentParagraph: this.state.currentParagraph + 1 });
    }, 4000);
  }

  onPressSummary() {
    this.setState({ showMessage: false });
  }

  onPressVoiceInput = () => {
    this.setState({ showUsersVoice: true });
  }

  _renderCortana() {
    return (
          <TouchableOpacity style={styles.micButton} onPress={this.onPressVoiceInput}>
            <Image source={require('./assets/mic.png')} style={{height: 60, width: 60, paddingBottom: 10}}/>
          </TouchableOpacity>
    );
  }

  _renderVoiceUI() {
    setTimeout(() => this.setState({showUsersVoice: true}), 3000);
    return (
      <View>
        { this.state.showUsersVoice ?
            (
              <Text style={styles.usersVoice} onTypingEnd={() => this.props.stop()}>
                <TypeWriter typing={1}>
                  Cortana, stop reading.
                </TypeWriter>
              </Text>
            ) :
            <Text style={styles.listeningText}>Listening...</Text>
        }
      </View>
    );
  }

  _renderArticle() {
    return (
      <View style={{marginHorizontal: 20, marginTop: 20}}>
        <Text style={{ backgroundColor: this.state.currentParagraph === 0 ? "yellow" : "white", fontSize: 22, fontWeight: 'bold' }}>
          Travel Is No Cure for the Mind          
        </Text>
        <View style={{ backgroundColor: this.state.currentParagraph === 1 ? "yellow" : "white", padding: 10 }}>
          <Image source={require('./assets/offthepath.jpg')} style={{height: 150, width: SCREEN_WIDTH - 40}} />
        </View>
        <Text style={{ backgroundColor: this.state.currentParagraph === 2 ? "yellow" : "white", fontSize: 18 }}>
        It’s just another day… and you’re just doing what you need to do. You’re getting things done, and the day moves forward in this continuous sequence of checklists, actions, and respites.
        </Text>
        <Text style={{ backgroundColor: this.state.currentParagraph === 2 ? "yellow" : "white", fontSize: 18 }}>
          But at various moments of your routine, you pause and take a good look at your surroundings. The scenes of your everyday life. The blur of this all-too-familiar film.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderArticle()}
        {this.props.previouslyRead && this.state.showMessage ? (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>
                Looks like you have read this before.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => this.onPressSummary()}>
                <Text style={styles.messageText}>
                  Give me a summary
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => this.onPressSummary()}>
                <Text style={styles.messageText}>
                  Start from beginning
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        {
          this.props.showCortana && this.props.previouslyRead && this.state.showMessage ? 
            this._renderCortana() :
            null
        }
        {
          this.state.listenVoice ? 
          (
            <View style={{position: 'absolute', top: 400, left: SCREEN_WIDTH/3}}>
              {this._render}
            </View>
          ) : null
        }
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
  message: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: "#4a50ae",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5
  },
  messageTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  messageText: {
    color: 'white',
    fontSize: 14
  },
  button: {
    backgroundColor: "#60abc0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 3
  },
  micButton: {
    position: 'absolute',
    bottom: 0
  },
});