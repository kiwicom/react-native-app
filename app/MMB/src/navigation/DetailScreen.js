// @flow

import * as React from 'react';
import { HeaderTitle, type NavigationType } from '@kiwicom/mobile-navigation';
import {
  AdaptableLayout,
  LayoutDoubleColumn,
  StyleSheet,
} from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import { View } from 'react-native';

import DetailShareButton from './DetailShareButton';
import MainMenuContainer from '../MainMenuContainer';
import HelpSubmenu, { HelpSubmenuItems } from '../scenes/help/HelpContainer';
import OtherSubmenu, { OtherSubmenuItems } from '../scenes/Other';
import TicketScene, {
  TicketSceneSubMenus,
} from '../scenes/tickets/TicketScene';
import TicketDeleteButton from '../scenes/tickets/TicketDeleteButton';
import FlightServices, {
  FlightServicesSubmenuItems,
} from '../scenes/flightServices/FlightServices';
import TripServices, {
  TripServicesSubmenuItems,
} from '../scenes/tripServices/TripServices';
import PassengerDetailContainer from '../scenes/passenger/PassengerDetailContainer';
import TripOverviewTablet from '../scenes/tripOverview/TripOverviewTablet';
import Timeline, { TimelineSubmenuItems } from '../scenes/timeline/Timeline';
import { withSplitNavigationContext } from '../context/SplitNavigationContext';

export const MenuComponents = {
  'mmb.trip_overview': {
    screen: TripOverviewTablet,
  },
  'mmb.passenger_detail': {
    screen: PassengerDetailContainer,
    headerTitle: function PassengerDetailHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.title.passengers" />
        </HeaderTitle>
      );
    },
  },
  'mmb.flight_services': {
    screen: FlightServices,
    headerTitle: function FlightServicesHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.flight_services.title" />
        </HeaderTitle>
      );
    },
  },
  'mmb.trip_services': {
    screen: TripServices,
    headerTitle: function TripServicesHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.trip_services.title" />
        </HeaderTitle>
      );
    },
  },
  'mmb.help': {
    screen: HelpSubmenu,
    headerTitle: function HelpSubmenuHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.sub_menu.help.title" />
        </HeaderTitle>
      );
    },
  },
  'mmb.other': {
    screen: OtherSubmenu,
    headerTitle: function OtherSubmenuHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.sub_menu.manage.other.title" />
        </HeaderTitle>
      );
    },
  },
  'mmb.tickets': {
    screen: TicketScene,
    headerTitle: function TicketsSubmenuHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.menu.my_tickets" />
        </HeaderTitle>
      );
    },
    headerRight: <TicketDeleteButton />,
  },
  'mmb.timeline': {
    screen: Timeline,
    headerTitle: function TimelineSubmenuHeaderTitle() {
      return (
        <HeaderTitle>
          <Translation id="mmb.menu.timeline" />
        </HeaderTitle>
      );
    },
  },
  ...FlightServicesSubmenuItems,
  ...TripServicesSubmenuItems,
  ...HelpSubmenuItems,
  ...OtherSubmenuItems,
  ...TicketSceneSubMenus,
  ...TimelineSubmenuItems,
};

type Props = {|
  +navigation: NavigationType,
  +activeId: string,
  +setActiveId: (activeId: string) => void,
|};

class DetailsScreen extends React.Component<Props> {
  static navigationOptions = (props: {| navigation: NavigationType |}) => {
    const params = props.navigation.state.params;
    const title = (
      <HeaderTitle>
        <Translation id="mmb.main_menu.title" />
      </HeaderTitle>
    );
    const shareButton = <DetailShareButton />;

    if (params && params.activeContainerComponent) {
      const Title = MenuComponents[params.activeContainerComponent].headerTitle;
      const headerRight =
        MenuComponents[params.activeContainerComponent].headerRight;
      return {
        headerTitle: Title || title,
        headerRight: (
          <View style={styles.row}>
            {headerRight}
            {shareButton}
          </View>
        ),
      };
    }

    return {
      headerTitle: title,
      headerRight: shareButton,
    };
  };

  /**
   * Do proper navigation transition on mobile (narrow) devices.
   */
  openMenuOnMobile = (key: string) => {
    // $FlowExpectedError: Flow type for this navigation seems to be quite challenging. I am skipping it on purpose.
    this.props.navigation.navigate({
      routeName: key,
      key: `key-${key}`,
    });
  };
  /**
   * Just change container content for tablets. It's also necessary to change
   * the header title.
   */
  changeContentOnTablet = (key: string) => {
    this.props.navigation.setParams({ activeContainerComponent: key });
    this.props.setActiveId(key);
  };

  getContainerComponent = (key: string) => {
    return MenuComponents[key];
  };

  render = () => {
    const ContainerComponent = this.getContainerComponent(this.props.activeId)
      .screen;

    return (
      <LayoutDoubleColumn
        menuComponent={
          <AdaptableLayout
            renderOnWide={
              <MainMenuContainer openMenu={this.changeContentOnTablet} />
            }
            renderOnNarrow={
              <MainMenuContainer openMenu={this.openMenuOnMobile} />
            }
          />
        }
        containerComponent={
          <ContainerComponent navigation={this.props.navigation} />
        }
      />
    );
  };
}

export default withSplitNavigationContext(DetailsScreen);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
