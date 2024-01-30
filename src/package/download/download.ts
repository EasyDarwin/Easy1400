import iconv from 'iconv-lite';
/**
 * 文件流下载
 * @param data 文件数据
 * @param filename 文件名称
 * @param mime 媒体文件类型
 * */

export function downloadByData(data:any, filename:string, mime:any) {
    const encoder = iconv.encode(data,'GBK');
    download(encoder,filename,'text/plain; charset=gbk')
}


/**
 * 文件流下载
 * @param data 文件数据
 * @param filename 文件名称
 * @param mime 媒体文件类型
 * @param bom 字节顺序 可选
 * */
export function download(data:any, filename:string, mime?:string,bom?:any) {
    const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
    const blob = new Blob(blobData, {type: mime || 'application/octet-stream'})

    const blobURL = window.URL.createObjectURL(blob)
    const downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = blobURL
    downloadElement.setAttribute('download', filename)
    if (typeof downloadElement.download === 'undefined') {
        downloadElement.setAttribute('target', '_blank')
    }
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(blobURL)
}
