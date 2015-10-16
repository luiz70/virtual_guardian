package com.plugin.gcm;

import io.socket.* ;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.app.NotificationCompat.WearableExtender;
import android.support.v4.app.RemoteInput;
import android.text.Html;
import android.util.Log;
import br.com.kots.mob.complex.preferences.ComplexPreferences;

import com.app.virtualguardian.R;
import com.google.android.gcm.GCMBaseIntentService;
import com.grum.geocalc.*;

@SuppressLint("NewApi")
public class GCMIntentService extends GCMBaseIntentService {

	private static final String TAG = "GCMIntentService";
	private static List<Bundle> Notificaciones = new ArrayList<Bundle>();
	private static Bundle NotificacionMision =null;
	private static List<Bundle> NotifHist = new ArrayList<Bundle>();
	private static final String EXTRA_VOICE_REPLY = "extra_voice_reply";
	private static final String GROUP_KEY_EMAILS = "group_key_emails";
	private String latitute;
	private boolean Llamada=false;
	  private String longitude;
	  private String Idioma;
	  private LocationManager locationManager;
	  private String provider;
	  private static NotificationManagerCompat notificationManager;
	
	public GCMIntentService() {
		super("GCMIntentService");
	}
	public static List<Bundle> clean(int v){
		//if(Notificaciones.size()>0){
		List<Bundle> temp = Notificaciones;
		NotifHist=Notificaciones;
		if(v==1)Notificaciones=new ArrayList<Bundle>();
		if(notificationManager!=null)
		notificationManager.cancelAll();
		return temp;
	}
	public static boolean elimina(int v){
		//if(Notificaciones.size()>0){
		for(int i=0;i<Notificaciones.size();i++)
			if(Notificaciones.get(i).getString("IdNotificacion").equalsIgnoreCase(""+v)){
				Notificaciones.remove(i);
				return true;
			}
		return false;
	}
	@Override
	public void onRegistered(Context context, String regId) {

		Log.v(TAG, "onRegistered: "+ regId);

		JSONObject json;

		try
		{
			json = new JSONObject().put("event", "registered");
			json.put("regid", regId);

			Log.v(TAG, "onRegistered: " + json.toString());

			// Send this JSON data to the JavaScript application above EVENT should be set to the msg type
			// In this case this is the registration ID
			PushPlugin.sendJavascript( json );

		}
		catch( JSONException e)
		{
			// No message to the user is sent, JSON failed
			Log.e(TAG, "onRegistered: JSON exception");
		}
	}

