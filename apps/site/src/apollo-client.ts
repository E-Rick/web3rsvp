import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/e-rick/cryptopia",
  cache: new InMemoryCache(),
});

export default client;