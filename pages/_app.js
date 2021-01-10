import '../styles/globals.scss'
import { Provider } from 'next-auth/client'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}
      options={{ 
        clientMaxAge: 3600     // Re-fetch session if cache is older than hour
      }}
      >
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
