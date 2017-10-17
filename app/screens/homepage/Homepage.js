// @flow

import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { graphql } from 'react-relay';

import BookingsListContainer from './BookingsListContainer';
import SearchForm from './SearchForm';
import SimpleLoading from '../../components/visual/loaders/SimpleLoading';
import PrivateApiRenderer from '../../components/relay/PrivateApiRenderer';
import SingleLoginForm from './SimpleLoginForm';
import LoginMutation from './mutation/Login';

import type { Navigation } from '../../types/Navigation';

type Props = {
  navigation: Navigation,
};

type State = {
  accessToken: null | string,
};

export default class Homepage extends React.PureComponent<Props, State> {
  state = {
    accessToken: null,
  };

  static navigationOptions = {
    title: 'Welcome traveler!',
  };

  render = () => {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <SearchForm
          onSend={(from, to, date) =>
            navigate('SearchResults', {
              from,
              to,
              date,
            })}
        />
        {this.state.accessToken ? (
          <PrivateApiRenderer
            accessToken={this.state.accessToken}
            query={AllBookingsQuery}
            render={({ error, props }) => {
              // FIXME: it does not catch errors?
              if (error) {
                return <Text>{error.message}</Text>;
              } else if (props) {
                return (
                  <BookingsListContainer
                    bookings={props}
                    navigation={this.props.navigation}
                  />
                );
              }
              return <SimpleLoading />;
            }}
            cacheConfig={{
              offline: true,
            }}
          />
        ) : (
          <View>
            <Text>Login to see your bookings offline:</Text>
            <SingleLoginForm
              onSend={(username, password) => {
                LoginMutation(username, password, response => {
                  this.setState({
                    accessToken: response.login && response.login.token,
                  });
                });
              }}
            />
          </View>
        )}
      </ScrollView>
    );
  };
}

const AllBookingsQuery = graphql`
  query HomepageQuery {
    ...BookingsListContainer_bookings
  }
`;
