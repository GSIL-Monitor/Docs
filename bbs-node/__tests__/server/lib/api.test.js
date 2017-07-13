describe('api', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('key值不能为空', async() => {
    const API = require('lib/api')()
    expect(API['']).toBeUndefined()
  })

  it('默认 development 开发环境', async() => {
    process.env.NODE_ENV = '';

    const API = require('lib/api')()
    expect(API['post/get_detail']).toMatch(/localhost/)
  })

  it('非 development 环境', async() => {
    process.env.NODE_ENV = 'test'
 
    const API = require('lib/api')()

    expect(API['post/get_detail']).toMatch(/test.wacai.info/)
  })

  it('指定 api 地址配置', async() => {
    process.env.NODE_ENV = 'test'

    const API = require('lib/api')()

    expect(API['recommend/get_banners']).toMatch(/test.wacai.info/)
  })
})