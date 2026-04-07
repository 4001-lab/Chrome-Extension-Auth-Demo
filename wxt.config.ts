import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'identity'],
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtMLtPabxfTYpukumq/WglkFKQlpQbMlJteDx1Z7VHHrgzvQxVKxnEIGSLulX+fpHQzJVPfIEKj4TmrNWWSR11YXmK0AusyAA1uQSl9W8iky8XOlWtxTxXEJa5VHBVvBQtEBipTMOYHtyivHsPogi2VWCwPplLlUuvYH47f3USjmsUpnFpNcf6QMfe11mw4OTocdsFrNPXtip9mtf81VVTsBJSkkBw9C4YAH9gf+A09kCwsG6ze1JvUoiJNycrOuyMdeMlBKkx/41KeVSijQCVymVTLbvho2mZC3TLFkePbaww57AjGNvWnzHZW9P5JBXLuZfP+V3AkKUdhSnHS5N0QIDAQAB',
  },
});

