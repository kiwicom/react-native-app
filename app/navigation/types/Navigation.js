// @flow

type NavigationStateParameters = Object;

// FIXME: this is related to the packages and not navigation
type CoreStackNavigatorRouteNames =
  | 'Homepage'
  | 'HotelsPackage'
  | 'SingleHotelPackage'
  | 'MMBPackage';

type HotelsStackNavigatorNames =
  | 'AllHotelsMap'
  | 'GalleryGrid'
  | 'GalleryStripe'
  | 'Payment'
  | 'SingleHotel'
  | 'SingleHotelMap'
  | 'LocationPicker'
  | 'GuestsModal';

type MMBStackNavigatorNames =
  | 'mmb.other.open'
  | 'mmb.other.refund'
  | 'DetailScreen';

type HomepageStackNavigatorRouteNames = 'Home';
type PlaygroundNavigationRouteNames = 'Playground';

type RouteNames =
  | CoreStackNavigatorRouteNames
  | HotelsStackNavigatorNames
  | MMBStackNavigatorNames
  | HomepageStackNavigatorRouteNames
  | PlaygroundNavigationRouteNames;

/**
 * @see https://reactnavigation.org/docs/navigators/navigation-prop
 */
export type Navigation = {
  navigate: ({
    routeName: RouteNames,
    key: string, // should be unique
    params?: NavigationStateParameters,
  }) => void,
  state: {
    params: NavigationStateParameters,
  },
  setParams: (newParameters: NavigationStateParameters) => void,
  goBack: (key?: string | null) => void,
};
