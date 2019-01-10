import request from '@/utils/request'

export function carList(query) {
  return request({
    url: '/ads-op/car',
    method: 'get',
    params: query
  })
}

export function getCitys(query) {
  return request({
    url: '/ads-op/car/cities',
    method: 'get',
    params: query
  })
}

export function getAds(query) {
  return request({
    url: '/ads-op/car/ads',
    method: 'get',
    params: query
  })
}

export function deleteCar(data) {
  return request({
    url: '/ads-op/car',
    method: 'delete',
    data
  })
}


export function addCar(data) {
  return request({
    url: '/ads-op/car',
    method: 'put',
    data
  })
}

export function updateCar(data) {
  return request({
    url: '/ads-op/car',
    method: 'post',
    data
  })
}
