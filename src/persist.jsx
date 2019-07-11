import React, { Fragment } from "react";

import { PersistGate } from "redux-persist/integration/react";

export default ({ SSR, persistor, loading, children }) => (
  <Fragment>
    {SSR ? (
      children
    ) : (
      <PersistGate loading={loading} persistor={persistor}>
        {children}
      </PersistGate>
    )}
  </Fragment>
);