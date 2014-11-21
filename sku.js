/*
 * SKU组合查询
 * @author 单骑闯天下
 * @version 1.0
 * @date 2014.11.21
*/
var getSKU=({
  SKU:{},
  init:function(data){
    var i=0,j,l,
        skuKeyArr=this.getKey(data),// 可以看成可行路径 取得所有可行路径组成集合
        len=skuKeyArr.length,
        skuKey,// 原始数据里面的一条SKU数据的键
        skuValue,// 原始数据里面的一条SKU数据的值
        skuKeyArrs,// 原始数据里面的一条SKU数据的键返回的新的数组[1,2,3,4]
        combinationArr;// 排列组合返回的所有可行路径
    for(;i<len;i++){
      skuKey=skuKeyArr[i];
      skuValue=data[skuKey];
      skuKeyArrs=skuKey.split(";");
      skuKeyArrs.sort(function(value1,value2){
        return (value1>>0) - (value2>>0);
      });
      // 进入combination方法里面的参数[1,2,3,4]
      // 对每个SKU信息key属性值进行拆分组合 返回 [ [1],[2],[3],[4], [1,2],[1,3],[1,4],[2,3],[2,4],[3,4], [1,2,4],[1,3,4],[2,3,4],[1,2,3] ]
      combinationArr=this.combination(skuKeyArrs);
      //console.log(combinationArr);
      l=combinationArr.length;
      for(j=0;j<l;j++){
        this.add(combinationArr[j],skuValue);
      }
      //结果全组合放入SKU 由于在拆分组合的时候没有生成4个元素组合所以放到这一步了
      this.SKU[skuKeyArrs.join(";")]={
        count:skuValue.count,
        prices:[skuValue.price]
      }
    }
    return this.SKU;
  },
  getKey:function(data){
    var data=data,
        key,
        arr=[];
    for(key in data){
      if(Object.prototype.hasOwnProperty.call(data,key)){
        arr.push(key);
      }
    }
    return arr;
  },
  // 返回生成的排列组合
  combination:function(arr){
    var a=this.create(arr,1),
        b=this.create(arr,2),
        c=this.create(arr,3),
        result=c.concat(a).concat(b);
    return result;
  },
  // 核心方法 排列组合 组合中没有重复的组合 排列中有重复的组合(顺序不一样)
  create:function(arr,num){
    var result=[];
    ;(function fn(newArr,arr,n){
      if(n==0){
        return result.push(newArr);
      }
      for(var i=0,len=arr.length;i<=len-n;i++){
        fn(newArr.concat(arr[i]),arr.slice(i+1),n-1);
      }
    }([],arr,num));
    return result;
  },
  add:function(arr,sku){
    var key=arr.join(';');
    if(this.SKU[key]){
      this.SKU[key].count+=sku.count;
      this.SKU[key].prices.push(sku.price);
    }else{
      this.SKU[key]={
        count:sku.count,
        prices:[sku.price]
      };
    }
  }
}).init(data);

console.log(getSKU);