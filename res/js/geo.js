var GEO = {
	build:function(option){
		GEO.province = option.province ? option.province : GEO.province;
		GEO.city = option.city ? option.city : GEO.city;
		GEO.town = option.town ? option.town : GEO.town;
		GEO.pObj = option.pObj ? option.pObj : GEO.pObj;
		GEO.cObj = option.cObj ? option.cObj : GEO.cObj;
		GEO.tObj = option.tObj ? option.tObj : GEO.tObj;
		GEO.load();
		if(GEO.pObj){
			GEO.pObj.on("valuechanged",function(e){
				GEO.setProvince(e.value);
			});
		}
		if(GEO.cObj){
			GEO.cObj.on("valuechanged",function(e){
				GEO.setCity(e.value);
			});
		}
	},
	pObj : null,
	cObj : null,
	tObj : null,
	curP : null,
	curC : null,
	province : null,
	city : null,
	town : null,
	geodata : null,
	load : function(callback){
//		$.post("http://localhost:8080/ycloud/js/bui/geo.txt",{},function(data){
		$.post(CONST_PROJECT.geoDataPath,{},function(data){
			data = eval("("+data+")");
			GEO.geodata = data;
			if(callback){
				callback(data);
			}
			GEO.setProvince(GEO.province);
		});
	},
	setProvince : function(val){
		if(GEO.geodata){
			var data = [];
			GEO.curP = null;
			for(var i in GEO.geodata.nodes){
				if(GEO.geodata.nodes[i].id && GEO.geodata.nodes[i].value){
					var node = {
						id : GEO.geodata.nodes[i].id,
						text : GEO.geodata.nodes[i].value
					};
					data.push(node);
					if(GEO.geodata.nodes[i].id == val){
						GEO.curP = GEO.geodata.nodes[i];
					}
				}
			}
			if(GEO.pObj){
				GEO.pObj.setData(data);
			}
			if(val != GEO.province){
				GEO.province = val;
				GEO.pObj.setValue(GEO.province);
				GEO.setCity("");
			}else{
				GEO.setCity(GEO.city);
			}
		}else{
			this.load();
		}
	},
	setCity : function(val){
		if(GEO.geodata){
			var data = [];
			GEO.curC = null;
			if(GEO.curP && GEO.curP.children){
				for(var i in GEO.curP.children){
					if(GEO.curP.children[i].id && GEO.curP.children[i].value){
						var node = {
							id : GEO.curP.children[i].id,
							text : GEO.curP.children[i].value
						};
						data.push(node);
						if(GEO.curP.children[i].id == val){
							GEO.curC = GEO.curP.children[i];
						}
					}
				}
			}
			if(GEO.cObj){
				GEO.cObj.setData(data);
			}
			if(val != GEO.city){
				GEO.city = val;
				GEO.cObj.setValue(GEO.city);
				GEO.setTown("");
			}else{
				GEO.setTown(GEO.town);
			}
		}else{
			this.load();
		}
	},
	setTown : function(val){
		if(GEO.geodata){
			var data = [];
			if(GEO.curC && GEO.curC.children){
				for(var i in GEO.curC.children){
					if(GEO.curC.children[i].id && GEO.curC.children[i].value){
						var node = {
							id : GEO.curC.children[i].id,
							text : GEO.curC.children[i].value
						};
						data.push(node);
					}
				}
			}
			if(GEO.tObj){
				GEO.tObj.setData(data);
			}
			if(val != GEO.town){
				GEO.town = val;
				GEO.tObj.setValue(GEO.town);
			}
		}else{
			this.load();
		}
	},
	getCityData : function(val){
		if(GEO.geodata){
			for(var i in GEO.geodata.nodes){
				if(GEO.geodata.nodes[i].id==val){
					return GEO.geodata.nodes[i].children;
				}
			}
			return null;
		}else{
			this.load();
			return null;
		}
	},
	getTownData : function(pval,cval){
		var cdata = GEO.getCityData(pval);
		if(cdata){
			for(var i in cdata){
				if(cdata[i].id==cval){
					return cdata[i].children;
				}
			}
			return null;
		}
	}
};