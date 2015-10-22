package com.plugin.gcm;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.emitter.Emitter.Listener;
import com.github.nkzawa.socketio.client.Ack;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.IO.Options;
import com.github.nkzawa.socketio.client.Socket;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

public class intentSocket extends Intent {
	public Socket socket;
	
	public void putSocket(Socket soc){
		socket=soc;
		}
}
