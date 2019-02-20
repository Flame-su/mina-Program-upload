// pages/list/list.js
var utils = require('../../utils/util');
var config = require('../../config');
var xmcloud = require('../../vendor/xmcloud/index');
var qiniuUploader = require('../../vendor/qiniuUploader');

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 
    uptokenURL: 'https://www-tmp.xiongmaopeilian.com/api/qiniu/token',
    domain: 'http://app-img-tmp.xiongmaopeilian.com/',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}


Page({
  data: {
    listInfo:'未获取'
  },
  onLoad: function (options) {
    // this.getCourseList();
  },
  getCourseList: function(){
    utils.showBusy('请求中……');
    var that = this;
    var options = {
      url: config.service.courseList,
      success(response){
        console.log(url)
        var result = response.data;
        utils.showSuccess('请求成功完成');
        if(result.errors != undefined && result.errors.length > 0 || result.needBind){
          wx.redirectTo({
            url: '/pages/bind/bind',
          });
          return;
        }
      },
      fail(error){
        utils.showModel('请求失败', error);
        wx.redirectTo({
          url: '/pages/bind/bind',
        });
      }
    };
    xmcloud.request(options);
  
  },
  upload: function(){
    var that = this;
     initQiniu();
     wx.chooseImage({
       count: 3,
       success: function (res) {
         console.log(res)
         var filePath = res.tempFilePaths[0];
         var timestamp = Date.parse(new Date());
         //          console.log(file.name)
  
         // 交给七牛上传
         qiniuUploader.upload(filePath, (res) => {
           console.log(res.imageURL)
         }, (error) => {
           console.error('error: ' + JSON.stringify(error));
         },{
           region: 'ECN',
           shouldUseQiniuFileName: false,
           key: 'aaa/'+timestamp  
         },
           // , {
           //     region: 'NCN', // 华北区
           //     uptokenURL: 'https://[yourserver.com]/api/uptoken',
           //     domain: 'http://[yourBucketId].bkt.clouddn.com',
           //     shouldUseQiniuFileName: false
           //     key: 'testKeyNameLSAKDKASJDHKAS'
           //     uptokenURL: 'myServer.com/api/uptoken'
           // }
           // null,// 可以使用上述参数，或者使用 null 作为参数占位符
           (progress) => {
             console.log('上传进度', progress.progress)
             console.log('已经上传的数据长度', progress.totalBytesSent)
             console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
         }, (cancelTask)=>{

         }
         );
       }
     })
  }
})