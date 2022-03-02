import Head from "next/head";
import "antd/dist/antd.css";
export default function Template(props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      {props.children}
    </>
  );
}
