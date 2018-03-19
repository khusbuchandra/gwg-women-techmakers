import React, { Component } from 'react';
import {getCity} from '../services/geolocation.js';
import {getWeather} from '../services/weather.js';

// import { GoogleApiWrapper } from 'google-maps-react';

export default class HeaderContainer extends Component {
  state = {
  };
  // onGoogleMapLoad = map => {
  //   this.map = map;
  // }
 
  getCityWeather(latitude, longitude) {

    getCity(latitude, longitude).then((city) => {                
      this.setState({currentCity: city})
    }).catch(function(err) {
      console.log('Error retrieving the current city: ', err);
    });

    getWeather(latitude, longitude).then((weather) => {
      this.setState({currentWeather: weather})
    }).catch(function(err){
      console.log('Error retrieving the current weather: ', err);
    })
  }
    
  getMyLocation = () => {    
    const {handleLocationChange} = this.props;  
    const pos = {
      lat: parseFloat(localStorage.getItem('lat')),
      lng: parseFloat(localStorage.getItem('lng'))
    }

    handleLocationChange(pos);

    // ***Get Location from Cache
    if (pos.lat && pos.lng) {
      console.log('get location from cache');
       this.getCityWeather(pos.lat, pos.lng);
    }  
    
    const errorLocation = (err) => {
      console.log("error retrieving current position, " + err);
    }

    // ***Get Location from getCurrentPosition
    const currentLocation = (position) => {
      console.log('get location from getcurrentposition');
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      handleLocationChange(pos);

      localStorage.setItem('lat', pos.lat);
      localStorage.setItem('lng', pos.lng); 
      this.getCityWeather(pos.lat, pos.lng);
    }
  
    // Ask user for permission to use location services
    if (navigator.geolocation) {        
      navigator.geolocation.getCurrentPosition(currentLocation, errorLocation);
    } else {          
      alert('Sorry your browser doesn\'t support the Geolocation API');    
    }
  }

  componentWillMount() {
    this.getMyLocation();
  }

  // componentWillReceiveProps() {
  //   console.log('this is happening  ')
  //   const {props} = this;
  //   console.log(props, this.state)
    
  // }

  render () {
    // if (this.props.google && !this.state.currentCity && !this.state.currentWeather) {
    //   console.log('now we')
    //   this.getMyLocation();
    // }
    const message = (this.state.currentCity && this.state.currentWeather) ?
    `Welcome - You are in ${this.state.currentCity} and the temperature is ${this.state.currentWeather} °F` :
    `Welcome`;
    return(
        <h3 className="header">
          {message}
      </h3>
    );
  }
}

// export default GoogleApiWrapper({
//   apiKey: (process.env.REACT_APP_GKEY),
//   libraries: ['places'],
//   version: '3'
// })(HeaderContainer)