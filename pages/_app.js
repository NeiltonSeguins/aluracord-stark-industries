function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: "Open Sans", sans-serif;
      }
      /* App fit Height */
      html,
      body,
      #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */

      /* width */
      ::-webkit-scrollbar {
        width: 3px;
      }
      /* Track */
      ::-webkit-scrollbar-track {
        background: #181f25;
      }
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #52667A;
        transition: 1s ease all;
      }
    `}</style>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
