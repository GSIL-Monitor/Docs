const supertest = require('supertest-as-promised')

jest.unmock('request')

describe('个人主页', () => {
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

  it('没有提供uid', async() => {
    await request()
      .get('/app/home')
      .expect(200)
      .then(res => {
          expect(res.text.includes('接口异常')).toBe(true)
      })
  })

  it('提供正常uid', async() => {
    await request()
      .get('/app/home?uid=111')
      .expect(200)
      .expect('Content-Type', /html/)
  })
})
