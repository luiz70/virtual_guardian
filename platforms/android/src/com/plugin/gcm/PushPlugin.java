package com.plugin.gcm;

import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;

import com.google.android.gcm.GCMRegistrar;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.List;
import java.util.Locale;

/**
 * @author awysocki
 */

public class PushPlugin extends CordovaPlugin {
	public static final String TAG = "PushPlugin";

	public static final String REGISTER = "register";
	public static final String UNREGISTER = "unregister";
	public static final String CAR = "carLocation";
	public static final String EXIT = "exit";

	private static CordovaWebView gWebView;
	private static String gECB;
	private static String gSenderID;
	private static Bundle gCachedExtras = null;
    private static boolean gForeground = false;

	/**
	 * Gets the application context from cordova's main activity.
	 * @return the application context
	 */
	private Context getApplicationContext() {
		return this.cordova.getActivity().getApplicationContext();
	}

	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {

		boolean result = false;

		Log.v(TAG, "execute: action=" + action);

		if (REGISTER.equals(action)) {
			
			Log.v(TAG, "execute: data=" + data.toString());

			try {
				JSONObject jo = data.getJSONObject(0);

				gWebView = this.webView;
				Log.v(TAG, "execute: jo=" + jo.toString());

				gECB = (String) jo.get("ecb");
				gSenderID = (String) jo.get("senderID");

				Log.v(TAG, "execute: ECB=" + gECB + " senderID=" + gSenderID);

				GCMRegistrar.register(getApplicationContext(), gSenderID);
				SharedPreferences prefs = getApplicationContext().getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
				prefs.edit().putString("Registered", "1").apply();
				result = true;
				callbackContext.success();
				
			} catch (JSONException e) {
				Log.e(TAG, "execute: Got JSON Exception " + e.getMessage());
				result = false;
				callbackContext.error(e.getMessage());
			}

			if ( gCachedExtras != null) {
				Log.v(TAG, "sending cached extras");
				sendExtras(gCachedExtras);
				gCachedExtras = null;
			}

		} else if (UNREGISTER.equals(action)) {

			GCMRegistrar.unregister(getApplicationContext());
			SharedPreferences prefs = getApplicationContext().getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
			prefs.edit().putString("Registered", "0").apply();
			Log.v(TAG, "UNREGISTER");
			result = true;
			callbackContext.success();
		} else if (CAR.equals(action)) {

			try {
				JSONObject jo = data.getJSONObject(0);

				gWebView = this.webView;
				String Estatus = (String) jo.get("Estatus");
				String Latitud = (String) jo.get("Latitud");
				String Longitud = (String) jo.get("Longitud");
				SharedPreferences prefs = getApplicationContext().getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
				if(Estatus.equals("1")){
				prefs.edit().putString("Latitud", Latitud).apply();
				prefs.edit().putString("Longitud", Longitud).apply();
				}else if(Estatus.equals("0")){
				prefs.edit().putString("Latitud","").apply();
				prefs.edit().putString("Longitud","").apply();
				}
				//GCMRegistrar.register(getApplicationContext(), gSenderID);
				result = true;
				callbackContext.success();
			} catch (JSONException e) {
				
				result = false;
				callbackContext.error(e.getMessage());
			}

		}else {
			result = false;
			Log.e(TAG, "Invalid action : " + action);
			callbackContext.error("Invalid action : " + action);
		}

		return result;
	}

	/*
	 * Sends a json object to the client as parameter to a method which is defined in gECB.
	 */
	public static void sendJavascript(JSONObject _json) {
		String _d = "javascript:" + gECB + "(" + _json.toString() + ")";
		Log.v(TAG, "sendJavascript: " + _d);

		if (gECB != null && gWebView != null) {
			gWebView.sendJavascript(_d);
		}
	}

