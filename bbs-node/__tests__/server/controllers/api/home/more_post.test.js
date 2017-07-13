const supertest = require('supertest-as-promised')

jest.unmock('request')

describe('个人首页接口', () => {
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

  it('传递时间戳', async() => {
    await request()
      .get('/app/api/home/more_post?lastPostTime=33333333333')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('未传递时间戳', async() => {
    await request()
      .get('/app/api/home/more_post')
      .expect(200)
      .then((res) => {
          expect(res.text.includes('接口异常')).toBe(true)
      })
  })

})
