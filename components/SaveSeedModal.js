import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "react-native-gradient-buttons";
import { Container, Content, Icon, Button } from "native-base";
import { Image } from "react-native";
import styles from "../Styles.js";

export default ({ store }) => {
  const changePage = (tab, visible) => () => {
    store.tab = tab;
    store.footerVisible = visible;
  };
  const handleOpenModalPress = store => {
    return (
      <TouchableOpacity onPress={() => (store.seedModal = true)}>
        <Text style={styles.textLoginStyle}>CONTINUE</Text>
      </TouchableOpacity>
    );
  };
  const buttonPressLogout = store => {
    const onPress = () => {
      store.saveBtnSeed.pressing = true;
    };

    const logoutButton = store.saveBtnSeed.pressing
      ? store.saveBtnSeed.valueChange
      : store.saveBtnSeed.value;

    return (
      <GradientButton
        style={styles.gradientBtn2}
        text={"Confirm"}
        textStyle={{ fontSize: 18 }}
        gradientBegin="#74EBEE"
        gradientEnd="#009EFD"
        gradientDirection="diagonal"
        height={56}
        width={"100%"}
        radius={28}
        onPressAction={changePage("UniquePassword", false)}
      />
    );
  };

  const handleCloseModalPress = store => {
    return (
      <TouchableOpacity
        style={styles.btnClose}
        onPress={() => (store.seedModal = false)}
      >
        <Text style={styles.btnTextClose}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {handleOpenModalPress(store)}
      <Modal isVisible={store.seedModal} hasBackdrop={true}>
        <View style={styles.modalContent}>
          <Text style={styles.textSnackBar}>
            Please confirm that you stored this phrase in safe place?
          </Text>
          {buttonPressLogout(store)}
          {handleCloseModalPress(store)}
        </View>
      </Modal>
    </View>
  );
};