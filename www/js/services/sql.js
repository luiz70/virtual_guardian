angular.module('starter.services')
.factory('sql',function($cordovaSQLite,socket,$timeout){
	var db=null
	var inicializa=function(){
		
		try{
			db=$cordovaSQLite.openDB({ name:"VirtualG.db", location:1, bgType: 1 });
		}catch(err){
			db = window.openDatabase("VirtualG", "1.0", "VirtualG", 100000000)
		}
		$cordovaSQLite.execute(db, "DROP TABLE EVENTOS")
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS EVENTOS (IdEvento integer primary key, Asunto integer, Latitud real,Longitud real, Estado integer,Fecha integer,Municipio text, Colonia text, Calles text,Hora text,Edicion integer)")
		.then(function(res){
			console.log(res)
		})
		
	}
	
	$timeout(function(){
		console.log(2);
		socket.getSocket().emit("getAllEventos")
		socket.getSocket().on("getAllEventos",function(data){
		console.log(data)
		})
	},1000)
 /* $scope.execute = function() {
    var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
      console.log("insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
  };*/
	return {
		inicializa:function(){
			if(!db)
			inicializa();
		}
	}
})