	/*
	 * Sends the pushbundle extras to the client application.
	 * If the client application isn't currently active, it is cached for later processing.
	 */
	public static void sendExtras(Bundle extras)
	{
		if (extras != null) {
			
			if (gECB != null && gWebView != null) {
				sendJavascript(convertBundleToJson(extras));
			} else {
				Log.v(TAG, "sendExtras: caching extras to send at a later time.");
				gCachedExtras = extras;
			}
		}
	}

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        gForeground = true;
        List<Bundle> Notificaciones= GCMIntentService.clean(0);
    }

	@Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        gForeground = false;
        final NotificationManager notificationManager = (NotificationManager) cordova.getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
       //List<Bundle> Notificaciones= GCMIntentService.clean(0);
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        gForeground = true;
       List<Bundle> Notificaciones= GCMIntentService.clean(0);
       Bundle extras= new Bundle();
       extras.putBoolean("foreground", false);
       extras.putBoolean("coldstart", false);
       extras.putBoolean("resumed", false);
       sendExtras(extras);
        
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        gForeground = false;
		gECB = null;
		gWebView = null;
		Log.d("FORE",""+gForeground);
		//List<Bundle> Notificaciones= GCMIntentService.clean(0);
    }

    /*
     * serializes a bundle to JSON.
     */
    private static JSONObject convertBundleToJson(Bundle extras)
    {
		try
		{
			JSONObject json;
			json = new JSONObject().put("event", "message");
			json.put("foreground", extras.getBoolean("foreground"));
			json.put("coldstart", extras.getBoolean("coldstart"));
			List<Bundle> Notificaciones= GCMIntentService.clean(1);
			if(Notificaciones!=null)json.put("notificaciones", Notificaciones.size());
			if(Notificaciones!=null)
			for(int i=0; i<Notificaciones.size();i++){
			JSONObject jsondata = new JSONObject();
			Iterator<String> it = Notificaciones.get(i).keySet().iterator();
			//mando las notificaciones acumuladas
			
			while (it.hasNext())
			{
				String key = it.next();
				Object value = Notificaciones.get(i).get(key);

				// System data from Android
				
				if (key.equals("from") || key.equals("collapse_key"))
				{
					jsondata.put(key, value);
				}
				else
				{
					// Maintain backwards compatibility
					if (key.equals("message") || key.equals("msgcnt") || key.equals("soundname"))
					{
						jsondata.put(key, value);
					}

					if ( value instanceof String ) {
					// Try to figure out if the value is another JSON object

						String strValue = (String)value;
						if (strValue.startsWith("{")) {
							try {
								JSONObject json2 = new JSONObject(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e) {
								jsondata.put(key, value);
							}
							// Try to figure out if the value is another JSON array
						}
						else if (strValue.startsWith("["))
						{
							try
							{
								JSONArray json2 = new JSONArray(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e)
							{
								jsondata.put(key, value);
							}
						}
						else
						{
							jsondata.put(key, value);
						}
					}
				}
			} // while
			json.put("Notif"+i, jsondata);
			}
			
			Log.v(TAG, "extrasToJSON: " + json.toString());

			return json;
		}
		catch( JSONException e)
		{
			Log.e(TAG, "extrasToJSON: JSON exception");
		}
		return null;
    }
/*
 private static JSONObject convertBundleToJson(Bundle extras)
    {
		try
		{
			JSONObject json;
			json = new JSONObject().put("event", "message");
			json.put("Cantidad", ""+GCMIntentService.clean().size());
			JSONObject jsondata = new JSONObject();
			Iterator<String> it = extras.keySet().iterator();
			//mando las notificaciones acumuladas
			
			while (it.hasNext())
			{
				String key = it.next();
				Object value = extras.get(key);

				// System data from Android
				if (key.equals("from") || key.equals("collapse_key"))
				{
					json.put(key, value);
				}
				else if (key.equals("foreground"))
				{
					json.put(key, extras.getBoolean("foreground"));
				}
				else if (key.equals("coldstart"))
				{
					json.put(key, extras.getBoolean("coldstart"));
				}
				else
				{
					// Maintain backwards compatibility
					if (key.equals("message") || key.equals("msgcnt") || key.equals("soundname"))
					{
						json.put(key, value);
					}

					if ( value instanceof String ) {
					// Try to figure out if the value is another JSON object

						String strValue = (String)value;
						if (strValue.startsWith("{")) {
							try {
								JSONObject json2 = new JSONObject(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e) {
								jsondata.put(key, value);
							}
							// Try to figure out if the value is another JSON array
						}
						else if (strValue.startsWith("["))
						{
							try
							{
								JSONArray json2 = new JSONArray(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e)
							{
								jsondata.put(key, value);
							}
						}
						else
						{
							jsondata.put(key, value);
						}
					}
				}
			} // while
			json.put("payload", jsondata);

			Log.v(TAG, "extrasToJSON: " + json.toString());

			return json;
		}
		catch( JSONException e)
		{
			Log.e(TAG, "extrasToJSON: JSON exception");
		}
		return null;
    }

 * */
    public static boolean isInForeground()
    {
      return gForeground;
    }

    public static boolean isActive()
    {
    	return gWebView != null;
    }
}
