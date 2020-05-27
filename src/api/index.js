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
const changePwd = (pwd) => {
  const url = '/api/teacher/changePassword'
  return request({
    method: 'post',
    url,
    data: {
      pwd: md5(pwd)
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

const removePractice = (id) => {
  const url = `/api/teacher/practice/${id}`
  return request({
    method: 'delete',
    url
  })
}

const changePractice = (id, data) => {
  const url = `/api/teacher/practice/${id}`
  return request({
    method: 'put',
    url,
    data
  })
}

const getExamByClassIds = (data) => {
  const url = `/api/teacher/exam`
  return request({
    method: 'post',
    url,
    data
  })
}

const removeExam = (id) => {
  const url = `/api/teacher/exam/${id}`
  return request({
    method: 'delete',
    url
  })
}

const changeExam = (data) => {
  const url = `/api/teacher/changeExam`
  return request({
    method: 'post',
    url,
    data
  })
}

const getScore = (data) => {
  const url = `/api/teacher/score`
  return request({
    method: 'post',
    url,
    data
  })
}

const removeScore = ({ examId, studentId }) => {
  const url = `/api/teacher/score/${studentId}/${examId}`
  return request({
    method: 'delete',
    url
  })
}

const changeScore = ({ examId, studentId, score }) => {
  const url = `/api/teacher/score/${studentId}/${examId}`
  return request({
    method: 'put',
    url,
    data: {
      score
    }
  })
}

const getSubjectByProfessionIds = ({ ids, page, pageSize }) => {
  const url = `/api/teacher/subject?ids=${ids}&page=${page}&pageSize=${pageSize}`
  return request({
    method: 'get',
    url,
    data: {
      ids, page, pageSize
    }
  })
}

const addSubject = ({ name, professionIds }) => {
  const url = `/api/teacher/subject`
  return request({
    method: 'post',
    url,
    data: {
      name, professionIds
    }
  })
}

const removeSubject = (id) => {
  const url = `/api/teacher/subject/${id}`
  return request({
    method: 'delete',
    url
  })
}

const changeSubject = (id, data) => {
  const url = `/api/teacher/subject/${id}`
  return request({
    method: 'put',
    url,
    data
  })
}

const getProfessions = () => {
  const url = `/api/teacher/profession`
  return request({ url })
}

const getExamInfoById = (id) => {
  const url = `/api/teacher/exam/${id}`
  return request({ url })
}

export default {
  login,
  changePwd,
  isLogin,
  logOut,
  getClassTree,
  getStudentByClassId,
  removeStudent,
  changeStudent,
  getSubjects,
  getPracticeBySubjectId,
  removePractice,
  changePractice,
  getExamByClassIds,
  removeExam,
  changeExam,
  getScore,
  removeScore,
  changeScore,
  getSubjectByProfessionIds,
  getProfessions,
  addSubject,
  removeSubject,
  changeSubject,
  getExamInfoById
}
