'use strict';
angular.module('app')
    .factory('GlobalServise',GlobalServise);
    

    GlobalServise.$inject=[];
   

    function GlobalServise(){
        
        var service = {};

        //分离数字和单位 1
        service.numFormatter = function(input,n) {
            var x=n?n:2;
            var reservedDigit = 1;
            if(input >= 1000*1000) {
                reservedDigit = (input % (1000*1000) === 0) ? 0 : x;
                input = (input/(1000*1000)).toFixed(reservedDigit);
                if(input % 1 === 0){
                    // input = (input*1).toFixed(0)+'';
                    input = (input*1).toFixed(0)
                }else{
                    // input = input+'亿';
                }
            }else if(input >= 1000) {
                reservedDigit = (input % 1000 === 0) ? 0 : x;
                input = (input/1000).toFixed(reservedDigit);
                if(input % 1 === 0){
                    // input = (input*1).toFixed(0)+'K';
                    input = (input*1).toFixed(0);
                }else{
                    // input = input+'万';
                }
            }else if(input >=0){
                reservedDigit = (input % 1 === 0) ? 0 : x;
                input = (input*1).toFixed(reservedDigit);
                if(input % 1 === 0){
                    input = (input*1).toFixed(0);
                }else{
                    input = input;
                }
                
            }
            return input;
        };

        //分离数字和单位  2
		service.numFormatter_w = function(input,n) {
			var reservedDigit = 1;
			var unit;
			var  x=n;
			if(input=="N/A"){
				return {'input':input,'unit':''}				
			}if(input >= 1000*1000*1000*1000*1000){
				reservedDigit = (input % (1000*1000*1000*1000*1000) === 0) ? 0 : x;
				input = (input/(1000*1000*1000*1000*1000)).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = 'P'
				}else{
					input = input;
					unit = 'P'
				}
			}else if(input >= 1000*1000*1000*1000){
				reservedDigit = (input % (1000*1000*1000*1000) === 0) ? 0 : x;
				input = (input/(1000*1000*1000*1000)).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = 'T';
				}else{
					input = input;
					unit = 'T';
				}
			}
			else if(input >= 1000*1000*1000) {
				reservedDigit = (input % (1000*1000*1000) === 0) ? 0 : x;
				input = (input/(1000*1000*1000)).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = 'G';
				}else{
					input = input;
					unit = 'G';
				}
			}else if(input >= 1000*1000) {
				reservedDigit = (input % (1000*1000) === 0) ? 0 : x;
				input = (input/(1000*1000)).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = 'M';
				}else{
					input = input;
					unit = 'M';
				}
			}else if(input >= 1000) {
				reservedDigit = (input % 1000 === 0) ? 0 : x;
				input = (input/1000).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = 'K';
				}else{
					input = input;
					unit = 'K';
				}
			}else if(input >=0){
				reservedDigit = (input % 1 === 0) ? 0 : x;
				input = (input*1).toFixed(reservedDigit);
				if(input % 1 === 0){
					input = (input*1).toFixed(0);
					unit = '';
				}else{
					input = input;
					unit = '';
				}

			}
			var obj = {'input':input,'unit':unit}
			return obj;
		};

        
        return service;
    }

    