	@Override
	public void onUnregistered(Context context, String regId) {
		Log.d(TAG, "onUnregistered - regId: " + regId);
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		
			if(isRegistred(context)){
		Idioma=Locale.getDefault().getDisplayLanguage().toLowerCase();
		Bundle extras = intent.getExtras();
		if(!existeId(extras))
		if (extras != null)
		{
            if (PushPlugin.isInForeground()) {
				extras.putBoolean("foreground", true);
			}
			else {
				
				extras.putBoolean("foreground", false);
				
			}
            if (extras.getString("Subtitulo") != null && extras.getString("Subtitulo").length() != 0) {
        		//ComplexPreferences complexPreferences = ComplexPreferences.getComplexPreferences(this, "notificaciones", MODE_PRIVATE);
            	
            	switch(Integer.parseInt(extras.getString("Tipo"))){
            		case 1://Evento normal
            			int distancia=pingGps(extras.getString("Latitud"),extras.getString("Longitud"));
            			int distcarro=pingCar(getCarroPos(context).getString("Latitud"),getCarroPos(context).getString("Longitud"),extras);
            			
            			if(distancia>=0 && distancia<=Integer.parseInt(extras.getString("RangoPersonal")) ){
                			//informaAmigos(extras,distancia);
                			extras.putBoolean("foreground",false);
            				if(distcarro>=0 && distcarro<=Integer.parseInt(extras.getString("RangoAuto")) && Integer.parseInt(extras.getString("NotificacionesAuto"))==1){
            					informaCarro(extras,distcarro);
            					extras.putBoolean("foreground",false);
            				}
            			}else if(distcarro>=0 && distcarro<=Integer.parseInt(extras.getString("RangoAuto")) && Integer.parseInt(extras.getString("NotificacionesAuto"))==1){
        					informaCarro(extras,distcarro);
        					extras.putBoolean("foreground",false);
        				}else {
                    		Notificaciones.add(extras);
                    		//complexPreferences.putObject("nots", Notificaciones);
                    	    //complexPreferences.commit();
                    		if(!extras.getBoolean("foreground"))createNotificationNormal(context, extras);
            			}
            		break;
            		case 2://Alerta personal
                			Notificaciones.add(extras);
                			//complexPreferences.putObject("nots", Notificaciones);
                    	    //complexPreferences.commit();
                			if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                	break;
            		case 3://Alerta personas
            				Notificaciones.add(extras);
            				//complexPreferences.putObject("nots", Notificaciones);
                    	    //complexPreferences.commit();
            				if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                	break;
            		case 4://Alerta auto
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                	break;
            		case 5://Solicitud
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAmistad(context, extras);
                	break;
            		case 6://Aceptado
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAmistad(context, extras);
                	break;
            		case 7://codigo
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAmistad(context, extras);
                	break;
            		case 8://codigo
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                	break;
            		case 9://Solicitud Familiar
            			Notificaciones.add(extras);
            			//complexPreferences.putObject("nots", Notificaciones);
                	    //complexPreferences.commit();
        				if(!extras.getBoolean("foreground"))createNotificationAmistad(context, extras);
                	break;
            		case 10://llamada
            			/*//Log.d("RES",""+(extras.getString("Operacion")=="1"));
            			if(Integer.parseInt(extras.getString("Operacion"))==1){
            			Notificaciones.add(extras);
            			if(!extras.getBoolean("foreground"))createNotificationLlamada(context, extras);
            			}*/
            			SocketIO socket;
					try {
						socket = new SocketIO("http://www.virtual-guardian.com:8303/");
					} catch (MalformedURLException e) {
						// TODO Auto-generated catch block
						socket=null;
					}
					if(socket!=null){
						connectSocket(socket);
					}
            			break;
            	}
            }
                
            if(extras.getBoolean("foreground"))PushPlugin.sendExtras(extras);
        }
		}else{
			Notificaciones=new ArrayList<Bundle>();
			Log.d("NOTIFICATION","NO REG");
		}
    }
	private void connectSocket(SocketIO socket){
		socket.connect(new IOCallback() {
            @Override
            public void onMessage(JSONObject json, IOAcknowledge ack) {
                try {
                    System.out.println("Server said:" + json.toString(2));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onMessage(String data, IOAcknowledge ack) {
                System.out.println("Server said: " + data);
            }

            @Override
            public void onError(SocketIOException socketIOException) {
                System.out.println("an Error occured");
                socketIOException.printStackTrace();
            }

            @Override
            public void onDisconnect() {
                System.out.println("Connection terminated.");
            }

            @Override
            public void onConnect() {
                System.out.println("Connection established");
            }

            @Override
            public void on(String event, IOAcknowledge ack, Object... args) {
                System.out.println("Server triggered event '" + event + "'");
            }
		});
	}
	public void createNotificationNormal(Context context, Bundle extras)
	{ 
		
		String appName = getAppName(this);
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		//DEFAULTS DE LA NOTIFICACION
		int defaults = Notification.DEFAULT_ALL;
		if (extras.getString("defaults") != null) {
			try {
				defaults = Integer.parseInt(extras.getString("defaults"));
			} catch (NumberFormatException e) {}
		}
			
		//PROPIEDADES WEAR
		Bitmap background = BitmapFactory.decodeResource(getResources(), R.drawable.ic_background);
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
		        .setBackground(background);
		
		// Issue the notification
		notificationManager = NotificationManagerCompat.from(this);
		Bitmap largeIcon;
		if(android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP)
			largeIcon = BitmapFactory.decodeResource(getResources(), R.drawable.icon);
		else largeIcon = BitmapFactory.decodeResource(getResources(), R.drawable.ic_notification);
		Notification summaryNotification;
		
		//create de group of notif
		Log.d("nots",""+cuentaNot(extras.getString("Tipo")));
		if(cuentaNot(extras.getString("Tipo"))>1){
			NotificationCompat.InboxStyle estilo= new NotificationCompat.InboxStyle();
		
			for(int i=Notificaciones.size()-1; i>=0;i--){
				if(Notificaciones.get(i).getString("Tipo").equalsIgnoreCase(extras.getString("Tipo"))){
				String nottext=String.format("<b>"+Notificaciones.get(i).getString("Titulo")+"</b>"+": "+Notificaciones.get(i).getString("Subtitulo"));
				estilo.addLine(Html.fromHtml(nottext));
				}
			}
			estilo.setBigContentTitle("Virtual Guardian");
			estilo.setSummaryText((cuentaNot(extras.getString("Tipo"))+" New notifications"));
			String pendientes="You have "+cuentaNot(extras.getString("Tipo"))+" notifications pending";
			String ticker="Virtual Guardian Notification";
			Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			if(Idioma.equalsIgnoreCase("español")){
				estilo.setSummaryText((cuentaNot(extras.getString("Tipo"))+" Notificaciones nuevas"));
				pendientes="Tienes "+cuentaNot(extras.getString("Tipo"))+" notificaciones pendientes";
				ticker="Notificación Virtual Guardian";
			}

		// Create an InboxStyle notification
		summaryNotification = new NotificationCompat.Builder(context)
				.setDefaults(defaults)
		        .setContentTitle("Virtual Guardian")
		        .setSmallIcon(R.drawable.ic_notification)
		        .setLargeIcon(largeIcon)
		        .setStyle(estilo)
		        .setContentText(pendientes)
		        .setGroup(GROUP_KEY_EMAILS)
		        .setGroupSummary(true)
		        .setAutoCancel(true)
		        .setContentIntent(contentIntent)
		        .setOngoing(extras.getBoolean("Permanente"))
		        .setWhen(System.currentTimeMillis())
		        .setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
		        .extend(wearableExtender)
		        .setSound(sound)
		        .build();
				
					
		}else{
			String ticker="Virtual Guardian Notification";
			Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			if(Idioma.equalsIgnoreCase("español")){
				ticker="Notificación Virtual Guardian";
			}
			summaryNotification =
					new NotificationCompat.Builder(context)
						.setDefaults(defaults)
						.setSmallIcon(R.drawable.ic_notification)
						.setLargeIcon(largeIcon)
						.setAutoCancel(true)
						.setOngoing(extras.getBoolean("Permanente"))
						.setWhen(System.currentTimeMillis())
						.setContentTitle(extras.getString("Titulo"))
						.setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
						.setSound(sound)
						.setContentText(extras.getString("Subtitulo"))
						.setContentIntent(contentIntent)
						.extend(wearableExtender)
						.build();
		}
		
		//notificationManager.cancel(Integer.parseInt(extras.getString("Tipo")));
		notificationManager.notify(Integer.parseInt(extras.getString("Tipo")), summaryNotification);
		
	}
	
	public void createNotificationMision(Context context, Bundle extras)
	{ 
		String appName = getAppName(this);
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		notificationIntent.putExtra("tipo","mision" );
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		

		int defaults = Notification.DEFAULT_ALL;
		if (extras.getString("defaults") != null) {
			try {
				defaults = Integer.parseInt(extras.getString("defaults"));
			} catch (NumberFormatException e) {}
		}
		
		
		
		//ACCIONES WEAR
		RemoteInput remoteInput = new RemoteInput.Builder(EXTRA_VOICE_REPLY)
		        .setLabel("Hable ahora")
		        .build(); 
		
		Intent replyIntent = new Intent(this, ServiceVoice.class);
		PendingIntent replyPendingIntent =
		        PendingIntent.getService(this, 0, replyIntent,
		                PendingIntent.FLAG_UPDATE_CURRENT);

		NotificationCompat.Action voiceAction =
		        new NotificationCompat.Action.Builder(R.drawable.ic_microphone,
		                "Responder misión", replyPendingIntent)
		                .addRemoteInput(remoteInput)
		                .build();
		
		List<NotificationCompat.Action> acciones=new ArrayList<NotificationCompat.Action> ();
				acciones.add(voiceAction);
		//PROPIEDADES WEAR
		Bitmap background = BitmapFactory.decodeResource(getResources(), R.drawable.ic_background_mision);
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
				.addActions(acciones)
		        .setBackground(background);
		// Issue the notification
		 notificationManager = NotificationManagerCompat.from(this);
		
		Bitmap largeIcon = BitmapFactory.decodeResource(getResources(), R.drawable.ic_notification);
		
		Notification summaryNotification;
		//create de group of notif
		
		NotificationCompat.BigTextStyle estilo= new NotificationCompat.BigTextStyle();
		
		
			estilo.setBigContentTitle("Misión Virtual Guardian");
			estilo.bigText(extras.getString("mision"));
			//estilo.setSummaryText("Las misiones nos permiten protegerte.");
			
		// Create an InboxStyle notification
		summaryNotification = new NotificationCompat.Builder(context)
				.setDefaults(defaults)
		        .setContentTitle("Misión Virtual Guardian")
		        .setSmallIcon(R.drawable.ic_notification)
		        .setLargeIcon(largeIcon)
		        .setStyle(estilo)
		        .setContentText(extras.getString("mision"))
		        .setAutoCancel(true)
		        .setContentIntent(contentIntent)
		        .setOngoing(extras.getString("ongoing")=="1")
		        .setWhen(System.currentTimeMillis())
		        .setTicker(extras.getString("tickerText")+"\n"+extras.getString("mision"))
		        .setLights(0xFF7900, 500, 500) 
		        .extend(wearableExtender)
		        .setSound(Uri.parse("android.resource://"+ context.getPackageName() + "/" + R.raw.audio))
		        .build();
		//notificationManager.cancel(Integer.parseInt(extras.getString("tipo")));
		notificationManager.notify(Integer.parseInt(extras.getString("tipo")), summaryNotification);
		
	}
	public void createNotificationAlerta(Context context, Bundle extras)
	{ 
		String appName = getAppName(this);
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		//DEFAULTS DE LA NOTIFICACION
		int defaults = Notification.DEFAULT_ALL;
		if (extras.getString("defaults") != null) {
			try {
				defaults = Integer.parseInt(extras.getString("defaults"));
			} catch (NumberFormatException e) {}
		}
			
		//PROPIEDADES WEAR
		
		Bitmap background = BitmapFactory.decodeResource(getResources(), R.drawable.ic_background_alert);
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
		        .setBackground(background);
		
		// Issue the notification
		notificationManager = NotificationManagerCompat.from(this);
		int icon=R.drawable.ic_notification_alert;
		switch(Integer.parseInt(extras.getString("Tipo"))){
		case 2:icon= R.drawable.ic_notification_ame;
			break;
		case 3:icon=R.drawable.ic_notification_afriend;
			break;
		case 4:icon=R.drawable.ic_notification_car;
			break;
		case 8:icon=R.drawable.ic_notification;
		break;
		}
		Bitmap largeIcon = BitmapFactory.decodeResource(getResources(),icon);
		Notification summaryNotification;
		//create de group of notif
		
		if(cuentaNot(extras.getString("Tipo"))>1){
		NotificationCompat.InboxStyle estilo= new NotificationCompat.InboxStyle();
		
		for(int i=Notificaciones.size()-1; i>=0;i--){
			if(Notificaciones.get(i).getString("Tipo").equalsIgnoreCase(extras.getString("Tipo"))){
				String nottext=String.format("<b>"+Notificaciones.get(i).getString("Titulo")+"</b>"+""+": "+Notificaciones.get(i).getString("Subtitulo"));
				estilo.addLine(Html.fromHtml(nottext));
			}
		}
		
		estilo.setBigContentTitle("Virtual Guardian Alert!");
		estilo.setSummaryText((cuentaNot(extras.getString("Tipo"))+" New alerts"));
		String pendientes="You have "+cuentaNot(extras.getString("Tipo"))+" alerts pending";
		String ticker="Virtual Guardian Alert!";
		Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
		if(Idioma.equalsIgnoreCase("español")){
			estilo.setBigContentTitle("ALERTA Virtual Guardian!");
			estilo.setSummaryText((cuentaNot(extras.getString("Tipo"))+" Alertas nuevas"));
			pendientes="Tienes "+cuentaNot(extras.getString("Tipo"))+" notificaciones pendientes";
			ticker="ALERTA Virtual Guardian!";
		}
		if(Integer.parseInt(extras.getString("Tipo"))==8){
			ticker="";
			}
			
		// Create an InboxStyle notification
		summaryNotification = new NotificationCompat.Builder(context)
				.setDefaults(defaults)
		        .setContentTitle(ticker)
		        .setSmallIcon(icon)
		        .setLargeIcon(largeIcon)
		        .setStyle(estilo)
		        .setContentText(pendientes)
		        .setGroup(GROUP_KEY_EMAILS+"_ALERTAS")
		        .setGroupSummary(true)
		        .setAutoCancel(true)
		        .setContentIntent(contentIntent)
		        .setOngoing(extras.getBoolean("Permanente"))
		        .setWhen(System.currentTimeMillis())
		        .setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
		        .extend(wearableExtender)
		        .setSound(sound)
		        .build();
				
					
		}else{
			String ticker="Virtual Guardian Alert!";
			Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			
			if(Idioma.equalsIgnoreCase("español")){
				ticker="ALERTA Virtual Guardian!";
			}
			if(Integer.parseInt(extras.getString("Tipo"))==8){
				ticker="";
				}
			summaryNotification =
					new NotificationCompat.Builder(context)
						.setDefaults(defaults)
						.setSmallIcon(icon)
						.setLargeIcon(largeIcon)
						.setAutoCancel(true)
						.setOngoing(extras.getBoolean("ongoing"))
						.setWhen(System.currentTimeMillis())
						.setContentTitle(extras.getString("Titulo"))
						.setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
						.setSound(Uri.parse("android.resource://"+ context.getPackageName() + "/" + R.raw.audio))
						.setContentText(extras.getString("Subtitulo"))
						.setContentIntent(contentIntent)
						.extend(wearableExtender)
						.build();
		}
		
		//notificationManager.cancel(Integer.parseInt(extras.getString("Tipo")));
		notificationManager.notify(Integer.parseInt(extras.getString("Tipo")), summaryNotification);
		
	}
	public void createNotificationAmistad(Context context, Bundle extras)
	{ 
		String appName = getAppName(this);
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		//DEFAULTS DE LA NOTIFICACION
		int defaults = Notification.DEFAULT_ALL;
		if (extras.getString("defaults") != null) {
			try {
				defaults = Integer.parseInt(extras.getString("defaults"));
			} catch (NumberFormatException e) {}
		}
			
		//PROPIEDADES WEAR
		Bitmap background = BitmapFactory.decodeResource(getResources(), R.drawable.ic_background);
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
		        .setBackground(background);
		
		// Issue the notification
		 notificationManager = NotificationManagerCompat.from(this);
		Bitmap largeIcon = BitmapFactory.decodeResource(getResources(), R.drawable.ic_notification_friend);
		Notification summaryNotification;
		//create de group of notif
		
			String ticker="Virtual Guardian Notification";
			Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			
			if(Idioma.equalsIgnoreCase("español")){
				ticker="Notificación Virtual Guardian";
			}
			summaryNotification =
					new NotificationCompat.Builder(context)
						.setDefaults(defaults)
						.setSmallIcon(R.drawable.ic_notification_friend)
						.setLargeIcon(largeIcon)
						.setAutoCancel(true)
						.setOngoing(extras.getBoolean("ongoing"))
						.setWhen(System.currentTimeMillis())
						.setContentTitle(extras.getString("Titulo"))
						.setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
						.setSound(Uri.parse("android.resource://"+ context.getPackageName() + "/" + R.raw.audio))
						.setContentText(extras.getString("Subtitulo"))
						.setContentIntent(contentIntent)
						.extend(wearableExtender)
						.build();
		
		
		//notificationManager.cancel(5);
		notificationManager.notify(5, summaryNotification);
		
	}
	public void createNotificationLlamada(Context context, Bundle extras)
	{ 
		String appName = getAppName(this);
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		Intent dimissIntent = new Intent(this, NotificationActivity.class);
	    // This flag must be set on activities started from a notification.
		dimissIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS); 
		dimissIntent.putExtra("pushBundle", extras);
	    // Return a pending intent to pass to the notification manager.
	    PendingIntent dimiss= PendingIntent.getActivity(this,0, dimissIntent,PendingIntent.FLAG_CANCEL_CURRENT);
////////////////////////alarma
	    AlarmManager manager = (AlarmManager) this.getSystemService(Context.ALARM_SERVICE);   
        manager.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + 30000, dimiss);  
	    ///////////////////////////
	
		//DEFAULTS DE LA NOTIFICACION
		int defaults = Notification.DEFAULT_ALL;
		if (extras.getString("defaults") != null) {
			try {
				defaults = Integer.parseInt(extras.getString("defaults"));
			} catch (NumberFormatException e) {}
		}
		NotificationCompat.Action colgar =
		        new NotificationCompat.Action.Builder(R.drawable.cancel,
		                "Rechazar", dimiss)
		                //.addRemoteInput(remoteInput)
		                .build();
		NotificationCompat.Action contestar =
		        new NotificationCompat.Action.Builder(R.drawable.phone,
		                "Responder", contentIntent)
		                //.addRemoteInput(remoteInput)
		                .build();
		List<NotificationCompat.Action> acciones=new ArrayList<NotificationCompat.Action> ();
		acciones.add(colgar);
		acciones.add(contestar);
		//PROPIEDADES WEAR
		Bitmap background = BitmapFactory.decodeResource(getResources(), R.drawable.ic_background);
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
		        .setBackground(background);
		
		// Issue the notification
		String correo=extras.getString("Correo").toLowerCase();
		correo=correo.substring(0, 1).toUpperCase()+correo.substring(1,correo.length());
		notificationManager = NotificationManagerCompat.from(this);
		Bitmap largeIcon = BitmapFactory.decodeResource(getResources(), R.drawable.icon);
		Notification summaryNotification;
		//create de group of notif
		
			String ticker="Virtual Guardian Notification";
			Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			long[] pattern = {800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800};
			
			AudioManager am = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
			 Uri ring = null;
			switch (am.getRingerMode()) {
			  case AudioManager.RINGER_MODE_SILENT:
				  pattern=null;
			    break;
			  case AudioManager.RINGER_MODE_VIBRATE:
				  
			    break;
			  case AudioManager.RINGER_MODE_NORMAL:
				  ring=RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
			    break;
			}
			
			if(Idioma.equalsIgnoreCase("español")){
				ticker="Notificación Virtual Guardian";
			}
			summaryNotification =
					new NotificationCompat.Builder(context)
						.setSmallIcon(R.drawable.ic_call)
						.setLargeIcon(largeIcon)
						.setAutoCancel(true)
						.setOngoing(true)
						.setVibrate(pattern)
						.setPriority(Notification.PRIORITY_MAX)
						.setWhen(System.currentTimeMillis())
						.setContentTitle(correo)
						//.setTicker(ticker+"\n"+extras.getString("Titulo")+": "+extras.getString("Subtitulo"))
						.setSound(ring)
						.setLights(0xFFff0000, 500, 500)
						.setContentText(extras.getString("Subtitulo"))
						.setContentIntent(contentIntent)
						.extend(wearableExtender)
						.addAction(colgar)
						.addAction(contestar)
						.setCategory(Notification.CATEGORY_CALL)
						.build();
			
		summaryNotification.audioAttributes= new AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
        .build();
		
		
		//notificationManager.cancel(5);
		notificationManager.notify(10, summaryNotification);
		
	}
	
