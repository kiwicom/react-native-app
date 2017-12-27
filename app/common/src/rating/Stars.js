// @flow

import * as React from 'react';
import { Text } from 'react-native';

type Props = {|
  // number of stars
  rating?: ?number,
|};

export default function Stars({ rating }: Props) {
  if (!rating) {
    console.warn(
      'Rating cannot be undefined in Stars component. This usually indicates GraphQL API failure.',
    );
  }
  return <Text>{'★'.repeat(rating || 0)}</Text>;
}
