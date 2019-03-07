// @flow strict

/* eslint-disable import/order */

import * as React from 'react';
import CodePush from 'react-native-code-push';

// Config
import { DEPLOYMENT_KEY, codePushOptions } from '../config/codePushConfig';
import {
  type AncillaryDefinition,
  ancillariesDefinitions,
} from '../config/ancillariesDefinitions';

// Services
import createRequester from '../services/createRequester';

// Components
import NoAncillaryMessage from '../components/NoAncillaryMessage';

type Props = {|
  +service: string,
  +token: string,
  +bookingId: number,
|};

class AncillaryFactory extends React.Component<Props> {
  componentDidMount() {
    CodePush.sync({
      deploymentKey: DEPLOYMENT_KEY,
      updateDialog: false,
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
  }

  getRequestedAncillary() {
    const { service } = this.props;

    const ancillary: AncillaryDefinition =
      ancillariesDefinitions[service.toUpperCase()];

    if (ancillary && typeof ancillary.renderComponent === 'function') {
      return ancillary.renderComponent;
    }

    return null;
  }

  render() {
    const { token, bookingId } = this.props;

    const ancillaryProps = {
      bookingId,
      requester: createRequester(token),
    };

    const Component = this.getRequestedAncillary() || NoAncillaryMessage;

    return <Component {...ancillaryProps} />;
  }
}

export default CodePush(codePushOptions)(AncillaryFactory);