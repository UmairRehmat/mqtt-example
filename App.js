import { StatusBar } from 'expo-status-bar';
import React,{Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MQTT from 'sp-react-native-mqtt';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isConencting:false,
       isConnected:false,
       message:"",
       isError:false,
    }
}
  onConnectPress =()=>{
  var  contextV = this;

    this.setState({
      isConencting :true,
      isError:false,
    })
    MQTT.createClient({
      uri: 'mqtt://patrioot.senarios.co:8883',
      clientId: 'hgfghvghjhjjvjcj',
      user:"sammy",
      // port:8883,
      // host:"patrioot.senarios.co",
      pass:"1234",
      // auth:true,
      tls:true,
      keepalive:1,
    }).then(function(client) {
    
      client.on('closed', function() {
        contextV.updateConnectingStatus("",false)
        console.log('mqtt.event.closed');
      });
    
      client.on('error', function(msg) {
       contextV. updateConnectingStatus(msg,true)
        console.log('mqtt.event.error', msg);
      });
    
      client.on('message', function(msg) {
        contextV. updateConnectingStatus(msg,false)
        console.log('mqtt.event.message', msg);
      });
    
      client.on('connect', function() {
        contextV.updateConnectingStatus("",false)
        console.log('connected');
        client.subscribe('test', 0);
        client.publish('test', "test", 0, false);
      });
    
      client.connect();
    }).catch(function(err){
      contextV.updateConnectingStatus(err,false)
      console.log("mqqt checking error",err);
    });
  }
  updateConnectingStatus=(msg,isError)=>{
    this.setState({
      isConencting :false,
      isConnected:true,
      message:msg==undefined?"":msg,
      isError :isError,
    })
  }
  render(){
    return (
      <View style={styles.container}>
        {this.state.isConnected&&!this.state.isConencting&&
        <Text>{this.state.message}</Text>}
       {(!this.state.isConencting || this.state.isError)&&
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
});
