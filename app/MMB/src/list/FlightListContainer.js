// @flow

import * as React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import {
  Text,
  StyleSheet,
  Color,
  AdaptableLayout,
} from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import {
  graphql,
  createRefetchContainer,
  type RelayRefetchProp,
} from '@kiwicom/mobile-relay';

import FlightList from './FlightList';
import type { FlightListContainer_future as FutureFlightType } from './__generated__/FlightListContainer_future.graphql';
import type { FlightListContainer_past as PastFlightType } from './__generated__/FlightListContainer_past.graphql';

type Props = {|
  future: FutureFlightType,
  past: PastFlightType,
  relay: RelayRefetchProp,
|};

type State = {|
  isRefreshing: boolean,
|};

class FlightListContainer extends React.Component<Props, State> {
  state = {
    isRefreshing: false,
  };

  refetch = () => {
    this.setState({ isRefreshing: true });
    this.props.relay.refetch(null, null, () => {
      this.setState({ isRefreshing: false });
    });
  };

  render = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.refetch}
          />
        }
      >
        <Text style={styles.subtitle}>
          <Translation id="mmb.my_bookings.future_trips" />
        </Text>
        <AdaptableLayout.Consumer
          renderOnNarrow={<FlightList data={this.props.future} />}
          renderOnWide={
            <View style={styles.tabletWrapper}>
              <FlightList data={this.props.future} />
            </View>
          }
        />

        <Text style={styles.subtitle}>
          <Translation id="mmb.my_bookings.past_trips" />
        </Text>
        <AdaptableLayout.Consumer
          renderOnNarrow={<FlightList data={this.props.past} />}
          renderOnWide={
            <View style={styles.tabletWrapper}>
              <FlightList data={this.props.past} />
            </View>
          }
        />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 12,
    color: Color.textLight,
  },
  tabletWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default createRefetchContainer(
  FlightListContainer,
  graphql`
    fragment FlightListContainer_future on BookingConnection {
      ...FlightList
    }

    fragment FlightListContainer_past on BookingConnection {
      ...FlightList
    }
  `,
  graphql`
    query FlightListContainerQuery {
      future: allBookings(only: FUTURE) {
        ...FlightListContainer_future
      }
      past: allBookings(only: PAST) {
        ...FlightListContainer_past
      }
    }
  `,
);
