var axios = require("axios");
var fs=require("fs");
const { Console } = require("console");


function n(t) {
    for (var e = [], i = 0; i < t; i++)
        e.push(0);
    return e
}


function toDecimal2(x) { 
    var f = parseFloat(x); 
    if (isNaN(f)) { 
        return false; 
    } 
    var f = Math.round(x*100)/100; 
    var s = f.toString(); 
    var rs = s.indexOf('.'); 
    if (rs < 0) { 
        rs = s.length; 
        s += '.'; 
    } 
    while (s.length <= rs + 2) { 
        s += '0'; 
    } 
    return s; 
} 

calc = function(k) {
    t=k.length-1;
    //console.log(t)
    this.klinedata=k
    this.fator=150
    this.range=120
    function e(t) {
        for (var e = 0, i = 0, n = 0; n < o; n++) {
            var r = p[n].toPrecision(12) / 1;
            if (i + r > t) {
                e = a + n * h;
                break
            }
            i += r
        }
        return e
    }
    //start 
    //this:fator:150,klinedata:Array(1211),range:120
    var i = 0
      , a = 0
      , o = this.fator
      , r = this.range ? Math.max(0, t - this.range + 1) : 0
      , s = this.klinedata.slice(r, Math.max(1, t + 1));
     // console.log(i,a,o,r)
    //console.log(s)
    if (0 === s.length){
        console.log("klinedata is null")
        return
    }
        
    for (c = 0; c < s.length; c++) {
        var l = s[c];
        i = i ? Math.max(i, l[3] / 1) : l[3] / 1,
        a = a ? Math.min(a, l[4] / 1) : l[4] / 1
    }
    for (var h = Math.max(.01, (i - a) / (o - 1)), d = [], c = 0; c < o; c++)
        d.push((a + h * c).toFixed(2) / 1);
    for (var p = n(o), c = 0; c < s.length; c++) {
        for (var g = s[c], f = g[1] / 1, A = g[2] / 1, u = g[3] / 1, m = g[4] / 1, C = (f + A + u + m) / 4, v = Math.min(1, g[8] / 100 || 0), I = Math.floor((u - a) / h), y = Math.ceil((m - a) / h), x = [u == m ? o - 1 : 2 / (u - m), Math.floor((C - a) / h)], b = 0; b < p.length; b++)
            p[b] *= 1 - v;
           // console.log(v)
        if (u == m)
            p[x[1]] += x[0] * v / 2;
        else
            for (var w = y; w <= I; w++) {
                var M = a + h * w;
                M <= C ? Math.abs(C - m) < 1e-8 ? p[w] += x[0] * v : p[w] += (M - m) / (C - m) * x[0] * v : Math.abs(u - C) < 1e-8 ? p[w] += x[0] * v : p[w] += (u - M) / (u - C) * x[0] * v
            }
    }
    for (var k = this.klinedata[t][2] / 1, T = 0, c = 0; c < o; c++) {
        var D = p[c].toPrecision(12) / 1;
        T += D
    }
    //console.log(p)
    var R = new function() {
        this.x = arguments[0],
        this.y = arguments[1],
        this.benefitPart = arguments[2],
        this.avgCost = arguments[3],
        this.percentChips = arguments[4],
        this.computePercentChips = function(t) {
            if (t > 1 || t < 0)
                throw 'argument "percent" out of range';
            var i = [(1 - t) / 2, (1 + t) / 2]
              , n = [e(T * i[0]), e(T * i[1])];
            return {
                priceRange: [n[0].toFixed(2), n[1].toFixed(2)],
                concentration: n[0] + n[1] === 0 ? 0 : (n[1] - n[0]) / (n[0] + n[1])
            }
        }
        ,
        this.getBenefitPart = function(t) {
            for (var e = 0, i = 0; i < o; i++) {
                var n = p[i].toPrecision(12) / 1;
                t >= a + i * h && (e += n)
            }
            return 0 == T ? 0 : e / T
        }
    }
    ;
    return R.x = p,
    R.y = d,
    R.benefitPart = R.getBenefitPart(k),
    R.avgCost = e(.5 * T).toFixed(2),
    R.percentChips = {
        90: R.computePercentChips(.9),
        70: R.computePercentChips(.7)
    },
    R
}


function doCollectcyq_callback(cyqurllist,callback) {
    for(var index=0;index<cyqurllist.length;++index){
        ~function(index){
            console.log('for each:'+index);
            axios.get(cyqurllist[index]).then(resp => {
                console.log('resp:'+index);
                console.log("股票名称："+name[index])
                var respdata=resp.data
                //console.log(respdata)
                var regex = /\{(.+?)\}}/g;
                var alldata = respdata.match(regex)
                var datajson=JSON.parse(alldata[0])
                var klinesstr=datajson['data']['klines']
                //console.log("length:"+klinesstr.length);
                if(klinesstr.length==0){
                    console.log("这是新票，没有数据。")
                    console.log("------------------------------------------------------");
                    return;
                }
                var klineslist=[]
                klinesstr.forEach((item,index,array)=>{
                    var dataStrArr=item.split(',')
                    var dataIntArr=[];
                    dataStrArr.forEach(function(data,index,array){  
                        if(index==7){
                            dataIntArr.push(data+'%');
                        }else{
                            dataIntArr.push(data);  
                        }
                    });
                    var tmp=dataIntArr[10]
                    dataIntArr[10]=dataIntArr[9]
                    dataIntArr[9]=dataIntArr[8]
                    dataIntArr[8]=tmp
                    //console.log(dataIntArr)
                    klineslist.push(dataIntArr);
                })
                callback(klineslist)    
                number++;
            })
        }(index)
    }
}