	public int pingCar(String lat,String lon,Bundle extras)
	{ 
		if(!lat.equals("") && !lon.equals("")){
		
	      return distancia( Double.parseDouble(extras.getString("Latitud")), Double.parseDouble(extras.getString("Longitud")), Double.parseDouble(lat), Double.parseDouble(lon));
	     
		}else return -1;
	    
	}
	public int pingGps(String lat,String lon)
	{ 
		if(!lat.equals("") && !lon.equals("")){
		locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
	    // Define the criteria how to select the locatioin provider -> use
	    // default
	    Criteria criteria = new Criteria();
	    provider = locationManager.getBestProvider(criteria, false);
	    Location location = locationManager.getLastKnownLocation(provider);

	    // Initialize the location fields
	    if (location != null) {
	      System.out.println("Provider " + provider + " has been selected.");
	      return onLocationChanged(location,lat,lon);
	      
	    } else {
	      latitute="Location not available";
	      longitude="Location not available";
	      return -1;
	    }
		}else return -1;
	    
	}
	public int onLocationChanged(Location location, String lat, String lon) {
	    latitute=String.valueOf(location.getLatitude());
	    longitude=String.valueOf(location.getLongitude());
	    Log.d("LATITUDE",latitute);
	    Log.d("LONGITUD",longitude);
	    Log.d("GPS",lat+" , "+lon);
	    return distancia(location.getLatitude(),location.getLongitude(), Double.parseDouble(lat), Double.parseDouble(lon));
	  }
	private int distancia(double la1,double lo1, double la2, double lo2)
	{
		Coordinate lat = new DegreeCoordinate(la1);
		Coordinate lng = new DegreeCoordinate(lo1);
		Point point = new Point(lat, lng);

		lat = new DegreeCoordinate(la2);
		lng = new DegreeCoordinate(lo2);
		Point point2 = new Point(lat, lng);
		double distancia=EarthCalc.getDistance(point2, point)/1000;
		System.out.println("Distance is " + EarthCalc.getDistance(point2, point) / 1000 + " km");
		return (int)EarthCalc.getDistance(point2, point);
	}
	
