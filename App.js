import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { PCO_AUTH_URL } from '@env';
import { PCO_CLIENT_ID } from '@env';
import { PCO_CLIENT_SECRET } from '@env';
import { PCO_ACCESS_TOKEN_URI } from '@env';

export default function App() {
  const [PCOCode, setPCOCode] = useState(null);
  const [accessToken, setAccesstoken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  handlePCOLogin = async () => {
    let results = await AuthSession.startAsync({
      authUrl: PCO_AUTH_URL,
    });

    setPCOCode(results.params.code);
  };

  const getAccessToken = () => {
    //POST json
    var dataToSend = {
      grant_type: 'authorization_code',
      code: `${PCOCode}`,
      client_id: PCO_CLIENT_ID,
      client_secret: PCO_CLIENT_SECRET,
      redirect_uri: PCO_REDIRECT_URI,
    };
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //POST request
    fetch(PCO_ACCESS_TOKEN_URI, {
      method: 'POST', //Request Type
      body: formBody, //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        setAccesstoken(responseJson.access_token);
        setRefreshToken(responseJson.refresh_token);
        setIsLogin(true);
        alert(JSON.stringify(responseJson));
        console.log(responseJson);
      })
      //If response is not in json then in error
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
  };

  const getUserInfo = () => {
    fetch('https://api.planningcenteronline.com/people/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        setUserInfo(responseJson.data);
        alert(JSON.stringify(responseJson));
        console.log(responseJson);
      })
      //If response is not in json then in error
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
  };

  handlePCOLogout = () => {
    setIsLogin(false);
    setPCOCode(null);
    setAccesstoken(null);
    setUserInfo(null);
  };

  useEffect(() => {
    if (PCOCode && !accessToken) {
      getAccessToken();
    }
  }, [PCOCode, accessToken]);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <TouchableOpacity onPress={getUserInfo} style={styles.mainButton}>
            <Text style={{ fontSize: 20, color: '#fff' }}>Log User Info</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePCOLogout} style={styles.mainButton}>
            <Text style={{ fontSize: 20, color: '#fff' }}>Log Out!</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Lightning CheckIn</Text>

          <TouchableOpacity onPress={handlePCOLogin} style={styles.mainButton}>
            <Text style={{ fontSize: 20, color: '#fff' }}>Log In with PCO</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
