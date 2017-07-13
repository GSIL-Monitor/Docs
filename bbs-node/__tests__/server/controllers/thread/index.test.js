const supertest = require('supertest-as-promised')

jest.unmock('request')

describe('帖子详情页面', () => {
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

  it('非客户端或H5访问跳转到PC', async() => {
    await request()
      .get('/app/thread?tid=1001')
      .set('user-agent', 'jest-test')
      .expect(302)
      .expect('Location', /thread-1001/)
  })

  it('挖财客户端访问', async() => {
    await request()
      .get('/app/thread?tid=1001')
      .set('user-agent', 'platform/70')
      .expect(200)
      .expect('Content-Type', /html/)

    // 百度爬虫正常访问
    await request()
      .get('/app/thread?tid=1001')
      .set('User-Agent', 'baiduspider')
      .expect(200)
      .expect('Content-Type', /html/)
  })

  it('H5 访问', async() => {
    await request()
      .get('/app/thread?tid=1001')
      .set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')
      .expect(200)
      .then((res) => {
          expect(res.text.includes('内容不存在')).toBe(true)
      })
  })
})
