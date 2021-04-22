import request from "@/utils/request";

export function findPage(query) {
  return request({
   
    url: "/ovu-university/university/complaints/page",
    method: "get",
    params: query
  });
}

export function replay(query) {
  return request({
    url: "/ovu-university/university/reply/insert",
    method: "get",
    params: query
  });
}

export function findDetail(id) {
  return request({
    url: `/ovu-university/university/complaints/detail?complaintsId=${id}`,
    method: "get"
  });
}

