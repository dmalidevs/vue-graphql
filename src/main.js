import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'

function getHeaders() {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
        headers.authorization = `Bearer ${token}`;
    }
    return headers;
}
// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://laravel-graphql.test/graphql',
    headers: getHeaders(),
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})
const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(apolloProvider) 
app.mount('#app')