async function doCollectkline(cyqurl) {
    var klineslist=[]
    var name
    await axios.get(cyqurl).then(resp => {
        
        // console.log('resp:'+index);
        // console.log("股票名称："+name[index])
        var respdata=resp.data
        //console.log(respdata)
        var regex = /\{(.+?)\}}/g;
        var alldata = respdata.match(regex)
        var datajson=JSON.parse(alldata[0])
        var klinesstr=datajson['data']['klines']
        name=datajson['data']['name']
        //console.log("length:"+klinesstr.length);
        console.log('name:'+name);
        if(klinesstr.length==0){
            console.log("这是新票，没有数据。")
            console.log("------------------------------------------------------");
            return;
        }
        //var klineslist=[]
        klinesstr.forEach((item,index,array)=>{
            var dataStrArr=item.split(',')
            var dataIntArr=[];
            dataStrArr.forEach(function(data,index,array){  
                if(index==7){
                    dataIntArr.push(data+'%');
                }else{
                    dataIntArr.push(data);  
                }
            });
            var tmp=dataIntArr[10]
            dataIntArr[10]=dataIntArr[9]
            dataIntArr[9]=dataIntArr[8]
            dataIntArr[8]=tmp
            //console.log(dataIntArr)
            klineslist.push(dataIntArr);
        })
    })
    return{
        name:name,
        klines:klineslist
    }
}

async function getCodelist(page){
    //console.log(page);
    var codeurl="http://86.push2.eastmoney.com/api/qt/clist/get?cb=jQuery11240619252496716159_1599726294077&pn="+page+"&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:0+t:80,m:1+t:2,m:1+t:23&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1599726294110" 
    var cyqurllist=[]
    await axios.get(codeurl).then(resp=>{
        var respdata=resp.data
        var regex = /\{(.+?)\}}/g;
        var alldata = respdata.match(regex)
        var datajson=JSON.parse(alldata[0])
        var diff=datajson['data']['diff']
        ///console.log('start');
        var name=[]
        var market=[]
        var code=[]
        //console.log(diff)
        diff.forEach((item,index,array)=>{
            name.push(item['f14'])
            market.push(item['f13'])
            code.push(item['f12'])
            var key=market[index]+'.'+code[index]
            //var value=name[index]
            var cyqurl="http://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery112409678402901524392_1599495951246&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&ut=7eea3edcaed734bea9cbfc24409ed989&klt=101&fqt=1&secid="+key+"&beg=0&end=20500000&_=1599495951255"
            cyqurllist.push(cyqurl);
        }) 
        
    });
    //await callback(cyqurllist);
    return cyqurllist;
}

function savedate(kline){
    if(kline.length==0){
        return;
    }
    console.log('run savedate');
    var R=calc(kline);
    var benefitPart=toDecimal2(R.benefitPart*100)
    var avgCost=R.avgCost 
    var minpercentChips90=R.percentChips['90']['priceRange'][0]
    var maxpercentChips90=R.percentChips['90']['priceRange'][1]
    var percentChips90=toDecimal2(R.percentChips['90']['concentration']*100)
    var minpercentChips70=R.percentChips['70']['priceRange'][0]
    var maxpercentChips70=R.percentChips['70']['priceRange'][1]
    var percentChips70=toDecimal2(R.percentChips['70']['concentration']*100)
    //console.log(value);
    console.log("获利比例："+benefitPart+'%')
    console.log("平均成本："+avgCost+'元')
    console.log("90%成本集中度："+percentChips90+'%')
    console.log("90%成本："+minpercentChips90+'元-'+maxpercentChips90+'元')
    console.log("70%成本集中度："+percentChips70+'%')
    console.log("70%成本："+minpercentChips70+'元-'+maxpercentChips70+'元')
    console.log("------------------------------------------------------")
    return {
        benefitPart:benefitPart,
        avgCost:avgCost,
        percentChips90:percentChips90,
        minpercentChips90:minpercentChips90,
        maxpercentChips90:maxpercentChips90,
        percentChips70:percentChips70,
        minpercentChips70:minpercentChips70,
        maxpercentChips70:maxpercentChips70
    }
}

function savecsv(value,cyqinfo){
    var benefitPart=cyqinfo.benefitPart
    var avgCost=cyqinfo.avgCost
    var minpercentChips90=cyqinfo.minpercentChips90
    var maxpercentChips90=cyqinfo.maxpercentChips90
    var percentChips90=cyqinfo.percentChips90
    var minpercentChips70=cyqinfo.minpercentChips70
    var maxpercentChips70=cyqinfo.maxpercentChips70
    var percentChips70=cyqinfo.percentChips70
    fs.open('/Users/fancy/Desktop/scripts/cyqcollect.csv', 'a+', function (err, fd) {
        if (err) {
            console.error(err);
            return;
        }
        var buffer=value+','+benefitPart+','+avgCost+','+percentChips90+','+minpercentChips90+','+maxpercentChips90+','+percentChips70+','+minpercentChips70+','+maxpercentChips70+'\n';       
        fs.write(fd, buffer,'utf8',function(err,fd){
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}


async function start(){
    for (var page = 149; page <=209; page++) {
        //console.log('for:'+page)
        var cyqurllist =  await getCodelist(page)
        for(var cyqurlitem of cyqurllist){
            var klineinfo=await  doCollectkline(cyqurlitem);
            //console.log(klineinfo)
            var cyqinfo=await savedate(klineinfo.klines);
            if(cyqinfo!=null){
                await savecsv(klineinfo.name,cyqinfo);
            }
        }
    }
}
start();