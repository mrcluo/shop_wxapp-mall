var home = require('../../api/home.js'); 
var entrance = require('../../api/entrance.js');     
Page({
    data: {
        category: [],
        detail:[],
        curIndex: 0,
        isScroll: true,
        toView: 'guowei',
        leftData:[],
        type:''
    },
    onLoad: function(option){
      console.log(option.id)
      if(option && option.id)
      {
        this.setData({type: option.id})
      }else{
        wx.showToast({
          title: '数据有误',
          duration: 2000
        })
        注意
      }
    },
    onReady(){
        let category1 = [
          {name:'果味',id:'guowei'},
          {name:'蔬菜',id:'shucai'},
          {name:'炒货',id:'chaohuo'},
          {name:'点心',id:'dianxin'},
          {name:'粗茶',id:'cucha'},
          {name:'淡饭',id:'danfan'}
        ]
        let category2 = [
          {name:'苹果',id:'entrance1'},
          {name:'梨子',id:'entrance2'},
          {name:'香蕉',id:'entrance3'}
        ]
        console.log(this.data.type)
        this.setData({
          category: this.data.type == 1 ? category1 : category2,
          detail: this.data.type == 1 ? home.data : entrance.data,
        })

        let that= this
        this.data.category.map((item,index)=>{
          var query = wx.createSelectorQuery();
          query.select('#' + item.id).boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec(function (res) {
            if(res[0] && res[0]['top'] >= 0)
            {
              let data = {
                scrollTop: res[0]['top'],
                index:index,
                name: item.name
              }
              that.data.leftData.push(data)
            }
          })
        })
    },
    switchTab(e){
      const self = this;
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
        
    },
    scroll(e){
      console.log(e.detail.scrollTop)
      console.log(this.data.leftData)
      this.data.leftData.map((item,index)=>{
        if(e.detail.scrollTop >= this.data.leftData[this.data.leftData.length - 1].scrollTop)
        {
          this.setData({
            curIndex: this.data.leftData.length - 1
          })
          return
        }
        if(e.detail.scrollTop >= this.data.leftData[index].scrollTop && e.detail.scrollTop < this.data.leftData[index+1].scrollTop)
        {
          this.setData({
            curIndex: index
          })
          return
        }
      })
  
    },
    goDes(e)
    {
      console.log(e.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/page/component/details/details',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: e.currentTarget.dataset.item })
        }
      })
    }
    
    
})