import Document, {Html, Head, Main, NextScript} from 'next/document'
import { client } from '../utils/sanityClient'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return client.fetch(`
        *[_type == "site-config"] {
            lang
        }`
    ).then(res => {
        return {...initialProps, lang: res[0].lang}
    })
  }

  render() {
    return (
      <Html lang={this.props.lang || 'en'}>
        <Head />
        <body id='root'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}