import request from '@/utils/request'

export function addGameRelation(data) {
  return request({
    url: `/autismAPI/gameRelation/addGameRelation`,
    method: 'post',
    data
  })
}

export function delGameRelation(data) {
  return request({
    url: `/autismAPI/gameRelation/delGameRelation?uuid=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getGameRelation(data) {
  return request({
    url: `/autismAPI/gameRelation/getGameRelation`,
    method: 'get',
    params: data
  })
}

export function updateGameRelation(data) {
  return request({
    url: `/autismAPI/gameRelation/updateGameRelation`,
    method: 'put',
    data
  })
}

const GameLogAPI = {
  addGameRelation,
  delGameRelation,
  getGameRelation,
  updateGameRelation
}

export default GameLogAPI
