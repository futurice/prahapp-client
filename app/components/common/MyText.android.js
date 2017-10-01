import React from 'react';
import { Text } from 'react-native';

const MyText = ({ children, style, ...props }) => (
  <Text style={[{ fontFamily: 'Futurice_regular' }, style]} {...props} >
    {children}
  </Text>
);

export default MyText;
