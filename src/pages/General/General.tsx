import { Button } from "@mui/material";
import { Layout } from "../../hocs/Layout";
import { Ws } from "../../hooks/useWs_API";
import { useEffect } from "react";

export const General = () => {
  const {messages, sendMessage} = Ws()

  useEffect(() => {
   console.log(messages);
  },[messages])

  return (
    <Layout>
      <h1>General</h1>
      <Button onClick={() => sendMessage(777)}>tk</Button>
      <p>{messages[messages.length - 1]?.message || ''}</p>
    </Layout>
  );
};

export default General;