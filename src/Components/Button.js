import React, {memo} from 'react';

import {Pressable, Text} from 'react-native';

const Button = memo(({onPress, Title, style, styleTxt}) => {
  return (
    <Pressable onPress={onPress} style={style}>
      <Text style={styleTxt}>{Title}</Text>
    </Pressable>
  );
});

export {Button};
