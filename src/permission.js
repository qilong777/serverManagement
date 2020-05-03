import router from './router'
import store from './store'
import api from 'api'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (to.path === '/login') {
    const res = await api.logOut()
    if (res.status === 1) {
      next()
    }
    NProgress.done()
    return
  }

  const res = await api.isLogin()
  if (res.status === 1) {
    const accessRoutes = await store.dispatch('permission/generateRoutes')

    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
    next()
  } else {
    Message.error(res.msg)
    next('/login')
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
