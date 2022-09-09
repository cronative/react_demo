import * as React from 'react';
import {StackActions} from '@react-navigation/native';
export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function dispatch(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.replace(...args));
  }
}
export function goBack() {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.goBack();
  }
}
export function replace(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.replace(name, params);
  }
}

export function reset(args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.reset(args);
  }
}
