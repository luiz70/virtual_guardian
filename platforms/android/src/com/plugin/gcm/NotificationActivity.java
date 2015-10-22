package com.plugin.gcm;

import java.util.List;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.emitter.Emitter.Listener;
import com.github.nkzawa.socketio.client.Ack;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.IO.Options;
import com.github.nkzawa.socketio.client.Socket;

import java.util.logging.Logger;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

public class NotificationActivity extends Activity {
	
	private Socket socket;
	private Bundle data;
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
	       
	        mandaAviso();
		finish();

	}
	private void mandaAviso(){
		
		Log.d("INTENT","CANCEL");
		Bundle extras = getIntent().getExtras();
		Bundle originalExtras = extras.getBundle("pushBundle");
		data=originalExtras;
		//Log.d("",originalExtras.getString("Tipo"));
		 NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
	        manager.cancel(10);
	        boolean eliminado=GCMIntentService.elimina(0);
	        conect();
	}
	public void conect(){
		try{
        	
			Options opts = new IO.Options();
        	opts.port = 8303;
        	opts.forceNew = false;
        	socket = IO.socket("http://www.virtual-guardian.com:8303",opts);
        	socket.disconnect();
        	socket.connect();
        	socket.off(Socket.EVENT_CONNECT, onConnect); 
        	socket.on(Socket.EVENT_CONNECT, onConnect);
    		
        	
        } catch (Exception e) {
        	Log.e("SOCKET", "Conextion expection", e);
        }
	}
	private Listener onConnect = new Emitter.Listener() {
		@Override
		public void call(Object... args) {       	  
			Log.d("SOCKET","CONNECTED");
			socket.emit("colgar_movil", data.getString("IdUsuario"));
			socket.disconnect();
			socket.close();
		}
	};
	

}