import React from "react";
import {
  Content,
  ListItem,
  Left,
  Body,
  Right,
  Text,
  View,
  Title,
  Icon,
  Header,
  Separator,
  Button
} from "native-base";
import { Linking } from "react-native";
import Switch from "react-native-switch-pro";
import styles from "../Styles.js";
import Footer from "./Footer.js";






export default ({ store }) => {
  const logoutBtn = async () => {
    store.current.page = "locked";
  };
  

  return (
    <View style={styles.container}>
    <View style={styles.viewFlex}>
      <Header style={styles.mtAndroid}>
        <Left style={styles.viewFlex} />
        <Body style={styles.viewFlex}>
          <Title style={styles.titleBlack}>Settings</Title>
        </Body>
        <Right style={styles.viewFlex} />
      </Header>

      <Content>
        <Separator bordered>
          <Text>Get Help</Text>
        </Separator>
        <ListItem
          icon
           onPress={() => {
                Linking.openURL(`https://t.me/VelasDevelopers`);
              }}
          style={styles.heightListItem}
        >
          <Left>
            <Icon name="ios-text" />
          </Left>
          <Body style={styles.heightListItem}>
            <Text style={styles.numbersFaq1}>Support</Text>
          </Body>
          <Right style={styles.heightListItem}>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>

        <Separator bordered>
          <Text>Security</Text>
        </Separator>

        <ListItem icon style={styles.heightListItem} last onPress={logoutBtn}>
      <Left>
        <Icon name="ios-log-out" />
      </Left>
      <Body style={styles.heightListItem}>
        <Text style={styles.numbersFaq1}>Log Out</Text>
      </Body>
      <Right style={styles.heightListItem} />
    </ListItem>
      </Content>
    </View>
    <Footer store={store}></Footer>
    </View>
  );
};