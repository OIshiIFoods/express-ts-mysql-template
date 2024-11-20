/** node 第三方库利用 require 引入 */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

/** ts 文件利用 import 引入 */
import { Request, Response, NextFunction } from 'express'
import indexRouter from './routes/index'
import usersRouter from './routes/users'

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
app.use(express.urlencoded({ extended: false }))

/** 部署静态资源 */
app.use(express.static(path.join(__dirname, 'public')))

/** 匹对路由 */
app.use('/', indexRouter)
app.use('/users', usersRouter)

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
