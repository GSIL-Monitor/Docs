const supertest = require('supertest-as-promised')

describe('server', () => {
  let app, server

  beforeEach(() => {
    app = require('server')

    // 禁用 koa-logger 日志输出
    app.log.level('fatal')
  })

  afterEach(() => {
    if (server) {
      server.close()
    }

    app = null
    server = null
  })

  const request = function () {
    if (!server) {
      server = app.listen(0)
    }

    return supertest(server)
  }

  it('启动正常', async() => {
    expect(request).not.toThrow()
  })

  it('/ 返回 404', async() => {
    request().get('/').expect(404)
  })

  it('app 抛出异常处理', async() => {
    app.use(function *() {
      app.emit('error', new Error('app error'), this)

      this.body = 'ok'
    })

    await request().get('/throw-error').expect(200).then((res) => {
      expect(res.text).toBe('ok')
    })
  })
})
