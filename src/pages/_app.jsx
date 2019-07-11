import React from "react";
import { Provider } from "react-redux";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import createStore from "store";
import Layout from "scenes/Layout";

import "styles/index.scss";

import parser from "ua-parser-js";

import { persistStore } from "redux-persist";
import PersistGate from "../persist";

import { Router } from "routes";
import { SecodaryMedia } from "mediaMatch";

import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", url => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", url => {
  NProgress.done();
});
Router.events.on("routeChangeError", url => {
  NProgress.done();
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = null;
    let user_agent = null;

    if (typeof window === "undefined") {
      user_agent = parser(ctx.req.headers["user-agent"]);
    }

    if (Component.getInitialProps) {
      // getInitial props dispatch must be after all  _app global actions
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps,
      user_agent,
      query: ctx.query
    };
  }
  componentDidMount() {
    //
    // PREFETCH ALL PAGES, refactor to unique Link-Page model if it make sense
    // *FIX bug with navigation crash
    //
    Router.prefetch("/index");
  }

  render() {
    const { Component, pageProps, store, user_agent, query } = this.props;
    const SSR = typeof window === "undefined";
    return (
      <Container>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)} SSR={SSR}>
            <SecodaryMedia.Provider>
              <SecodaryMedia.ServerRender
                predicted={(user_agent && user_agent.device.type) || "desktop"}
                hydrated
              >
                <Layout query={query}>
                  <Component {...pageProps} />
                </Layout>
              </SecodaryMedia.ServerRender>
            </SecodaryMedia.Provider>
          </PersistGate>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(createStore)(withReduxSaga({ async: true })(MyApp));
