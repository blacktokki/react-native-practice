import { clamp, random } from 'lodash';
import React, { Component } from 'react';
import {
  Dimensions,
  PanResponder,
  Platform,
  View,
  ImageBackground
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    marginHorizontal: '50%',
    left: -50,
    flex:1,
    width:100,
    backgroundColor: "transparent",
  },
  container2:{
    top:'50%',
    backgroundColor: "transparent"
  },
  rectangle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    zIndex: 10,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
  }
};

export default class Cube extends Component {
  constructor(props) {
    super(props);
    this.direction = {ddx:0, ddy:0, dx:0, dy:0};
  }
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove.bind(this),
    });
  }
  handlePanResponderMove (e, gestureState) {
    // const { vx, vy } = gestureState;
    // this.direction.dx += vx * 10
    // this.direction.dy += vy * 10
    // this.roll(this.direction.dx, this.direction.dy)
  }
  componentDidMount(){
    // this.roll(45, -30)
    this.interval = setInterval(()=>{
      this.direction.ddx = clamp(this.direction.ddx + random(8) -4, -20, 20)
      this.direction.ddy = clamp(this.direction.ddy + random(8) -4, -20, 20)
      this.direction.dx += this.direction.ddx
      this.direction.dy += this.direction.ddy
      this.roll(this.direction.dx, this.direction.dy)}, 17
    )
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }

  roll(dx ,dy){
    const translateZ = Platform.OS == 'web'? {translateZ:50} : {matrix:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,50,1]}
    let z = Math.cos(dx* Math.PI/180) * Math.cos(dy* Math.PI/180)
    this.refViewFront.setNativeProps({style:{ transform: [{perspective: 1000}, {rotateX: dy + "deg"}, { rotateY: dx + "deg" }, translateZ, {scale:z>=0?1:0}]}});
    z = Math.cos((dx+180)* Math.PI/180) * Math.cos(dy* Math.PI/180)
    this.refViewBack.setNativeProps({style: {transform: [{perspective: 1000},{rotateX: dy + "deg"}, { rotateY: (dx + 180) + "deg" }, translateZ, {scale:z>=0?1:0}]}});
    z =  Math.cos((dx+90)* Math.PI/180) * Math.cos(dy* Math.PI/180)
    this.refViewRight.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: dy + "deg"}, {rotateY: (dx + 90) + "deg"}, translateZ, {scale:z>=0?1:0}]}});
    z = Math.cos((dx-90)* Math.PI/180) * Math.cos(dy* Math.PI/180)
    this.refViewLeft.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: dy + "deg"}, {rotateY: (dx - 90) + "deg" }, translateZ, {scale:z>=0?1:0}]}});
    z = Math.cos((dy+90)* Math.PI/180)
    this.refViewTop.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: (dy + 90) + "deg" }, { rotateZ: (-dx) + "deg"}, translateZ, {scale:z>=0?1:0}]}});
    z = Math.cos((dy-90)* Math.PI/180)
    this.refViewBottom.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: (dy - 90) + "deg" }, { rotateZ: dx + "deg"}, translateZ, {scale:z>=0?1:0}]}});
  }

  renderLeft(color) {
    const image = require('@react-native-practice/core/assets/images/favicon.png')
    return (
      <ImageBackground
        source={image.default || image}
        ref={component => this.refViewRight = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      ></ImageBackground>
    )
  }

  renderRight(color) {
    return (
      <ImageBackground
        ref={component => this.refViewLeft = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      ></ImageBackground>
    )
  }

  renderFront(color) {
    return (
      <ImageBackground
        ref={component => this.refViewFront = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      ></ImageBackground>
    )
  }

  renderBack(color) {
    return (
      <ImageBackground
        ref={component => this.refViewBack = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      ></ImageBackground>
    )
  }

  renderTop(color) {
    return (
      <View
        ref={component => this.refViewTop = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      ></View>
    )
  }

  renderBottom(color) {
    return (
      <View
        ref={component => this.refViewBottom = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
        {...this.panResponder.panHandlers}
      ></View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          {this.renderFront('#FF0000')}
          {this.renderBack('#FFFF00')}
          {this.renderLeft('#00FF00')}
          {this.renderRight('#00FFFF')}
          {this.renderTop('#0000FF')}
          {this.renderBottom('#888888')}
        </View>
      </View>
    );
  }
}
