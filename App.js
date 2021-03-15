import { StatusBar } from 'expo-status-bar';
import React,{Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import MQTT from 'sp-react-native-mqtt';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isConencting:false,
       isConnected:false,
       message:"",
       sendMessage: "",
       isError:false,
        client:null,
    }
}
  onConnectPress =()=>{
  var  contextV = this;

    this.setState({
      isConencting :true,
      isError:false,
    })
    MQTT.createClient({
      uri: 'mqtt://patrioot.senarios.co:1883',
      clientId: 'hgfghvghjhjjvjcj',
      user:"sammy",
      // port:8883,
      // host:"patrioot.senarios.co",
      pass:"1234",
      auth:true,
      // tls:true,
      keepalive:1,
    }).then(function(client) {
    
      client.on('closed', function() {
        contextV.updateConnectingStatus("",false,false,null)
        console.log('mqtt.event.closed');
      });
    
      client.on('error', function(msg) {
       contextV. updateConnectingStatus(msg,true,false,null)
        console.log('mqtt.event.error', msg);
      });
    
      client.on('message', function(msg) {
        // var JsonData = JSON.parse(msg);
        contextV. updateConnectingStatus(msg.data,false,true,client)
        console.log('mqtt.event.message', msg);
      });
    
      client.on('connect', function() {
        contextV.updateConnectingStatus("",false,true,client)
        console.log('connected');
        client.subscribe('test', 1);
      });
    
      client.connect();
    }).catch(function(err){
      contextV.updateConnectingStatus(err,false,false,null)
      console.log("mqqt checking error",err);
    });
  }
  updateConnectingStatus=(msg,isError,isConnected,client)=>{
    this.setState({
      isConencting :false,
      isConnected:isConnected,
      message:msg==undefined?"":this.state.message+msg,
      isError :isError,
      client:client
    })
  }
  onMessageChange = (text) => {
    this.setState({sendMessage: text});
  };
  onSendClick=()=>{
    // this.state.client.isConnected
    this.state.client.publish('test', this.state.sendMessage, 1, false);
  }
  render(){
    return (
      <View style={styles.container}>
        {this.state.isConnected&&!this.state.isConencting&&
        <View style={{width:"80%"}}>
          <Text>{this.state.message}</Text>
          <TextInput
                  style={styles.editText}
                  onChangeText={(text) => this.onMessageChange(text)}
                  returnKeyType="done"
                  value={this.state.sendMessage}
                  placeholder={"Type Message"
                  }/>
                   <TouchableOpacity style={{ width: '52%', alignSelf: 'center',marginTop:"15%" }} onPress={() => this.onSendClick()}>
                                  <View style={styles.button}>
                                      <Text style={{ color: '#fff',  fontSize:16 }}>Send</Text>
                                  </View>
                              </TouchableOpacity>
          </View>}
       {((!this.state.isConencting || this.state.isError)&&!this.state.isConnected)&&
        <TouchableOpacity style={{ width: '92%', alignSelf: 'center' }} onPress={() => this.onConnectPress()}>
                                  <View style={styles.button}>
                                      <Text style={{ color: '#fff',  fontSize:16 }}>Connect</Text>
                                  </View>
                              </TouchableOpacity>}
                              {this.state.isConencting&&
                             <View>
                             <ActivityIndicator size="large" color="#2B00F2" />
                           </View>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2B00F2',
    height: 42,
    width: '100%',
    borderRadius: 5,
    padding:20,
    justifyContent: 'center',
    alignItems: 'center'
},
editText: {
  marginTop: 40,
  height: 50,
  fontSize: 16,
  width:"100%",
  borderColor: 'gray',
  borderBottomWidth: 1,
},
});
