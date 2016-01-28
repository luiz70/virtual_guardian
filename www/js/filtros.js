angular.module('starter')
.filter('FHNotificacion', function () {
	return function (input) {
	   if(input){
		   var date=new Date(parseInt(input.Fecha)*1000);
		   var d,m
		   d=(date.getDate()<10)?("0"+date.getDate()):date.getDate()
		   m=((date.getMonth()+1)<10)?("0"+(date.getMonth()+1)):(date.getMonth()+1)
		   return ""+d+"-"+m+"-"+date.getFullYear()+" "+input.Hora
	   }
	}
})
.filter('tituloNotificacion', function () {
	return function (input,scope) {
		if(input){
			if(input.Tipo==1) return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[1]+scope.idioma.Estados[input.Estado]
			else if(input.Tipo==2)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[4];
			else if(input.Tipo==3)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[5]+input.Persona
			else if(input.Tipo==4)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[6]
			else if(input.Tipo==5 || input.Tipo==6)return scope.idioma.Notificaciones[7];
			else if(input.Tipo==7) return scope.idioma.Notificaciones[8];
			else if(input.Tipo==8) return scope.idioma.Notificaciones[9];
			else if(input.Tipo==9)return scope.idioma.Notificaciones[10];
	   }
	}
})

.filter('subtituloNotificacion', function () {
	return function (input,scope) {
	   if(input){
			if(input.Tipo<5){
				var palabras=scope.idioma.Palabras
				var direc=[]
				if((""+input.Calles).trim()!="")direc.push(input.Calles)
				if((""+input.Colonia).trim()!="")direc.push(input.Colonia)
				if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
				if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
				var direc=direc.join(", ").toLowerCase().split(" ");
				for(var i=0;i<direc.length;i++)
					if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
				return direc.join(" ")
			}
			else if(input.Tipo==5)return input.Persona+scope.idioma.Notificaciones[11];
			else if(input.Tipo==6)return input.Persona+scope.idioma.Notificaciones[12];
			else if(input.Tipo==7) return input.Persona+scope.idioma.Notificaciones[13];
			else if(input.Tipo==8) return scope.idioma.Notificaciones[14];
			else if(input.Tipo==9)return input.Persona+scope.idioma.Notificaciones[15];
	   }
	}
})
.filter('notificaciones', function () {
	return function (input) {
	   if(input){
		   var d=[];
		   for(var i=0;i<input.length;i++)
		   if(!_.isUndefined(input[i].Evento))d.push(input[i]);	
		   console.log(d);  
			return d;
	   }
	}
})
.filter('contactoEstatus', function () {
	return function (input,scope) {
	   if(input){
		   if(input.Estatus==1)return  scope.idioma.Contactos[8];
		   else{
			   if(input.Tipo==1)return scope.idioma.Contactos[9];
			   else return scope.idioma.Contactos[10]
		   }
	   }
	}
})
.filter("duracion",function(){
	return function(t){
		var sec_num = parseInt(t, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    
		return time;
	}
})
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})
.filter('subtituloInfo', function () {
return function (input,scope) {
   if(input){
	   	var direc=[]
		if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").split(" ");
		for(var i=0;i<direc.length;i++)
			direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase()
		return direc.join(" ")
   }else return "";
}
})
.filter('direccion', function () {
return function (input,scope) {
   if(input){
		var palabras=scope.idioma.Palabras		
	   	var direc=[]
		if((""+input.Calles).trim()!="")direc.push(input.Calles)
		if((""+input.Colonia).trim()!="")direc.push(input.Colonia)
		if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").toLowerCase().split(" ");
		for(var i=0;i<direc.length;i++)
			if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
		return direc.join(" ")
   }else return "";
}
})
.filter('fechaInfo', function () {
	return function (input,scope) {
	   if(input){
		   var x=new Date(parseInt(input)*1000);
		   return ((x.getDate()<10)?"0":"")+x.getDate()+" de "+scope.idioma.Meses[parseInt(x.getMonth()+1)]+" de "+x.getFullYear();
	   }
	}
})

.filter('escalaV', function () {
	return function (input) {
	   if(input){
		   if(!input.Prom)input.Prom=0;
		   var escala=(input.Val*5)/input.Prom;
		   if(escala>10)escala=10;
		   if(escala<0) escala=0;
		   return (10-escala).toFixed(1);
	   }
	}
})
.filter('fechaFiltros', function () {
	return function (input,scope,id) {
	   if(input){
		   var f=new Date();
		   switch(id){
			   case 1:
			   		if(input.tipo)f.setDate(f.getDate()-input.periodo)
					else f=input.fechaInicial
			   break;
			   case 2:
			   		if(!input.tipo)f=input.fechaFinal
			   break;
		   }
		   var d=f.getDate()
		   return (d<10?"0"+d:d)+" - "+scope.idioma.Meses[parseInt(f.getMonth()+1)].substring(0,3)+" - "+f.getFullYear();
	   }
	}
})