// @flow strict

import * as React from 'react';
import { View } from 'react-native';
import { createFragmentContainer, graphql } from '@kiwicom/mobile-relay';
import {
  withNavigation,
  type NavigationType,
} from '@kiwicom/mobile-navigation';
import {
  TouchableWithoutFeedback,
  Dimensions,
  Device,
} from '@kiwicom/mobile-shared';

import { type RoomConfigurationType } from '../../HotelsContext';
import SingleHotelContext from '../../navigation/singleHotel/SingleHotelContext';
import HotelDetailPreview from '../hotelDetailPreview/HotelDetailPreview';
import type { HotelSwipeItem as HotelSwipeItemData } from './__generated__/HotelSwipeItem.graphql';

type PropsWithContext = {|
  ...Props,
  +deviceWidth: number,
  +setHotelId: (hotelId: string) => void,
  +hotelId: string,
  +checkin: Date,
  +checkout: Date,
  +roomsConfiguration: RoomConfigurationType,
|};

export class HotelSwipeItemWithContext extends React.Component<
  PropsWithContext,
> {
  openSingleHotel = (hotelId: string) => {
    this.props.setHotelId(hotelId);
    this.props.navigation.navigate('SingleHotel', {
      hotelId,
      checkin: this.props.checkin,
      checkout: this.props.checkout,
      roomsConfiguration: this.props.roomsConfiguration,
    });
  };

  isNarrowLayout = () => {
    return this.props.deviceWidth < Device.DEVICE_THRESHOLD;
  };

  handlePress = () => {
    const { data } = this.props;
    const id = data?.hotelId;

    if (id != null) {
      this.isNarrowLayout()
        ? this.openSingleHotel(id)
        : this.props.setHotelId(id);
    }
  };

  render = () => {
    const { width, data } = this.props;
    const name = data?.name;
    const price = data?.price;
    const thumbnailUrl = data?.mainPhoto?.thumbnailUrl;
    const stars = data?.rating?.stars;
    const score = data?.review?.score;
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={{ width }}>
          <HotelDetailPreview
            name={name}
            price={price}
            thumbnailUrl={thumbnailUrl}
            stars={stars}
            score={score}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

type Props = {|
  +width: number,
  +navigation: NavigationType,
  +data: ?HotelSwipeItemData,
|};

class HotelSwipeItem extends React.Component<Props> {
  renderDimensions = ({ width }) => (
    <SingleHotelContext.Consumer>
      {this.renderSingleHotelContext(width)}
    </SingleHotelContext.Consumer>
  );

  renderSingleHotelContext = (width: number) => ({
    setHotelId,
    hotelId,
    checkin,
    checkout,
    roomsConfiguration,
  }) => (
    <HotelSwipeItemWithContext
      {...this.props}
      setHotelId={setHotelId}
      hotelId={hotelId}
      checkin={checkin}
      checkout={checkout}
      roomsConfiguration={roomsConfiguration}
      deviceWidth={width}
    />
  );

  render() {
    return <Dimensions.Consumer>{this.renderDimensions}</Dimensions.Consumer>;
  }
}

export default createFragmentContainer(
  withNavigation(HotelSwipeItem),
  graphql`
    fragment HotelSwipeItem on AllHotelsInterface {
      hotelId
      name
      price {
        currency
        amount
      }
      mainPhoto {
        thumbnailUrl
      }
      rating {
        stars
      }
      review {
        score
      }
    }
  `,
);
