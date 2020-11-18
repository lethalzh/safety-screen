/**
 * 响应对象
 */
class ResponseData {
    rc=null
    data=null
    pageNum=null
    pageSize=null
    pageCount=null
    totalCount=null
    orderBy=null
    desc=null

    constructor(rc, data, desc) {
        this.rc = rc
        this.data = data
        this.desc = desc
    }
}

export default ResponseData
