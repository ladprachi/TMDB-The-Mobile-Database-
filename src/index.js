import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals  
// reportWebVitals();



const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMjk4YmE4OC1kZDRlLTRiOTQtOTRiZi1kOTg0YWY5ZTkxZDEiLCJpYXQiOjE2ODMxMzA5MDEsImV4cCI6MTY4MzczNTcwMX0.LrINyCLGToqe8WCQoTR5W4sYxQYlFOQcZjSldbJFdqI"

  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
  });


// 2
const httpLink = createHttpLink({
  uri: 'https://tmdb-server-dev.logicwind.co/graphql'
});

// 3
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

//4
const container = document.getElementById('root'); 
const root = createRoot(container); 
root.render(
  <ApolloProvider client={client}>
  <App />
</ApolloProvider>,
);
