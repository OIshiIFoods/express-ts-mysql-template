const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const { expressjwt } = require('express-jwt')

import { Request, Response, NextFunction } from 'express'
import { getPublicKey } from './utils/key'

const app = express()

/** 配置模板引擎 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

/** 打印请求时的日志信息 */
app.use(logger('dev'))

/** 解析 cookie 数据解析为对象, 并将其存于 req.cookies 中 */
app.use(cookieParser())

/** 根据请求类型解析内容，并放到 req.body 中 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** 部署静态资源 */
app.use(express.static(path.join(__dirname, 'public')))

/** 引入session */
app.use(session({
  secret: '12958', // 服务器端生成session的签名
  name: "session_id", // 修改session对应的cookie的名称
  resave: false, // 强制保存 session ，即使它并没有变化
  saveUninitialized: true, // 强制将未初始化的session存储
  cookie: {
    maxAge: 1000 * 60 * 30, // 设置过期时间为 30 min
    secure: false // true 表示只有https协议才能访问cookie
  },
  rolling: true // 在每次请求时强行设置cookie，这将重置cookie的过期时间（默认值为false）, sessionid 无变化
}))

/** 引入 token 校验 */
app.use(
  expressjwt({
    secret: getPublicKey(), //解密秘钥 
    algorithms: ["RS256"],  //6.0.0以上版本必须设置解密算法 
    isRevoked: async (req, payload) => {
      // 获取 token 中的负载信息
      req.tokenInfo = payload.payload
    }
  }).unless({
    /** 设定不需要校验的 token 的api请求 */
    path: [
      { url: /^(\/api\/v1)\/oauth/ },
      { url: /^(\/api\/v1)\/user/ },
    ]
  }), (req, res, next) => {
    /** token 校验 */
    // 时间校验
    const { exp } = req.tokenInfo ?? {}
    if (Date.now() > exp * 1000) {
      res.json({
        status: 401,
        failed: true,
        message: '登录过期，请重新登录！',
      })
    } else {
      next()
    }
  }
)

/** 匹对路由 */


/** 应用级中间件, 未匹对到任何路由时 */
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

/** 错误处理中间件 */
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
