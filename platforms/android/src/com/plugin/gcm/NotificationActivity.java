package com.plugin.gcm;

import java.util.List;
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

	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
	       
	        mandaAviso();
		finish();

	}
	private void mandaAviso(){
		Bundle extras = getIntent().getExtras();
		Bundle originalExtras = extras.getBundle("pushBundle");
		//Log.d("",originalExtras.getString("Tipo"));
		 NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
	        manager.cancel(10);
	        boolean eliminado=GCMIntentService.elimina(0);
	}
	

}