	private void informaAmigos(Bundle extras,int distancia){
		HttpClient httpclient = new DefaultHttpClient();
		HttpPost httppost = new HttpPost("https://www.virtual-guardian.com/portal/php/notificacionAndroid.php");

		try {
		    // Add your data
		    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
		    nameValuePairs.add(new BasicNameValuePair("IdEvento", extras.getString("IdEvento")));
		    nameValuePairs.add(new BasicNameValuePair("funcion", "NotificaAmigos"));
		    nameValuePairs.add(new BasicNameValuePair("IdUsuario", extras.getString("IdUsuario")));
		    nameValuePairs.add(new BasicNameValuePair("Distancia", ""+distancia));
		    httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

		    // Execute HTTP Post Request
		    HttpResponse response = httpclient.execute(httppost);

		} catch (ClientProtocolException e) {
		    // TODO Auto-generated catch block
		} catch (IOException e) {
		    // TODO Auto-generated catch block
		}
	}
	private void informaCarro(Bundle extras,int distancia){
		HttpClient httpclient2 = new DefaultHttpClient();
		HttpPost httppost2 = new HttpPost("https://www.virtual-guardian.com/portal/php/notificacionAndroid.php");

		try {
		    // Add your data
		    List<NameValuePair> nameValuePairs2 = new ArrayList<NameValuePair>(2);
		    nameValuePairs2.add(new BasicNameValuePair("IdEvento", extras.getString("IdEvento")));
		    nameValuePairs2.add(new BasicNameValuePair("funcion", "NotificaAuto"));
		    nameValuePairs2.add(new BasicNameValuePair("IdUsuario", extras.getString("IdUsuario")));
		    nameValuePairs2.add(new BasicNameValuePair("Distancia", ""+distancia));
		    httppost2.setEntity(new UrlEncodedFormEntity(nameValuePairs2));

		    // Execute HTTP Post Request
		    HttpResponse response2 = httpclient2.execute(httppost2);

		} catch (ClientProtocolException e) {
		    // TODO Auto-generated catch block
		} catch (IOException e) {
		    // TODO Auto-generated catch block
		}
	}
	private boolean existeId(Bundle extra){
		boolean existe=false;
		if(Notificaciones!=null)
		for(int i=0;i<Notificaciones.size();i++)
			if(Notificaciones.get(i).getString("IdNotificacion").equalsIgnoreCase(extra.getString("IdNotificacion")))return true;
		return existe;
	}
	private int cuentaNot(String tipo){
		int cont=0;
		for(int i=0;i<Notificaciones.size();i++)
			if(Notificaciones.get(i).getString("Tipo").equalsIgnoreCase(tipo))cont++;
		return cont;
	}
	private static String getAppName(Context context)
	{
		CharSequence appName = 
				context
					.getPackageManager()
					.getApplicationLabel(context.getApplicationInfo());
		
		return (String)appName;
	}
	private Bundle getCarroPos(Context context){
		Bundle obj=new Bundle();
		SharedPreferences prefs = context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		String lat = prefs.getString("Latitud",""); 
		String lon = prefs.getString("Longitud",""); 
		obj.putString("Latitud", lat);
		obj.putString("Longitud", lon);
		return obj;
	}
	private Boolean isRegistred(Context context){
		SharedPreferences prefs = context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		return prefs.getString("Registered","").equals("1");
	}
	
