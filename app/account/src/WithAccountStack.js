// @flow strict

import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { StyleSheet } from '@kiwicom/mobile-shared';
import { DeviceInfo } from '@kiwicom/mobile-localization';
import { AppProvider, LayoutProvider } from '@kiwicom/account-native';

type Props = {|
  +onBackClicked: () => void,
  +token: string,
  +children: React.Node,
|};

export default function WithAccountStack(props: Props) {
  return (
    <View style={styles.container}>
      <AppProvider
        locale={DeviceInfo.getLanguage()}
        onBackPressed={props.onBackClicked}
        token={props.token}
      >
        <LayoutProvider>{props.children}</LayoutProvider>
      </AppProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    android: {
      paddingTop: StatusBar.currentHeight, // This was for some reason not added correctly by react-navigation 🤔
    },
  },
});