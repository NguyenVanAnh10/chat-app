import React, { useEffect, useState } from 'react';
import { NimblePicker } from 'emoji-mart';

const EmojiPicker = props => {
  const [data, setData] = useState();
  useEffect(() => {
    import('./data/google.json').then(d => {
      setData(d.default);
    });
  }, []);
  if (!data) return null;
  return <NimblePicker set="google" data={data} {...props} />;
};

export default EmojiPicker;
