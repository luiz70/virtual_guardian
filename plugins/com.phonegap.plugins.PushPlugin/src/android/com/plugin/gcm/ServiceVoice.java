package com.plugin.gcm;

import android.app.Activity;
import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.RemoteInput;
import android.util.Log;

public class ServiceVoice extends IntentService{
	private static final String EXTRA_VOICE_REPLY = "extra_voice_reply";
	
	public ServiceVoice()
	{
		super("ServiceGeneral");
		
	}
	
	private CharSequence getMessageText(Intent intent) {
	    Bundle remoteInput = RemoteInput.getResultsFromIntent(intent);
	    if (remoteInput != null) {
	        return remoteInput.getCharSequence(EXTRA_VOICE_REPLY);
	    }
	    return null;
	}

	@Override
	protected void onHandleIntent(Intent intent) {
		// TODO Auto-generated method stub
				Log.d("INICIALIZAACT","ACTION");
				//boolean isPushPluginActive = PushPlugin.isActive();
				CharSequence s= getMessageText(intent);
				Log.d("TEXTO",s.toString());
		
	}
}
