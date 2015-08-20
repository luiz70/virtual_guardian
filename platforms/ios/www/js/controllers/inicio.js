angular.module('starter')
.controller("inicio",function($scope,$location,$ionicSlideBoxDelegate,$http,$rootScope,$ionicSideMenuDelegate,$timeout,$cordovaNetwork,$ionicPopover,$ionicHistory){

    $rootScope.onTab=function (id){
            if(!$rootScope.recorrido || $rootScope.stepRecorrido==9){
                $rootScope.cargando=false;
                $("#img_btn_1").attr("src","img/iconos/map.png");
                $("#img_btn_2").attr("src","img/iconos/tasks.png");
                $("#img_btn_3").attr("src","img/iconos/people.png");
                $("#img_btn_4").attr("src","img/iconos/car.png");
                $("#img_btn_"+id).attr("src",$("#img_btn_"+id).attr("src").substr(0,$("#img_btn_"+id).attr("src").length-4)+"2.png");
                $scope.slideTo(id)
            }
    }
            $ionicHistory.nextViewOptions({
 disableBack: true
});
$rootScope.tituloRecorrido=""
$rootScope.startRecorrido=function(val){
    //bienvenida
    if($scope.Conexion(1,function(){
        
    })){
        $scope.popoverRec = $ionicPopover.fromTemplateUrl("pantallas/recorridoStart.html", {
        scope: $scope
        }).then(function(popover) {
             $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[1];
            $scope.popoverRec = popover;
            $scope.popoverRec.show();
            $(".popover-arrow").hide();
        });
    }
}
if($rootScope.Usuario.Nuevo==1 && !window.localStorage.getItem("enRecorrido"))$timeout(function(){$rootScope.startRecorrido(1)},1000);
else $timeout(function(){$rootScope.isVigente();},1000);
$scope.des=function(){
    console.log($rootScope.filtros.Estados);
}
$scope.Periodos=[
{Nombre:$scope.idioma.periodos[7],Periodo:7},
{Nombre:$scope.idioma.periodos[30],Periodo:30},
{Nombre:$scope.idioma.periodos[180],Periodo:180},
{Nombre:$scope.idioma.periodos[365],Periodo:365}
]
if( window.sqlitePlugin)$rootScope.inicializaBaseLocal();
$rootScope.stepRecorrido=0;
$scope.fechaNotRef=null;
$scope.fechaPerRef=null;
$rootScope.cargando=true;
$scope.pantallas=[true,false,false,true];
$timeout(function(){ 
    $ionicSlideBoxDelegate.enableSlide(false); 
    if($rootScope.tabInicial!=1)$rootScope.onTab($rootScope.tabInicial);
    
},300);
$scope.tamano=window.innerWidth*0.85;
$("#capa_menu").hide();
$scope.filtro={fechai:null,fechaf:null,estados:"",eventos:""};
$scope.Estados=[];
if(window.localStorage.getArray("TipoEventos"))$scope.TipoEventos=window.localStorage.getArray("TipoEventos");
else $scope.TipoEventos=[];

$rootScope.iniciaRecorrido=function(){
    $scope.popoverRec.hide();
    $scope.popoverRec=null;
window.localStorage.setItem("enRecorrido",1);
$location.path("/home");
        $timeout(function(){
                $location.path('/inicio');
                
            },1000);
}
//$rootScope.stepRecorrido=1
$rootScope.closeRecorrido=function(){
        window.localStorage.removeItem("enRecorrido")
        $rootScope.Usuario.Nuevo=0
        window.localStorage.setArray("Usuario",$rootScope.Usuario)
        switch($rootScope.stepRecorrido){
        case 0: $scope.popoverRec.hide();
        $rootScope.alert($scope.idioma.general[23],$scope.idioma.recorrido[5],function(){
        });
        break;
        default:
        
        $scope.popoverRec.hide();;
        $scope.popoverRec=null;
        $location.path("/home");
        $timeout(function(){
                $location.path('/inicio');
            },1000);
            $rootScope.Usuario.Nuevo=0;
        break;
    }
        
        

}

$rootScope.recorrido=false;
$rootScope.nextRecorrido=function(){
    
    switch($rootScope.stepRecorrido){
        case 0:
        //
        $rootScope.stepRecorrido=1;
            $rootScope.recorrido=true;
        $scope.popoverRec = $ionicPopover.fromTemplateUrl("pantallas/recorridopop.html", {
        scope: $scope
        }).then(function(popover) {
             $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[1];
            $scope.popoverRec = popover;
            $scope.popoverRec.show();
            $(".popover-arrow").hide();
        $("#popRecorrido").height('80vh')
                
            
                    });
                    $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[6];
        
        break;
        case 1:
        if($rootScope.miubicacion.lat()==0)$rootScope.miubicacion=$rootScope.ubicacionMarker.getPosition();
        $rootScope.Eventos=[{"IdEvento":"1","IdAsunto":"1","Latitud":$rootScope.miubicacion.lat()+0.005,"Longitud":$rootScope.miubicacion.lng()+0.009}]; 
        if($scope.Conexion()){
        
        $("#recorrido1").removeClass("animate-hide");
        $rootScope.inicializaMapaRecorrido();
        $scope.popoverRec.hide();
        $rootScope.msj_map=true;
        $("#msj_map").html($rootScope.idioma.recorrido[11]);
        $("#recorrido1").addClass("ng-hide");
        $rootScope.stepRecorrido=2;
        }else {
            $("#recorrido1").addClass("ng-hide");
        $rootScope.stepRecorrido=2;
        $rootScope.nextRecorrido();
        }
        break;
        case 2:
        
        $scope.popoverRec.show();
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[8];
        $rootScope.inicializaMapaRecorrido();
        $rootScope.stepRecorrido=3;
        break;
        case 3:
        if($scope.Conexion()){
        $("#recorrido1").removeClass("animate-hide");
        $rootScope.inicializaMapaRecorrido();
        $scope.popoverRec.hide();
        $rootScope.msj_map=true;
        $("#msj_map").html($rootScope.idioma.recorrido[12]);
        $("#recorrido2").addClass("ng-hide");
        $("#tapa_pie").height("30px");
        $rootScope.stepRecorrido=4;
        }else{
            $("#recorrido2").addClass("ng-hide");
            $rootScope.stepRecorrido=5;
        $rootScope.nextRecorrido();
        }
        break;
        case 4:
        $("#msj_map").html($rootScope.idioma.recorrido[13]);
        $rootScope.stepRecorrido=5;
        $("#tapa_pie").height("40px");
        $("#tapa_pie").css("top","30px");
        break;
        case 5:
        $("#tapa_pie").height("70px");
        $("#tapa_pie").css("top","0px");
        $scope.popoverRec.show();
        $rootScope.msj_map=false;
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[15];
        $rootScope.inicializaMapaRecorrido();
        $rootScope.stepRecorrido=6;
        break;
        case 6:
        if($scope.Conexion()){
        $rootScope.onSPos({'coords':{'latitude':$rootScope.miubicacion.lat()-0.005,'longitude':$rootScope.miubicacion.lng()-0.009}});
        $("#recorrido3").removeClass("animate-hide");
        $rootScope.inicializaMapaRecorrido();
        $scope.popoverRec.hide();
        $rootScope.msj_map=true;
        $("#msj_map").html($rootScope.idioma.recorrido[20]);
        $("#recorrido3").addClass("ng-hide");
        $("#msj_map").css( "bottom"," 8vh")
        $("#msj_map").css( "top"," auto");
        $rootScope.stepRecorrido=7;
        }else{
            $("#recorrido3").addClass("ng-hide");
            $rootScope.stepRecorrido=8;
            $rootScope.nextRecorrido();
        }
        break;
        case 7:
        $rootScope.stepRecorrido=8;
        $("#msj_map").html($rootScope.idioma.recorrido[21]);
        break;
        case 8:$rootScope.stepRecorrido=9;
        $rootScope.onTab(2);
        $scope.popoverRec.show();
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[22];
        break;
        case 9:
        $("#recorrido9").removeClass("animate-hide");
        $rootScope.stepRecorrido=10;
        $rootScope.onTab(3);
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[31];
        break;
        case 10:
        $("#recorrido10").removeClass("animate-hide");
        $rootScope.stepRecorrido=11;
        $rootScope.onTab(4);
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[35];
        break;
        case 11:
        $("#recorrido11").removeClass("animate-hide");
        $rootScope.stepRecorrido=12;
        $rootScope.onTab(1);
        $rootScope.tituloRecorrido=$rootScope.idioma.recorrido[41];
        break;
        
    }
}
//window.localStorage.removeItem("enRecorrido")
if(window.localStorage.getItem("enRecorrido"))$timeout(function(){$rootScope.nextRecorrido();
},500);
$rootScope.msj_map=false;
if(!window.localStorage.getArray("Estados"))
$http.get("https://www.virtual-guardian.com/api/estados")
    .success(function(data,status,header,config){
        $scope.Estados=[];
        for(var i=0;i<data.length;i++)
        $scope.Estados.push(JSON.parse(data[i]));
        window.localStorage.setArray("Estados",$scope.Estados)
        $scope.filtrosEstados=$scope.Estados
        })
    .error(function(error,status,header,config){
        })
else $scope.Estados=window.localStorage.getArray("Estados")


if(!window.localStorage.getArray("Filtros")){
var d1=new Date();
var d2=new Date();
d2.setDate(d2.getDate()-$rootScope.Usuario.Periodo);
$rootScope.filtros={
    Estado:false,
    Inicial:d2,
    Final:d1,
    Estados:$scope.Estados,
    Tipos:$scope.TipoEventos,
    Periodo:{Nombre:$scope.idioma.periodos[$rootScope.Usuario.Periodo],Periodo:$rootScope.Usuario.Periodo}
    
}
}else{
    
    var fil=window.localStorage.getArray("Filtros");
    $rootScope.filtros={
    Estado:fil.Estado,
    Inicial:new Date(fil.Inicial),
    Final:new Date(fil.Final),
    Estados:fil.Estados,
    Tipos:fil.Tipos,
    Periodo:{Nombre:$scope.idioma.periodos[$rootScope.Usuario.Periodo],Periodo:$rootScope.Usuario.Periodo}
}

}
$http.get("https://www.virtual-guardian.com/api/tipoeventos",{})
    .success(function(data,status,header,config){
        $scope.TipoEventos=[];
        for(var i=0;i<data.length;i++)
        $scope.TipoEventos.push(JSON.parse(data[i]));
        window.localStorage.setArray("TipoEventos",$scope.TipoEventos)
        if(!$rootScope.iOS)$rootScope.filtros.Tipos=$scope.TipoEventos;
        })
    .error(function(error,status,header,config){
        })
$scope.desactiva=function(val){
    switch(val){
        case 1:$rootScope.Usuario.NotificacionesEventos=(!$rootScope.Usuario.NotificacionesEventos)? 1 : 0;
        break;
        case 2:$rootScope.Usuario.NotificacionesPersonas=(!$rootScope.Usuario.NotificacionesPersonas)? 1 : 0;
        break;
        case 3:if($rootScope.Usuario.NotificacionesEventos==1)$rootScope.Usuario.NotificacionesAuto=(!$rootScope.Usuario.NotificacionesAuto)? 1 : 0;
        break;
        }
}
$scope.ajustes=false;
$rootScope.Productos=[];
$rootScope.productoSeleccionado=null;
$rootScope.seleccionaSuscripcion=function(producto){
    
    //if(producto.Id!=$rootScope.Usuario.IdSuscripcion){
$rootScope.productoSeleccionado=producto
    //}
}

$scope.compraDisponible=true;
$rootScope.verPrecios=false;
$rootScope.cancelaSuscripcion=function(){
    if($rootScope.OS=="iOS"){
        window.open("https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions","_system")
    }else{
        window.open("https://play.google.com/store/apps/details?id=com.app.virtualguardian","_system")
    }
}
$rootScope.muestraPrecPaq=function(){
        
    $rootScope.verPrecios=!$rootScope.verPrecios;
    if(!$("#contentPaquetes").hasClass("in")){
        $("#paquetes_flecha").removeClass("ion-chevron-down")
        $("#paquetes_flecha").addClass("ion-chevron-up")
    }else{
        $("#paquetes_flecha").removeClass("ion-chevron-up")
        $("#paquetes_flecha").addClass("ion-chevron-down")
        if(window.store){
        store.off(errorPrice)
        store.off(errorPrice)
        store.off(errorPrice)
        }
    }
    if($rootScope.verPrecios)$scope.abreAjustesPaquetes();
}
$scope.cancelCompra=function(product){
    $timeout(function(){
        $rootScope.hideCargando()
    },500)
}
        
$scope.aproveCompra=function(product){
    console.log("aproved");
    product.verify()
    .done(function(producto){
        var trans=jQuery.extend(true, {}, producto.transaction);
        trans.Usuario=$rootScope.Usuario.Id;
        trans.Suscripcion=producto.id;
        trans.Os=window.device.platform;
        $http.post("https://www.virtual-guardian.com/api/guardaRecibo",trans)
        .success(function(data){
            $rootScope.hideCargando()
            console.log(data);
            $rootScope.alert(
                $rootScope.idioma.cuenta[17]+" "+$rootScope.productoSeleccionado.Nombre,
                $rootScope.idioma.cuenta[21],
                function(){
                    //refresh
                })
            product.finish();
        })
        .error(function(error){
            product.finish();
        })
    })
}
            
$scope.finishCompra=function(product){
    console.log("fin")
    store.off($scope.cancelCompra)
    store.off($scope.finishCompra);
    store.off($scope.aproveCompra);
    $timeout(function(){
        $rootScope.hideCargando()
    },500)
}
            
$rootScope.comprarProducto=function(){
    if($scope.compraDisponible){
        $rootScope.showCargando("")
        store.order($rootScope.productoSeleccionado.IdProducto)
        .error(function(err){
            $timeout(function(){
                $rootScope.hideCargando()
            },1000)
        });
        store.when($rootScope.productoSeleccionado.IdProducto).cancelled($scope.cancelCompra)
        store.once($rootScope.productoSeleccionado.IdProducto).approved($scope.aproveCompra)
        store.once($rootScope.productoSeleccionado.IdProducto).finished($scope.finishCompra)
    }
}
        
$scope.abreAjustesCuenta=function(){
    $rootScope.verPrecios=false;
    $scope.openTerminos("pantallas/cuenta.html");
}
            
$scope.abreAjustesPaquetes=function(){
    $rootScope.productoSeleccionado=null;
    $scope.productosCargados=0;
    $rootScope.cargandoCuenta=true;
    if($rootScope.Productos.length==0)
        $scope.cargaProductosSQL();
    
    if(window.store){
        store.off($scope.errorPrecio)
        store.off($scope.updatePrecio)
        store.off($scope.loadPrecio)
        store.error($scope.errorPrecio)
        store.when('product').updated($scope.updatePrecio)
        store.when('product').loaded($scope.loadPrecio)
        if($rootScope.Productos[0].Data && $rootScope.Productos[0].Data.state=="approved")
            $rootScope.cargandoCuenta=false;
        store.refresh();
        if(!$scope.initStore){
            store.refresh();
        }
        $scope.initStore=true
    }else {
        $rootScope.cargandoCuenta=false;
    }
    for(var i=0;i<$rootScope.Productos.length;i++)
        if($rootScope.Productos[i].Id==$rootScope.Usuario.IdSuscripcion)
            $rootScope.productoSeleccionado=$rootScope.Productos[i];
        if(!$rootScope.productoSeleccionad)
            $rootScope.productoSeleccionado=$rootScope.Productos[0];
}
            
$scope.updatePrecio=function(producto){
    if(producto.id!="application data"){
        //console.log(producto);
        for(var s=0;s<$rootScope.Productos.length;s++)
            if($rootScope.Productos[s].IdProducto==producto.id){
                $scope.$apply(function(){
                    $rootScope.Productos[s].Precio=producto.price;
                    $rootScope.Productos[s].Data=producto;
                })
            }
    }
}
            
$scope.loadPrecio=function(producto){
    //producto.verify()
    console.log(producto);
    $scope.$apply(function(){
        $scope.productosCargados++;
    })
    if($scope.productosCargados>=3)
        $scope.$apply(function(){
            $rootScope.cargandoCuenta=false;
        })
}
            
$scope.errorPrecio=function(err){
    console.log(err);
    if(err.code==6777010){
        $scope.$apply(function(){
            $rootScope.cargandoCuenta=false;
        })
        $rootScope.alert($rootScope.idioma.cuenta[17]+" "+$rootScope.productoSeleccionado.Nombre,$rootScope.idioma.cuenta[20].replace("NOMBRE",(window.device.platform=="iOS")?"Apple":"Play"),function(){})
        $rootScope.hideCargando()
    }
    if(err.code==6777019 && $rootScope.verPrecios)
        $scope.$apply(function(){
            $rootScope.muestraPrecPaq();
        })
        
}

$scope.initStore=false
$scope.productosCargados=0;
$rootScope.cargandoCuenta=false;
$scope.cargaProductosSQL=function(){
    $rootScope.cargandoCuenta=true;
    $http.get("https://www.virtual-guardian.com/api/tiposSuscripciones")
    .success(function(data){
        if(data[0].Id==1)data.shift();
        var Ids=[]
        $rootScope.Productos=data;
        if(window.store){
             store.verbosity=0;
            for(var i=0;i<$rootScope.Productos.length;i++){
                 store.register({id:$rootScope.Productos[i].IdProducto,alias: "Suscripción "+$rootScope.Productos[i].Nombre,type: store.PAID_SUBSCRIPTION});
            }
            store.validator=function(product,callback){
            callback(product)
            }
        }
    })
}
$scope.cargaProductosSQL();

$scope.revisaUsuario=function(){
    var arr=[];
    var t=[];
    if($rootScope.Usuario.NotEstados!="")t=$rootScope.Usuario.NotEstados.split(",");
    $rootScope.Usuario.Estados=[];
    for(var i=0,j=0; i<$scope.Estados.length;i++)
        if($rootScope.Usuario.NotEstados=="" )arr.push($rootScope.iOS?{Nombre:$scope.Estados[i].Nombre,Selected:true,Id:$scope.Estados[i].Id}:$scope.Estados[i]);
        else if($scope.Estados[i].Id==t[j]){
            if(j<t.length-1)j++;
            if($rootScope.iOS)arr.push({Nombre:$scope.Estados[i].Nombre,Selected:false,Id:$scope.Estados[i].Id});
        }else arr.push($rootScope.iOS?{Nombre:$scope.Estados[i].Nombre,Selected:true,Id:$scope.Estados[i].Id}:$scope.Estados[i]);
    $rootScope.Usuario.Estados=arr;
    
    var arr2=[];
    var t2=[];
    if($rootScope.Usuario.NotTipos!="")t2=$rootScope.Usuario.NotTipos.split(",");
    $rootScope.Usuario.Tipos=[];
    for(var i=0,j=0; i<$scope.TipoEventos.length;i++)
    if($rootScope.Usuario.NotTipos=="" )arr2.push($rootScope.iOS?{Nombre:$scope.TipoEventos[i].Nombre,Selected:true,Id:$scope.TipoEventos[i].Id}:$scope.TipoEventos[i]);
    else
        if( $scope.TipoEventos[i].Id==t2[j]){
            if(j<t2.length-1)j++;
            if($rootScope.iOS)arr2.push({Nombre:$scope.TipoEventos[i].Nombre,Selected:false,Id:$scope.TipoEventos[i].Id});
        }else arr2.push($rootScope.iOS?{Nombre:$scope.TipoEventos[i].Nombre,Selected:true,Id:$scope.TipoEventos[i].Id}:$scope.TipoEventos[i]);
    $rootScope.Usuario.Tipos=arr2;
}

/*
var filtros={
    Estado:true,
    Inicial:new Date("12-10-2015"),
    Final:new Date("12-10-2015"),
    Estados:[],
    Tipos:[]
}
window.localStorage.setArray("Filtros",filtros);
*/
$scope.slideTo=function(i){
    $scope.pantallas[i-1]=true;
    $ionicSlideBoxDelegate.slide(i-1,200)
    $timeout(function(){ 
    if($rootScope.tabInicial!=1)$scope.pantallas=[true,false,false,true];
    else $scope.pantallas=[false,false,false,false];
    $scope.pantallas[$ionicSlideBoxDelegate.currentIndex()]=true;
    
    switch(i){
        case 1:
        try{
             $rootScope.iniciaMapa();
        }catch(err){}
        break;
        case 2:
        
        $rootScope.notPendientes=0;
        window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
        if(!$rootScope.recorrido){
        var d=new Date();
        if($rootScope.notPendientes>0 || $scope.fechaNotRef==null || ((d.getTime()-$scope.fechaNotRef.getTime())/60000)==30){
            $scope.fechaNotRef=new Date();
            
            $rootScope.cargando=true;
            $rootScope.doRefreshNotification();
        }
        }
        break;
        case 3:
        var d=new Date();
        if($scope.fechaPerRef==null || ((d.getTime()-$scope.fechaPerRef.getTime())/60000)==30){
            $scope.fechaPerRef=new Date();
        $rootScope.cargando=true;
        $rootScope.getPersonas();
        }
        break;
        case 4:
        try{
        google.maps.event.trigger($rootScope.mapCarro, 'resize');
        }catch(err){}
        break;
    }
    },300);
    
    
}
$scope.slideHasChanged=function($index){
    var i=$index+1;
    $("#img_btn_1").attr("src","img/iconos/map.png");
    $("#img_btn_2").attr("src","img/iconos/tasks.png");
    $("#img_btn_3").attr("src","img/iconos/people.png");
    $("#img_btn_4").attr("src","img/iconos/car.png");
    $("#img_btn_"+i).attr("src",$("#img_btn_"+i).attr("src").substr(0,$("#img_btn_"+i).attr("src").length-4)+"2.png");
}
//$scope.filtrosheight = $("#home_ajustes_filtros").css('height', 'auto').height();
//$("#home_ajustes_filtros").css('height', '0px')
$scope.menuNotificaciones=false;
$scope.menuAplicacion=false;
$scope.opcionMenu=function(s){
if(!$("#home_ajustes_"+s).hasClass("collapsing")){
if(!$("#home_ajustes_"+s).hasClass("in")){
        $("#home_flecha_"+s).removeClass("ion-chevron-down")
        $("#home_flecha_"+s).addClass("ion-chevron-up")
    }else{
        $("#home_flecha_"+s).removeClass("ion-chevron-up")
        $("#home_flecha_"+s).addClass("ion-chevron-down")
}
switch(s){
case "aplicacion":
    $scope.menuAplicacion=!$scope.menuAplicacion;
break;
case "notificaciones":
    $scope.menuNotificaciones=!$scope.menuNotificaciones;
break;
case "filtros":
    $rootScope.filtros.Estado=!$rootScope.filtros.Estado;
break;
}
}


};

$rootScope.UsuarioTemporal=null;
$scope.toggleLeftSideMenu = function() {
$scope.menuNotificaciones=false;
$scope.menuAplicacion=false;
$("#home_flecha_aplicacion").removeClass("ion-chevron-up")
$("#home_flecha_aplicacion").addClass("ion-chevron-down")
$("#home_flecha_notificaciones").removeClass("ion-chevron-up")
$("#home_flecha_notificaciones").addClass("ion-chevron-down")
if(!$ionicSideMenuDelegate.isOpen()){
    
    $scope.revisaUsuario();
   $("#capa_menu").show();
   $("#capa_menu").animate({
       "opacity":"1"
   },200);
   
   $rootScope.UsuarioTemporal = jQuery.extend(true, {}, $rootScope.Usuario);
}else{
   $ionicSideMenuDelegate.toggleLeft(false);
   var sm=$scope.saveMenu()
   $("#capa_menu").animate({
       "opacity":"0"
   },200,function(){$("#capa_menu").hide();});
   if($scope.filtros.Estado){
   window.localStorage.setArray("Filtros",$scope.filtros);
   if(!sm)$rootScope.showEventos();
   }else {
       if(!sm && window.localStorage.getArray("Filtros") )$rootScope.showEventos();
   //window.localStorage.removeItem("Filtros");
   
   }
   if(sm)$rootScope.showEventos();
}
}

$scope.saveMenu=function(){
  if($rootScope.UsuarioTemporal.NotificacionesAuto==$rootScope.Usuario.NotificacionesAuto)delete $rootScope.UsuarioTemporal.NotificacionesAuto
   else $rootScope.UsuarioTemporal.NotificacionesAuto=$rootScope.Usuario.NotificacionesAuto;
   if($rootScope.UsuarioTemporal.NotificacionesEventos==$rootScope.Usuario.NotificacionesEventos)delete $rootScope.UsuarioTemporal.NotificacionesEventos
   else $rootScope.UsuarioTemporal.NotificacionesEventos=$rootScope.Usuario.NotificacionesEventos;
   if($rootScope.UsuarioTemporal.NotificacionesPersonas==$rootScope.Usuario.NotificacionesPersonas)delete $rootScope.UsuarioTemporal.NotificacionesPersonas
   else $rootScope.UsuarioTemporal.NotificacionesPersonas=$rootScope.Usuario.NotificacionesPersonas;
   if($rootScope.UsuarioTemporal.Periodo==$rootScope.Usuario.Periodo)delete $rootScope.UsuarioTemporal.Periodo
   else $rootScope.UsuarioTemporal.Periodo=$rootScope.Usuario.Periodo;
   if($rootScope.UsuarioTemporal.Rango==$rootScope.Usuario.Rango)delete $rootScope.UsuarioTemporal.Rango
   else $rootScope.UsuarioTemporal.Rango=$rootScope.Usuario.Rango;
   if($rootScope.UsuarioTemporal.RangoAuto==$rootScope.Usuario.RangoAuto)delete $rootScope.UsuarioTemporal.RangoAuto
   else $rootScope.UsuarioTemporal.RangoAuto=$rootScope.Usuario.RangoAuto;
   if($rootScope.UsuarioTemporal.RangoPersonal==$rootScope.Usuario.RangoPersonal)delete $rootScope.UsuarioTemporal.RangoPersonal
   else $rootScope.UsuarioTemporal.RangoPersonal=$rootScope.Usuario.RangoPersonal;
   if($rootScope.getTiposStr($rootScope.UsuarioTemporal)==$rootScope.getTiposStr($rootScope.Usuario))delete $rootScope.UsuarioTemporal.Tipos
   else $rootScope.UsuarioTemporal.Tipos=$rootScope.getNotTiposStr($rootScope.Usuario);
   if($rootScope.getEstadosStr($rootScope.UsuarioTemporal)==$rootScope.getEstadosStr($rootScope.Usuario))delete $rootScope.UsuarioTemporal.Estados
   else $rootScope.UsuarioTemporal.Estados=$rootScope.getNotEstadosStr($rootScope.Usuario);
   if($rootScope.UsuarioTemporal.Tiempo==$rootScope.Usuario.Tiempo)delete $rootScope.UsuarioTemporal.Tiempo
   else $rootScope.UsuarioTemporal.Tiempo=$rootScope.Usuario.Tiempo;
   delete $rootScope.UsuarioTemporal.Correo; 
   delete $rootScope.UsuarioTemporal.IdSuscripcion;
   delete $rootScope.UsuarioTemporal.RangoPersonas; 
   delete $rootScope.UsuarioTemporal.Suscripcion; 
   delete $rootScope.UsuarioTemporal.Vigente;
   delete $rootScope.UsuarioTemporal.NotEstados;
   delete $rootScope.UsuarioTemporal.NotTipos;
   delete $rootScope.UsuarioTemporal.Registro;
   delete $rootScope.UsuarioTemporal.Nuevo;
   delete $rootScope.UsuarioTemporal.Extras;
   delete $rootScope.UsuarioTemporal.Codigo;
   console.log($rootScope.UsuarioTemporal);
   if(Object.keys($rootScope.UsuarioTemporal).length>1){
       
       $http.post("https://www.virtual-guardian.com/api/ajustes/guarda",$rootScope.UsuarioTemporal)
       .success(function(data,status,header,config){
         window.localStorage.setArray("Usuario",$rootScope.Usuario);
        })
    .error(function(error,status,header,config){
        })
        return 1;
        
   }
   return 0;
}

$scope.cambiaPer=function(){
$rootScope.Usuario.Periodo=$rootScope.filtros.Periodo.Periodo;
}
$scope.cerrarSesion=function(){
    $scope.confirm($scope.idioma.menu[6],$scope.idioma.login[10],function(){
    $scope.showCargando($scope.idioma.login[9]);
        
    $http.get("https://www.virtual-guardian.com/api/logout/"+window.localStorage.getArray("Usuario").Id)
    .success(function(data,status,header,config){	
        $scope.hideCargando();
        $("#capa_menu").css("opacity","0");
        $("#capa_menu").hide();
        if(data){
            $rootScope.cleanMemory();
            $location.path('/login');
            $rootScope.unregister();
        }
        })
    .error(function(error,status,header,config){
        
        })
    });
}
$scope.cierraS=function(){
    $scope.showCargando($scope.idioma.login[9]);
    $scope.hideCargando();
    $("#capa_menu").css("opacity","0");
    $("#capa_menu").hide();
    $rootScope.cleanMemory();
    $location.path('/login');
    $rootScope.unregister();
}
$rootScope.abrePaquetes=function(){
    $scope.abreAjustesCuenta()
    //window.open("https://www.virtual-guardian.com/app.php#suscripciones","_system")
}
$rootScope.nuevaContra={uno:"",dos:""};
$rootScope.cambiarContra=function(){
    $rootScope.nuevaContra={uno:"",dos:""};
    $(".modal-backdrop").addClass("unclose");
    $scope.confirm($rootScope.idioma.cuenta[3],"<div style='text-align:center;margin-bottom:1vh'>"+$rootScope.idioma.cuenta[8]+"</div><input class='input_prompt' ng-model='nuevaContra.uno' type='password' placeholder='"+$rootScope.idioma.cuenta[7]+"' ng-keydown='enterkey($event)'  ng-focus='showCover()' ng-blur='closekey()'><input ng-model='nuevaContra.dos' class='input_prompt' type='password' placeholder='"+$rootScope.idioma.registro[5]+"' ng-keydown='enterkey($event)'  ng-focus='showCover()' ng-blur='closekey()' style='margin-top:1vh;'><div class='popup-buttons popup-visible' style='padding-left:0px;padding-right:0px;padding-bottom:0px'><button  class='button ng-binding button-default' ng-click='cancelarCambioContra()'>Cancelar</button><button class='button button-positive' ng-click='aceptarCambioContra()'>Aceptar</button></div>",function(){
        $(".modal-backdrop").removeClass("unclose");
        },$rootScope.idioma.general[2],$rootScope.idioma.general[6],function(){return false});
}
$rootScope.aceptarCambioContra=function(){
    if($rootScope.nuevaContra.uno=="" || $rootScope.nuevaContra.uno!=$rootScope.nuevaContra.dos)$rootScope.alert($rootScope.idioma.cuenta[3],$scope.idioma.registro[12],function(){});
    else if(!$scope.validac($rootScope.nuevaContra.uno)) $rootScope.alert($rootScope.idioma.cuenta[3],$scope.idioma.registro[11],function(){});
    else {
        $rootScope.showCargando($rootScope.idioma.general[33]);
        $http.post("https://www.virtual-guardian.com/api/usuario/contrasena",{
            Id:$rootScope.Usuario.Id,
            Contra:$rootScope.nuevaContra.uno,
            })
    .success(function(data,status,header,config){
        $rootScope.hideCargando();
        
        $rootScope.alert($rootScope.idioma.cuenta[3],$scope.idioma.cuenta[9],function(){
        $scope.confirmPopup.close();
        $(".popup-buttons").removeClass("ng-hide");
        });
        })
    .error(function(error,status,header,config){
        $rootScope.alert($rootScope.idioma.cuenta[3],$scope.idioma.registro[16],function(){});
        })
    }
}
$rootScope.cancelarCambioContra=function(){
    $scope.confirmPopup.close();
}

$rootScope.isVigente=function(){
    $http.get("https://www.virtual-guardian.com/api/perfil/"+window.localStorage.getArray("Usuario").Id)
    .success(function(data,status,header,config){
        $rootScope.Update=new Date();
        if(data.Registro!=$rootScope.Usuario.Registro){
            $scope.alert($scope.idioma.general[23],$scope.idioma.general[24],function(){
            $scope.cierraS();
            });
        }else{
            if(window.device.platform=="Android")$rootScope.registraAndroid();	
            if(window.device.platform=="iOS")$rootScope.registraiOS();
            window.localStorage.setArray("Usuario",data);
            $rootScope.Usuario=data;
            
            if($rootScope.Usuario.IdSuscripcion==1){
            window.localStorage.removeItem("Filtros");
            window.localStorage.removeItem("Auto");
            /*var d1=new Date();
            var d2=new Date();
            d2.setDate(d2.getDate()-$rootScope.Usuario.Periodo);
            $rootScope.filtros.Inicial=d2;
            $rootScope.filtros.Final=d1;
            window.localStorage.setArray("Filtros",$rootScope.filtros);*/
            }
        if(data.Cambio=="0"){
            $scope.confirm($scope.idioma.general[11],$scope.idioma.general[12],function(){
            //ENVIA A PAGINA A VER PAQUETES
            $rootScope.abrePaquetes();
            },$scope.idioma.general[13],$scope.idioma.general[14]);
        }
        }
        
        
    })
    .error(function(error,status,header,config){
        
        })
}


$scope.Conexion=function(i,fun){
    i=i || 0;
    fun = fun || function(){};
    var is=$cordovaNetwork.isOnline();
    if(is)return true;
    else{
        if(i)$rootScope.alert($scope.idioma.general[3],$scope.idioma.general[4],function(){
            
            fun();
            });
            $rootScope.cargando=false;
         return false;
    }
}
$scope.cambia_rango=function(value){
    $scope.prompt($scope.idioma.menu[12],$scope.idioma.menu[19],"number",$scope.idioma.menu[12].substring(0,$scope.idioma.menu[12].length-1).toLowerCase(),function(val){
        if(val>=10 && val<=16000){
            $rootScope.Usuario.Rango=val;
        }else{
            $scope.alert($scope.idioma.menu[12],$scope.idioma.menu[20],function(){})
        }
        
        },$rootScope.Usuario.Rango);
}
$scope.cambia_rango_personal=function(value){
    if($rootScope.Usuario.NotificacionesEventos==1)
    $scope.prompt($scope.idioma.menu[18],$scope.idioma.menu[21],"number",$scope.idioma.menu[18].substring(0,$scope.idioma.menu[18].length-1).toLowerCase(),function(val){
        if(val>=10 && val<=5000){
            $rootScope.Usuario.RangoPersonal=val;
        }else{
            $scope.alert($scope.idioma.menu[18],$scope.idioma.menu[22],function(){})
        }
        
        },$rootScope.Usuario.RangoPersonal);
}
$scope.cambia_rango_auto=function(value){
if($rootScope.Usuario.NotificacionesAuto==1 && $rootScope.Usuario.NotificacionesEventos==1)
    $scope.prompt($scope.idioma.menu[17],$scope.idioma.menu[23],"number",$scope.idioma.menu[17].substring(0,$scope.idioma.menu[17].length-1).toLowerCase(),function(val){
        if(val>=10 && val<=5000){
            $rootScope.Usuario.RangoAuto=val;
        }else{
            $scope.alert($scope.idioma.menu[17],$scope.idioma.menu[22],function(){})
        }
        
        },$rootScope.Usuario.RangoAuto);
}
$scope.cambia_tiempo=function(){
    if($rootScope.Usuario.NotificacionesEventos==1)
    $scope.prompt($scope.idioma.menu[24],$scope.idioma.menu[25],"number",$scope.idioma.menu[24].substring(0,$scope.idioma.menu[24].length-1).toLowerCase(),function(val){
        if(val>=10 && val<=180){
            $rootScope.Usuario.Tiempo=val;
        }else{
            $scope.alert($scope.idioma.menu[24],$scope.idioma.menu[26],function(){})
        }
        
        },$rootScope.Usuario.Tiempo);
}
$scope.abreModalEstados=function(){
    
    $scope.openSelect($rootScope.Usuario.Estados,true);
}
$scope.abreModalTipos=function(){
    
    $scope.openSelect($rootScope.Usuario.Tipos,true);
}
$scope.abreFiltrosEstados=function(){
    $scope.openSelect($rootScope.filtros.Estados,true);
}
$scope.abreFiltrosTipos=function(){
    
    $scope.openSelect($rootScope.filtros.Tipos,true);
    
}
$scope.abrePeriodo=function(){
    
    
        $scope.Usuario.Periodo=parseInt($scope.Usuario.Periodo);
        $scope.openSelect($scope.Periodos,false);
            
}
$rootScope.TipPop=false;
$rootScope.muestraTip=function(tip){
    $rootScope.tipImg="https://www.virtual-guardian.com/documentos/notificaciones/"+tip.IdNotificacion+".png";
    $rootScope.notificacionTip=true;
    $rootScope.TipPop=true;
}
$rootScope.cierraTipPop=function(){
    $rootScope.TipPop=false;
    $rootScope.notificacionTip=false;
}
$scope.ro=function(){
    console.log($rootScope.Usuario.Periodo);
}
$scope.abreDate=function(val){

    if($rootScope.iOS && !$rootScope.ipad && $rootScope.Usuario.IdSuscripcion>1){
        if(val==1){
        var options = {
          date: $rootScope.filtros.Inicial,
          mode: 'date',
          maxDate:$rootScope.filtros.Final,
        doneButtonLabel:$rootScope.idioma.general[2],
        cancelButtonLabel:$rootScope.idioma.general[6]
        };
        // calling show() function with options and a result handler
        datePicker.show(options, function(date){
         if(date)$rootScope.filtros.Inicial=date;
        });
        }else{
            var options = {
          date: $rootScope.filtros.Final,
          mode: 'date',
          maxDate: new Date(),
          minDate: $rootScope.filtros.Inicial,
        doneButtonLabel:$rootScope.idioma.general[2],
        cancelButtonLabel:$rootScope.idioma.general[6]
        };
        // calling show() function with options and a result handler
        datePicker.show(options, function(date){
        if(date) $rootScope.filtros.Final=date;  
        });
        }
    }
        if($rootScope.Usuario.IdSuscripcion==1){
        $scope.confirm($rootScope.idioma.general[23],$rootScope.idioma.general[34],function(){
                       //ENVIA A PAGINA A VER PAQUETES
                       $rootScope.abrePaquetes();
                       },$scope.idioma.general[13],$scope.idioma.general[14]);
        }
    
}
        $scope.cambioFech=function(){
        if(!$rootScope.filtros.Final)$rootScope.filtros.Final=new Date();
        if(!$rootScope.filtros.Inicial){
        var d=new Date();
        d.setDate(d.getDate()-$rootScope.Usuario.Periodo);
        $rootScope.filtros.Inicial=d;
        }
        }
$scope.abreTerminos=function(){
    
    $scope.openTerminos("pantallas/terminos.html");
}
$scope.abreInfor=function(){
    var template='<div style=""><b>© Virtual Guardian 2015</b></div>'+
           ' <div style="margin-top: 3vh;">'+$rootScope.idioma.general[25]+'</div>'+
            '<div style=";margin-top: 3vh;">'+$rootScope.idioma.general[26]+'</div>'
    $scope.popup($rootScope.idioma.general[27]+$rootScope.version,template,function(){})
}
        $scope.abreHelp=function(){
        /*var template=' <div style="">'+$rootScope.idioma.general[30]+'</div>'+
        '<div style=";margin-top: 3vh;"><b>'+$rootScope.idioma.general[31]+'</b></div>'
        $scope.popup($rootScope.idioma.menu[27],template,function(){})*/
        
        $scope.confirm($rootScope.idioma.menu[27],$rootScope.idioma.general[32],function(){
                          $scope.toggleLeftSideMenu();
                          $rootScope.startRecorrido(0);
        });
        }

}).controller("db",function($scope,$rootScope,$http,$cordovaSQLite,$cordovaNetwork,$timeout){

$rootScope.inicializaBaseLocal=function(){
          if($rootScope.iOS)$rootScope.database = window.sqlitePlugin.openDatabase({name: "Virtual.db", location:1});
          else $rootScope.database = window.sqlitePlugin.openDatabase({name: "Virtual.db", androidDatabaseImplementation: 2,androidLockWorkaround: 1});
          $rootScope.sqlQuery("CREATE TABLE IF NOT EXISTS EVENTOS (IdEvento integer primary key, IdAsunto integer, Latitud real,Longitud real, Asunto text, Direccion text, IdEstado integer,Subtitulo text,Fecha integer,Municipio text, Colonia text, Calles text,FechaScreen text,Hora text)",function(res){
                              
            });
        
}
          
          $rootScope.sqlInsertEvento=function(event){
              if( window.sqlitePlugin){
          var d=new Date(event.Fecha);
          var val=event.IdEvento+","+event.IdAsunto+","+event.Latitud+","+event.Longitud+","+d.getTime()+","+event.IdEstado;
            $rootScope.sqlQuery("INSERT OR REPLACE INTO EVENTOS(IdEvento,IdAsunto,Latitud,Longitud,Fecha,IdEstado) VALUES("+val+")",function(res){
                                delete event;
            });
              }
          }
          $rootScope.sqlSaveExtras=function(event,id,newone){
              if( window.sqlitePlugin)
          if(newone)$rootScope.sqlQuery("INSERT INTO EVENTOS (Asunto,Subtitulo,Direccion,Municipio,FechaScreen,Hora,IdEvento) VALUES('"+event.Asunto+"','"+event.Subtitulo+"','"+event.Direccion+"','"+event.Municipio+"','"+event.Fecha+"','"+event.Hora+"','"+id+"')",function(res){
                                        
                                        });
          else $rootScope.sqlQuery("UPDATE EVENTOS SET Asunto='"+event.Asunto+"',Subtitulo='"+event.Subtitulo+"',Direccion='"+event.Direccion+"',Municipio='"+event.Municipio+"',FechaScreen='"+event.Fecha+"',Hora='"+event.Hora+"' WHERE IdEvento="+id,function(res){
                              
                });
          
          }
          $rootScope.sqlGetEventos=function(Latitud,Longitud,FechaI,FechaF,Radio,Estados,Tipos,callback){
              if( window.sqlitePlugin){
          var arr=[];
          var st="";
          var tp="";
          var rd="";
          var fi=new Date(FechaI.toString());
          var ff=new Date(FechaF.toString());
          fi.setDate(fi.getDate()-1);
          if(Estados!="")st=" AND IdEstado IN ("+Estados+") ";
          if(Tipos!="")tp=" AND IdAsunto IN ("+Tipos+") ";
          if(Radio>0){
          var R=6372.795477598;
          var maxLat=Latitud+ $scope.rad2deg(Radio/R);
          var minLat=Latitud- $scope.rad2deg(Radio/R);
          var maxLon=Longitud + $scope.rad2deg(Radio/R/Math.cos($scope.deg2rad(Latitud)))
          var minLon=Longitud - $scope.rad2deg(Radio/R/Math.cos($scope.deg2rad(Latitud)))
          rd=" AND (Latitud BETWEEN "+minLat+" AND "+maxLat+") AND ( Longitud BETWEEN "+minLon+" AND "+maxLon+") "
          }
          var query="SELECT IdEvento,IdAsunto,Latitud,Longitud FROM EVENTOS WHERE ( Fecha BETWEEN "+fi.getTime()+" AND "+ff.getTime()+" )"+st+tp+rd;
          
          $rootScope.sqlQuery(query,function(res){
                              var ids=[];
                              for(var i=0;i<res.rows.length;i++){
                              $rootScope.Eventos.push(res.rows.item(i));
                              ids.push(res.rows.item(i).IdEvento);
                              }
                              callback(ids.join(","));
                              $rootScope.muestraEventos();
                              })
              }else callback("");
          }
         $rootScope.sqlGetExtras=function(id,callback){
          
          if( window.sqlitePlugin){
          $rootScope.sqlQuery("SELECT IdEvento,Asunto,Subtitulo,Direccion,Municipio,FechaScreen as Fecha,Hora FROM EVENTOS WHERE IdEvento="+id,function(res){
                              callback(res.rows.item(0));
                              
                            })
          }else callback(null)

          }
$rootScope.sqlQuery=function(query,funcion,values){
          values=values || [];
          funcion=funcion || function(){};
          $cordovaSQLite.execute($rootScope.database, query, values).then(function(res) {
            funcion(res);
        }, function (err) {
        funcion(err);
    });
    }
$scope.verificaHistorial=function(){
    //problema en updatehistorial
    /*
    if( window.sqlitePlugin)
        if(((new Date()).getTime()-$rootScope.UpdateHistorial)/86400000>=10)
         if(parseInt($rootScope.Usuario.IdSuscripcion)>1)
          if(!window.localStorage.getItem("AHistorial")){
                if($cordovaNetwork.getNetwork().toLowerCase().indexOf("wifi")>=0){
                            $rootScope.UpdateHistorial=(new Date()).getTime();
                            window.localStorage.setItem("UpdateHistorial",$rootScope.UpdateHistorial);
                    $scope.confirm($rootScope.idioma.general[7],$rootScope.idioma.general[8],function(){
                        $rootScope.showCargando($rootScope.idioma.general[9]);
                        $scope.getHistorial();
                    })
            }
        }
         */
}


$scope.getHistorial=function(){
          var d=new Date();
          var d2=new Date();
          d2.setFullYear(d2.getFullYear()-2);
    $http.post("https://www.virtual-guardian.com/api/historial",{
            FechaI:"2010-01-01",
            FechaF:""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
            Estados:"",
            Asuntos:"",
            IdEvento:0
            })
    .success(function(data,status,header,config){
            var f=0;
             var d=[];
             console.log("TAMAÑO: "+data.length)
        for(var i=0;i<data.length;i++){
            var arr="";
                if($rootScope.iOS) arr = "("+($.map(JSON.parse(data[i]), function(el) { return el; })).join(",")+")";
                else arr = ($.map(JSON.parse(data[i]), function(el) { return el; })).join(",");
                d.push(arr);
        }
                
                var sql=""
                if($rootScope.iOS)sql="INSERT OR REPLACE INTO EVENTOS(IdEvento,IdAsunto,Latitud,Longitud,Fecha,IdEstado) VALUES"+d.join(",");
                else sql="MULTIINSERT OR REPLACE INTO EVENTOS(IdEvento,IdAsunto,Latitud,Longitud,Fecha,IdEstado) VALUES(?,?,?,?,?,?):"+d.join(":")
                
                 $cordovaSQLite.execute($rootScope.database, sql, [])
             .then(function(res){
                   $rootScope.hideCargando();
                   window.localStorage.setItem("AHistorial",1);
                },function(){
                   $rootScope.hideCargando();
                   })
             
             
        })
    .error(function(error,status,header,config){
        console.log(error);
        })
}
          $scope.deg2rad = function(degrees) {
          return degrees * Math.PI / 180;
          };
          
          // Converts from radians to degrees.
          $scope.rad2deg = function(radians) {
          return radians * 180 / Math.PI;
          };

$scope.buscaJson=function(js,key,str){
    for(var i=0; i<js.length;i++){
        if(js[i][key]==str)return js[i][key]
    }
    return null;
}




})
.controller("menu",function($scope,$location,$ionicSlideBoxDelegate,$http,$rootScope,$ionicSideMenuDelegate,$timeout,$cordovaNetwork){


})