	@Override
	public void onError(Context context, String errorId) {
		Log.e(TAG, "onError - errorId: " + errorId);
	}
}
/*
 Log.d("EXTRAS!",extras.toString());
                	 if(Integer.parseInt(extras.getString("tipo"))==1){
                		double distancia=pingGps(extras.getString("latitud"),extras.getString("longitud"));
                		if(distancia>=0 && distancia<=3.0 ){
                			//ALERTAS
                			informaAmigos(extras,distancia);
                			String un="km.";
                			extras.putString("tipo", "3");
                			if(distancia<1){
                				distancia=distancia*1000;
                				un="m.";
                			}
                			extras.putString("title",extras.getString("asunto")+" a "+String.format("%.1f",distancia)+" "+un);
                			if(NotificacionesAlertas.size()>0){
                    			if(Integer.parseInt(extras.getString("id"))!=Integer.parseInt(NotificacionesAlertas.get(NotificacionesAlertas.size()-1).getString("id"))){
                    				NotificacionesAlertas.add(extras);
                    				if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                    			}
                    		}else{
                    			NotificacionesAlertas.add(extras);
                    			if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                    		}
                		}else 
                		{
                			//NORMALES
                			if(Notificaciones.size()>0){
                    			if(Integer.parseInt(extras.getString("id"))!=Integer.parseInt(Notificaciones.get(Notificaciones.size()-1).getString("id"))){
                    				Notificaciones.add(extras);
                    				if(!extras.getBoolean("foreground"))createNotificationNormal(context, extras);
                    			}
                    		}else{
                    			Notificaciones.add(extras);
                    			if(!extras.getBoolean("foreground"))createNotificationNormal(context, extras);
                    		}
                		}
                		
                	}
                	 else if(Integer.parseInt(extras.getString("tipo"))==2){
                		if(NotificacionMision!=null){
                			if(Integer.parseInt(extras.getString("id"))!=Integer.parseInt(NotificacionMision.getString("id"))){
                				NotificacionMision=extras;
                				if(!extras.getBoolean("foreground"))createNotificationMision(context, extras);
                			}
                		}else{
                			NotificacionMision=extras;
                			if(!extras.getBoolean("foreground"))createNotificationMision(context, extras);
                		}
                	}
                	 else if(Integer.parseInt(extras.getString("tipo"))==3){
                		String un="km.";
            			double distancia= Double.parseDouble(extras.getString("distancia"));
            			if(distancia<1){
            				distancia=distancia*1000;
            				un="m.";
            			}
            			extras.putString("message","");
                		extras.putString("title",extras.getString("asunto")+" a "+String.format("%.1f",distancia)+" "+un+" de "+extras.getString("correo"));
            			if(NotificacionesAlertas.size()>0){
                			if(Integer.parseInt(extras.getString("id"))!=Integer.parseInt(NotificacionesAlertas.get(NotificacionesAlertas.size()-1).getString("id"))){
                				NotificacionesAlertas.add(extras);
                				if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                			}
                		}else{
                			NotificacionesAlertas.add(extras);
                			if(!extras.getBoolean("foreground"))createNotificationAlerta(context, extras);
                		}
                	}
                    
 * */
 