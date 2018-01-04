// @flow

import { Map } from './../MapView';

const oldTown = {
  node: {
    id: '1',
    price: {},
    hotel: {
      coordinates: {
        lat: 50.08566,
        lng: 14.4195,
      },
    },
  },
};
const vysehrad = {
  node: {
    id: '1',
    price: {},
    hotel: {
      coordinates: {
        lat: 50.06,
        lng: 14.42,
      },
    },
  },
};
const ruzyne = {
  node: {
    id: '1',
    price: {},
    hotel: {
      coordinates: {
        lat: 50.08,
        lng: 14.30083,
      },
    },
  },
};
const andel = {
  node: {
    id: '1',
    price: {},
    hotel: {
      coordinates: {
        lat: 50.06841,
        lng: 14.40445,
      },
    },
  },
};

describe('MapView', () => {
  it('returns basic region zoomed on single result', () => {
    const component = new Map({
      onSelectMarker: jest.fn(),
      selectedIndex: 0,
      data: [oldTown],
    });
    expect(component.state.region).toEqual({
      latitude: 50.08566,
      longitude: 14.4195,
      longitudeDelta: 0.005,
      latitudeDelta: 0.005,
    });
  });

  it('returns region with size of the area between for two coords', () => {
    const component = new Map({
      onSelectMarker: jest.fn(),
      selectedIndex: 0,
      data: [oldTown, vysehrad],
    });
    expect(component.state.region).toEqual({
      latitude: 50.08566,
      longitude: 14.4195,
      latitudeDelta: 0.02565999999999491, // distance between oldTown and vysehrad
      longitudeDelta: 0.0005000000000006111,
    });
  });

  it('excludes extremes from region to avoid ugly heap of markers', () => {
    // ruzyne is excluded from region calculation as extreme
    const component = new Map({
      onSelectMarker: jest.fn(),
      selectedIndex: 0,
      data: [oldTown, vysehrad, ruzyne, andel],
    });
    expect(component.state.region).toEqual({
      latitude: 50.08566,
      longitude: 14.4195,
      latitudeDelta: 0.02565999999999491, // distance between oldTown and vysehrad
      longitudeDelta: 0.015549999999999287, // distance between vysehrad and andel
    });
  });
});
