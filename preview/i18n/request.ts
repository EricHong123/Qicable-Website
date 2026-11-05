import { getRequestConfig } from "next-intl/server";
// Every static page supplies its locale explicitly to the provider.
export default getRequestConfig(async () => ({
  locale: "en",
  messages: {},
  timeZone: "Asia/Shanghai",
}));
