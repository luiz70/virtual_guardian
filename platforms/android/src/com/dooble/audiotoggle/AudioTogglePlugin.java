package com.dooble.audiotoggle;

import java.io.IOException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.app.virtualguardian.R;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.media.MediaPlayer.OnPreparedListener;
import android.util.Log;

public class AudioTogglePlugin extends CordovaPlugin {
	public static final String ACTION_SET_AUDIO_MODE = "setAudioMode";
	private MediaPlayer mp;
	@Override
	public boolean execute(String action, JSONArray args, 
			CallbackContext callbackContext) throws JSONException {	
		if (action.equals(ACTION_SET_AUDIO_MODE)) {
			if (!setAudioMode(args.getString(0))) {
				callbackContext.error("Invalid audio mode");
				return false;
			}
			
			return true;
		}else if (action.equals("playTone")){
			playTone();
		}else if(action.equals("playBye")){
			playBye();
		}else if(action.equals("stopTone")){
			stopTone();
			}
		
		callbackContext.error("Invalid action");
		return false;
	}
	public boolean playTone(){
		Context context = webView.getContext();
		mp = MediaPlayer.create(context, R.raw.calltone);
		   mp.setOnCompletionListener(new OnCompletionListener() {

               @Override
               public void onCompletion(MediaPlayer mp) {
                   // TODO Auto-generated method stub
                   mp.reset();
                   mp.release();
                   mp=null;
               }
		   });
		   mp.setOnPreparedListener(new OnPreparedListener(){
			   @Override
			   public void onPrepared(MediaPlayer mp){
			   mp.start();
			   }
		   });
		   try {
			mp.prepare();
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		   
		   
		
	return true;
	}
	public boolean playBye(){
		Context context = webView.getContext();
		MediaPlayer mp2 = MediaPlayer.create(context, R.raw.beep);
		   mp2.setOnCompletionListener(new OnCompletionListener() {

               @Override
               public void onCompletion(MediaPlayer mp2) {
                   // TODO Auto-generated method stub

            	   mp2.reset();
                   mp2.release();
                   mp2=null;
               }
		   });
		   mp2.setOnPreparedListener(new OnPreparedListener(){
			   @Override
			   public void onPrepared(MediaPlayer mp2){
			   mp2.start();
			   }
		   });
		   try {
			mp2.prepare();
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	return true;
	}
	public boolean stopTone(){
		mp.stop();
		mp.reset();
        mp.release();
        mp=null;
	return true;
	}
	public boolean setAudioMode(String mode) {
	    Context context = webView.getContext();
	    AudioManager audioManager = 
	    	(AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
	    
	    if (mode.equals("earpiece")) {
	    	audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
	    	audioManager.setSpeakerphoneOn(false);
	        return true;
	    } else if (mode.equals("speaker")) {        
	    	audioManager.setMode(AudioManager.STREAM_MUSIC);
	    	audioManager.setSpeakerphoneOn(true);
	        return true;
	    }
	    
	    return false;
	}

}
