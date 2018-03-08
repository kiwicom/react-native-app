// @flow

import * as React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Text from '../Text';
import TouchableItem from '../TouchableItem';

jest.mock('TouchableNativeFeedback', () => {
  const mock = jest.genMockFromModule('TouchableNativeFeedback');
  mock.canUseNativeForeground = () => true;
  mock.Ripple = jest.fn();
  return mock;
});
jest.mock('Platform', () => ({
  OS: 'android',
  Version: 22,
}));

const renderer = new ShallowRenderer();

describe('TouchableItem with ripple effect', () => {
  it('renders with foreground', () => {
    expect(
      renderer.render(
        <TouchableItem>
          <Text>line</Text>
        </TouchableItem>,
      ),
    ).toMatchSnapshot();
  });

  it('renders with ripple color', () => {
    expect(
      renderer.render(
        <TouchableItem rippleColor="red">
          <Text>line</Text>
        </TouchableItem>,
      ),
    ).toMatchSnapshot();
  });

  it('disables foreground in borderless mode', () => {
    expect(
      renderer.render(
        <TouchableItem borderlessRipple={true}>
          <Text>line</Text>
        </TouchableItem>,
      ),
    ).toMatchSnapshot();
  });
});
