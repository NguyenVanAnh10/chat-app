import React, { lazy, Suspense } from "react";

const NimblePicker = lazy(() => import("./EmojiPicker"));

const EmojiPickerLazy = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NimblePicker {...props} />
    </Suspense>
  );
};

export default EmojiPickerLazy;
