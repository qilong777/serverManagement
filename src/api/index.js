import { request } from '@/network'
import md5 from 'md5'

// 账号登录接口
const login = ({ id, password, verify }) => {
  const url = '/api/teacher/login'
  return request({
    method: 'post',
    url,
    data: {
      id,
      password: md5(password),
      verify
    }
  })
}

// 修改密码
const changePassword = ({ email, code, password }) => {
  const url = '/api/teacher/changePassword'
  return request({
    method: 'post',
    url,
    data: {
      email,
      code,
      password: md5(password)
    }
  })
}

// 判断用户是否登录
const isLogin = () => {
  const url = `/api/teacher/isLogined`
  return request({ url })
}

// 退出登录
const logOut = () => {
  const url = `/api/teacher/logout`
  return request({ url })
}

const getClassTree = () => {
  const url = `/api/teacher/getClassTree`
  return request({ url })
}

const getStudentByClassId = (data) => {
  const url = `/api/teacher/student`
  return request({
    method: 'post',
    url,
    data
  })
}

const removeStudent = (id) => {
  const url = `/api/teacher/student/${id}`
  return request({
    method: 'delete',
    url
  })
}

const changeStudent = ({ id, name, classId, sex }) => {
  const url = `/api/teacher/student/${id}`
  return request({
    method: 'put',
    url,
    data: {
      name, classId, sex
    }
  })
}
const getSubjects = () => {
  const url = `/api/teacher/getSubjects`
  return request({ url })
}

const getPracticeBySubjectId = (data) => {
  const url = `/api/teacher/practice`
  return request({
    method: 'post',
    url,
    data
  })
}
export default {
  login,
  changePassword,
  isLogin,
  logOut,
  getClassTree,
  getStudentByClassId,
  removeStudent,
  changeStudent,
  getSubjects,
  getPracticeBySubjectId
}
