import { Stack } from "@mui/material";
import { Layout } from "../../hocs/Layout";

export const General = () => {
  return (
    <Layout partOfLayout={true}>
      <Stack direction={'row'} width={'100%'}>
      </Stack>
    </Layout>
  );
};

export default General;