import React from 'react';
import { Helmet } from 'react-helmet';

import useMessages from 'hooks/useMessages';
import { useUser } from 'hooks/useUsers';

export default function HelmetWrapper({ isIncomingCall, callerId }) {
  // TODO
  const [
    {
      unseenMessagesState: { total },
    },
  ] = useMessages({}, { forceFetchingUnseenMessages: true });
  const [{ user: caller }] = useUser(callerId);

  if (total) {
    return (
      <Helmet>
        <title>{`Alorice (${total})`}</title>
      </Helmet>
    );
  }

  if (isIncomingCall) {
    return (
      <Helmet>
        <title>{`${caller.name || caller.userName} is calling...`}</title>
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title> Alorice</title>
    </Helmet>
  );
}
