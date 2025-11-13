// pages/_app.js
import "../styles/globals.css";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
