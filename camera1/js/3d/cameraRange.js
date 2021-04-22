var makeCamera = function (option) {

    this.cameraRange = {};
    this.r           =  option.r;
    this._x          =  option._x;
    this._y          =  option._y;
    this.start       =  option.start;
    this.end         =  option.end;
    this.fillColor   =  option.fillColor;
}
makeCamera.prototype = {
    //初始化方法
    init: function () {
        
        var array2   = this.showCircle(this.r,this._x,this._y,this.start,this.end);
        var center2  = this.showCenter(this.r,this._x,this._y,this.start,this.end);

        var cameraRange = {};
        cameraRange.name = "";
        cameraRange.self_id = "1501";
        cameraRange.relative_id = "1601";
        cameraRange.specialSite = "18";
        cameraRange.y = "0";
        cameraRange.h = "2";
        cameraRange.gap = "1";
        cameraRange.center = center2;
        cameraRange.line = array2;
        cameraRange.grith = this.computeGrith(array2);
        cameraRange.fillColor = this.fillColor;
       
        this.cameraRange = cameraRange;
    },
    //画边框
    showCircle: function (r, _x, _y, start, end) {
        var PI = Math.PI;   
        var x, y;              
        var arrayPoint = [];

        var array1 = [];             
        array1.push(_x);  
        array1.push(_y);  
        arrayPoint.push(array1);

        for (var i = start; i < start + end; i += 6) {
            var array = [];                    
            x = Math.cos(PI / 180 * i) * r + _x;                    
            y = Math.sin(PI / 180 * i) * r + _y;
            array.push(x);
            array.push(y);
            arrayPoint.push(array);                
        }       

        arrayPoint.push(array1);

        return arrayPoint;

    },
    //画中心点    
    showCenter:function(r, _x, _y, start, end) {
        var PI = Math.PI;
        var x, y;
        var array = [];
        x = Math.cos(PI / 180 * (start + end / 2)) * r + _x;       
        y = Math.sin(PI / 180 * (start + end / 2)) * r + _y;
        array.push(x);
        array.push(y);
        return array;
    },
    //计算周长
    computeGrith:function (array) { //计算边缘周长
        var total = 0;
        for (var i = 0; i < array.length - 1; i++) {
            var a = Math.sqrt(Math.pow((array[i][0] - array[i + 1][0]), 2) + Math.pow((array[i][1] - array[i + 1][1]), 2));
            total = total + a;
        }
        return total;
    },
    //获取对象
    getCameraRange:function(){
        return this.cameraRange ;
    }

}