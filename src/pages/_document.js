import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/images/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="/sidebar-fix.js" defer></script>
      </body>
    </Html>
  );
}
