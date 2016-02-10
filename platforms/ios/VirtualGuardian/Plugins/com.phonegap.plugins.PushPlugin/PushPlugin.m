/*
 Copyright 2009-2011 Urban Airship Inc. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 2. Redistributions in binaryform must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided withthe distribution.

 THIS SOFTWARE IS PROVIDED BY THE URBAN AIRSHIP INC``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 EVENT SHALL URBAN AIRSHIP INC OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
@import Foundation;
//@import SocketIO;
#import "PushPlugin.h"
#import <PushKit/PushKit.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "AppDelegate+notification.h"
#import <AudioToolbox/AudioServices.h>
#import "MainViewController.h"
//***!#import <Socket_IO_Client_Swift/Socket_IO_Client_Swift-Swift.h>



@implementation PushPlugin

@synthesize notificationMessage;
@synthesize notificationMessageTemp;
@synthesize notificaciones;
@synthesize isInline;

@synthesize callbackId;
@synthesize notificationCallbackId;
@synthesize callback;
@synthesize locationManager;
@synthesize callNotification;
//***!@synthesize socket;


#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)

- (void)unregister:(CDVInvokedUrlCommand*)command;
{
	self.callbackId = command.callbackId;

    [[UIApplication sharedApplication] unregisterForRemoteNotifications];
    [self successWithMessage:@"unregistered"];
}
- (void)carLocation:(CDVInvokedUrlCommand*)command;
{
    
    self.callbackId = command.callbackId;
    NSMutableDictionary* options = [command.arguments objectAtIndex:0];
    NSString *latitud = [options objectForKey:@"Latitud"];
    NSString *longitud = [options objectForKey:@"Longitud"];
    NSString *estatus = [options objectForKey:@"Estatus"];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    if([estatus isEqualToString:@"1"]){
        [defaults setObject:latitud forKey:@"CarLatitud"];
        [defaults setObject:longitud forKey:@"CarLongitud"];
    }else{
        [defaults removeObjectForKey:@"CarLatitud"];
        [defaults removeObjectForKey:@"CarLongitud"];
    }
        [defaults synchronize];
}

- (void)register:(CDVInvokedUrlCommand*)command;
{
	self.callbackId = command.callbackId;
    notificaciones=0;
    //MainViewController *add = [[MainViewController alloc] init];
    //[add alert];
    
    
    NSMutableDictionary* options = [command.arguments objectAtIndex:0];
    notificaciones=0;
    UIUserNotificationType UserNotificationTypes = UIUserNotificationTypeNone;
    UIRemoteNotificationType notificationTypes = UIRemoteNotificationTypeNone;
    id badgeArg = [options objectForKey:@"badge"];
    id soundArg = [options objectForKey:@"sound"];
    id alertArg = [options objectForKey:@"alert"];
    
    if ([badgeArg isKindOfClass:[NSString class]])
    {
        if ([badgeArg isEqualToString:@"true"]) {
            notificationTypes |= UIRemoteNotificationTypeBadge;
            UserNotificationTypes |= UIUserNotificationTypeBadge;
        }
    }
    else if ([badgeArg boolValue]) {
        notificationTypes |= UIRemoteNotificationTypeBadge;
        UserNotificationTypes |= UIUserNotificationTypeBadge;
    }
    
    if ([soundArg isKindOfClass:[NSString class]])
    {
        if ([soundArg isEqualToString:@"true"]) {
            notificationTypes |= UIRemoteNotificationTypeSound;
            UserNotificationTypes |= UIUserNotificationTypeSound;
        }
    }
    else if ([soundArg boolValue]) {
        notificationTypes |= UIRemoteNotificationTypeSound;
        UserNotificationTypes |= UIUserNotificationTypeSound;
    }
    
    if ([alertArg isKindOfClass:[NSString class]])
    {
        if ([alertArg isEqualToString:@"true"]) {
            notificationTypes |= UIRemoteNotificationTypeAlert;
            UserNotificationTypes |= UIUserNotificationTypeAlert;
        }
    }
    else if ([alertArg boolValue]) {
        notificationTypes |= UIRemoteNotificationTypeAlert;
        UserNotificationTypes |= UIUserNotificationTypeAlert;
    }
    
    notificationTypes |= UIRemoteNotificationTypeNewsstandContentAvailability;
    UserNotificationTypes |= UIUserNotificationActivationModeBackground;
    
    self.callback = [options objectForKey:@"ecb"];
    /*voip*/
    PKPushRegistry * voipRegistry = [[PKPushRegistry alloc] initWithQueue: dispatch_get_main_queue()];
    voipRegistry.delegate = self;// Set the registry's delegate to self
    voipRegistry.desiredPushTypes = [NSSet setWithObject:PKPushTypeVoIP]; // register
    /**/
    
    if (notificationMessage)			// if there is a pending startup notification
    [self notificationReceived];	// go ahead and process it
}


- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials: (PKPushCredentials *)credentials forType:(NSString *)type {
    UIApplication * application =[UIApplication sharedApplication];
    
    
    UIMutableUserNotificationAction *notificationAction1 = [[UIMutableUserNotificationAction alloc] init];
    notificationAction1.identifier = @"aceptar";
    notificationAction1.title = @"Responder";
    notificationAction1.activationMode = UIUserNotificationActivationModeForeground;
    notificationAction1.destructive = NO;
    //notificationAction1.behavior=UIUserNotificationActionBehaviorDefault;
    notificationAction1.authenticationRequired = NO;
    
    UIMutableUserNotificationAction *notificationAction2 = [[UIMutableUserNotificationAction alloc] init];
    notificationAction2.identifier = @"rechazar";
    notificationAction2.title = @"Rechazar";
    notificationAction2.activationMode = UIUserNotificationActivationModeBackground;
    notificationAction2.destructive = NO;
    notificationAction2.authenticationRequired = NO;
    
    UIMutableUserNotificationCategory *notificationCategory = [[UIMutableUserNotificationCategory alloc] init];
    notificationCategory.identifier = @"call";
    [notificationCategory setActions:@[notificationAction2,notificationAction1] forContext:UIUserNotificationActionContextDefault];
    [notificationCategory setActions:@[notificationAction2,notificationAction1] forContext:UIUserNotificationActionContextMinimal];
    
    NSSet *categories = [NSSet setWithObjects:notificationCategory, nil];

    
    
    
    if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
        [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:categories]];
    }

    NSMutableDictionary *results = [NSMutableDictionary dictionary];
    NSString *token = [[[[credentials.token description] stringByReplacingOccurrencesOfString:@"<"withString:@""]
                        stringByReplacingOccurrencesOfString:@">" withString:@""]
                       stringByReplacingOccurrencesOfString: @" " withString: @""];
    [results setValue:token forKey:@"deviceToken"];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    
    [defaults setObject:token forKey:@"regId"];
    [defaults synchronize];
    
#if !TARGET_IPHONE_SIMULATOR
    // Get Bundle Info for Remote Registration (handy if you have more than one app)
    [results setValue:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"] forKey:@"appName"];
    [results setValue:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"] forKey:@"appVersion"];
    NSUInteger rntypes = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
    
    // Set the defaults to disabled unless we find otherwise...
    NSString *pushBadge = @"disabled";
    NSString *pushAlert = @"disabled";
    NSString *pushSound = @"disabled";
    
    if(rntypes & UIUserNotificationTypeBadge){
        pushBadge = @"enabled";
    }
    if(rntypes & UIUserNotificationTypeAlert) {
        pushAlert = @"enabled";
    }
    if(rntypes & UIUserNotificationTypeSound) {
        pushSound = @"enabled";
    }
    
    [results setValue:pushBadge forKey:@"pushBadge"];
    [results setValue:pushAlert forKey:@"pushAlert"];
    [results setValue:pushSound forKey:@"pushSound"];
    
    // Get the users Device Model, Display Name, Token & Version Number
    UIDevice *dev = [UIDevice currentDevice];
    [results setValue:dev.name forKey:@"deviceName"];
    [results setValue:dev.model forKey:@"deviceModel"];
    [results setValue:dev.systemVersion forKey:@"deviceSystemVersion"];
    
    
    [self successWithMessage:[NSString stringWithFormat:@"%@", token]];
#endif

}
- (void)cancelcall{
    [UIApplication sharedApplication].applicationIconBadgeNumber--;
    NSString * d=notificationMessage[@"IdUsuario"];
    //***!if(SocketConected)[ socket emit:@"colgar_movil" withItems:@[d]];
    [NSTimer scheduledTimerWithTimeInterval:5.0
                                     target:self
                                   selector:@selector(kilsockCancela)
                                   userInfo:notificationMessage
                                    repeats:NO];
    
}
-(void)kilsockCancela{
    NSLog(@"cancela");
    notificationMessage = nil;
    [self timerOff];
    //***!if(socket)[socket close];
}
-(void)aceptcall{
    NSLog(@"acepta");
    [self notificationReceived];
    [self timerOff];
}
// Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type {
    // Process the received push
    UIApplication * application =[UIApplication sharedApplication];
    //
    NSDictionary * userInfo= payload.dictionaryPayload;
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    if([defaults objectForKey:@"regId"]){
        
        
        UIApplicationState appState = UIApplicationStateActive;
        if ([application respondsToSelector:@selector(applicationState)]) {
            appState = application.applicationState;
        }
        switch ([userInfo[@"Tipo"] intValue]) {
            case 1:
                ;
                int distAuto=[self revisaAuto:userInfo];
                int distPersona=[self revisaPersonal:userInfo];
               if(distPersona>=0){
                    //avisaamigos
                     [self informa:userInfo :@"NotificaAmigos":distPersona];
                    if(distAuto>=0 && [userInfo[@"NotificacionesAuto"] intValue]==1){
                        //avisauto
                        [self informa:userInfo :@"NotificaAuto":distAuto];
                    }
                }else if(distAuto>=0 && [userInfo[@"NotificacionesAuto"] intValue]==1){
                    //avisauto
                    [self informa:userInfo :@"NotificaAuto":distAuto];
                }else{
                    if (appState == UIApplicationStateActive) {
                        
                        notificaciones=notificaciones+1;
                        notificationMessage = userInfo;
                        isInline = YES;
                        [self notificationReceived];
                    } else {
                        [self setNotification:[userInfo objectForKey:@"Titulo"]:[userInfo objectForKey:@"Subtitulo"]:@"Virtual Guardian"];
                        notificationMessage = userInfo;
                    }
                }
                break;
            case 10:
                SocketForeground=(appState == UIApplicationStateActive);
                notificationMessageTemp = userInfo;
                //***!if(!socket)[self socketInit];
                [self socketConnect];
                
                
                break;
            default:
                if (appState == UIApplicationStateActive) {
                    notificaciones=notificaciones+1;
                    notificationMessage = userInfo;
                    isInline = YES;
                    
                    [self notificationReceived];
                } else {
                    if([userInfo[@"Tipo"] intValue]<5)
                     [self setNotification:[userInfo objectForKey:@"Correo"]:[userInfo objectForKey:@"Subtitulo"]:@"Virtual Guardian"];
                     else [self setNotification:[userInfo objectForKey:@"Subtitulo"]:@"":[userInfo objectForKey:@"Titulo"]];
                    notificationMessage = userInfo;
                }
                break;
        }
        
        
    }
    return;

}
-(void) notificaLlamada{
    
    NSDictionary * userInfo=notificationMessageTemp;
    if (SocketForeground) {
        isInline = YES;
        notificationMessage = userInfo;
        [self notificationReceived];
    } else {
        [self setCallNotification:[userInfo objectForKey:@"Correo"]: [userInfo objectForKey:@"Subtitulo"]:userInfo];
            notificationMessage = userInfo;
            time=[NSTimer scheduledTimerWithTimeInterval:25.0
                                                  target:self
                                                selector:@selector(lostcall)
                                                userInfo:notificationMessage
                                                 repeats:NO];
    }
    

}
-(void) socketConnect{
   //***! [socket close];
   //***! [socket connectWithTimeoutAfter: 5 withTimeoutHandler: ^{
    //***!    [self socketOnError];
   //***! }];
}

-(void) socketOnConnect{
    SocketConected=true;
    NSLog(@"connected");
   //***! [ socket emit:@"listening" withItems:@[notificationMessageTemp[@"IdUsuario"]]];
}
-(void)isConnected:(NSArray *)data{
    NSLog(@"isconected");
    if([[data objectAtIndex:0] boolValue])[self notificaLlamada];
}
-(void)socketOnError{
    NSLog(@"socket error");
}

-(void)socketOnDisconnect{
    NSLog(@"socket disconect");
    SocketConected=false;
    [self perdida];
    [self timerOff];
    
}
-(void)socketOnEndCall{
    NSLog(@"colgaroon");
    [self perdida];
    [self timerOff];
}
-(void) socketInit{
    NSLog(@"initsocket");
    SocketConected=false;
    /*!socket = [[SocketIOClient alloc] initWithSocketURL:@"http://www.virtual-guardian.com:8303" options:@{@"log": @NO, @"connectParams": @{@"thing": @"value"}}];
    
    
    [socket on:@"connect" callback:^(NSArray* data, SocketAckEmitter* ack) {
        [self socketOnConnect];
    }];
    [socket on:@"disconnect" callback:^(NSArray* data, SocketAckEmitter* ack) {
        [self socketOnDisconnect];
    }];
    [socket on:@"error" callback:^(NSArray* data, SocketAckEmitter* ack) {
        [self socketOnError];
    }];
    [socket on:@"isConnected" callback:^(NSArray* data, SocketAckEmitter* ack) {
        [self isConnected:data];
    }];
    [socket on:@"colgaron" callback:^(NSArray* data, SocketAckEmitter* ack) {
        [self socketOnEndCall];
    }];!*/
}
-(void)lostcall {
    [self perdida];
    //avisa que no contesto
}
-(void)perdida {
    if(callNotification){
    [[UIApplication sharedApplication] cancelLocalNotification:callNotification];
   
    UILocalNotification *localNotification = [[UILocalNotification alloc] init];
    localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:0];
    localNotification.alertBody = [NSString stringWithFormat:@"Llamada perdida de %@",callNotification.userInfo[@"Correo"]];
    //localNotification.soundName = @"none.wav";
    localNotification.applicationIconBadgeNumber = 0;
     if(notificationMessage != nil)[[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
     notificationMessage = nil;
    callNotification=nil;
        //***![socket close];
    }
    

}
-(void)timerOff{
    [[UIApplication sharedApplication] cancelLocalNotification:callNotification];
    [time invalidate];
    time = nil;
    inCall=NO;
    notificationMessage = nil;
    callNotification=nil;
}
-(int)revisaPersonal:(NSDictionary *)userInfo{
    
    if ([CLLocationManager locationServicesEnabled]) {
        locationManager = [[CLLocationManager alloc] init];
        locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        
        //We want to see all location updates, regardless of distance change
        locationManager.distanceFilter = 200.0;
        locationManager.delegate = self;
        //funciona
        if ([locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
            [locationManager requestWhenInUseAuthorization];
        }
        [locationManager startUpdatingLocation];
        
        
        
        CLLocation *currentLocation=locationManager.location;
        if(currentLocation.coordinate.latitude){
        //NSLog(@"lati:%f,longi:%f",currentLocation.coordinate.latitude,currentLocation.coordinate.longitude);
        CLLocation *eventLoc=[[CLLocation alloc] initWithLatitude:[[userInfo objectForKey:@"Latitud"] doubleValue] longitude:[[userInfo objectForKey:@"Longitud"] doubleValue]];
        int dist=[self revisaDistancia:currentLocation:eventLoc];
        //NSLog(@"%d",dist);
        if(dist<=[userInfo[@"RangoPersonal"] intValue] && dist>0)
            return dist;
        else return -1;
        
        [locationManager stopUpdatingLocation];
        }else{
        [locationManager stopUpdatingLocation];
            return -1;
        }
    } else {
        return -2;
    }
    
}
-(int)revisaAuto:(NSDictionary *)userInfo{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    if([defaults objectForKey:@"CarLatitud"]){
        CLLocation *eventLoc=[[CLLocation alloc] initWithLatitude:[[userInfo objectForKey:@"Latitud"] doubleValue] longitude:[[userInfo objectForKey:@"Longitud"] doubleValue]];
        CLLocation *carroLoc=[[CLLocation alloc] initWithLatitude:[[defaults objectForKey:@"CarLatitud"] doubleValue] longitude:[[defaults objectForKey:@"CarLongitud"] doubleValue]];
        NSMutableDictionary *mutableDictionary = [userInfo mutableCopy];     //Make the dictionary mutable to change/add
        mutableDictionary[@"Distancia"] = [NSString stringWithFormat:@"%d",[self revisaDistancia:carroLoc:eventLoc] ];
        userInfo = mutableDictionary;
        
        if([userInfo[@"Distancia"] intValue]<=[userInfo[@"RangoAuto"] intValue]){
            return [userInfo[@"Distancia"] intValue];
        }
        else return -1;
    }else return -1;
    
}
-(void) informa:(NSDictionary *) userInfo:(NSString *)funcion:(int) distancia{
    NSString *post =[NSString stringWithFormat: @"IdEvento=%@&funcion=%@&IdUsuario=%@&Distancia=%d",userInfo[@"IdEvento"],funcion,userInfo[@"IdUsuario"],distancia ];
    NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    
    NSString *postLength = [NSString stringWithFormat:@"%d", [postData length]];
    NSLog(post);
    // In body data for the 'application/x-www-form-urlencoded' content type,
    // form fields are separated by an ampersand. Note the absence of a
    // leading ampersand.
    
    NSMutableURLRequest *postRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://www.virtual-guardian.com/portal/php/notificacionAndroid.php"]];
    
    // Set the request's content type to application/x-www-form-urlencoded
    [postRequest setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    // Designate the request a POST request and specify its body data
    [postRequest setHTTPMethod:@"POST"];
    [postRequest setHTTPBody:[NSData dataWithBytes:[post UTF8String] length:strlen([post UTF8String])]];
    
    // Initialize the NSURLConnection and proceed as described in
    // Retrieving the Contents of a URL
    NSURLRequest *theRequest=[NSURLRequest requestWithURL:[NSURL URLWithString:@"https://www.virtual-guardian.com/portal/php/notificacionAndroid.php"]
                                              cachePolicy:NSURLRequestUseProtocolCachePolicy
                                          timeoutInterval:60.0];
    
    // Create the NSMutableData to hold the received data.
    // receivedData is an instance variable declared elsewhere.
    NSMutableData *receivedData = [NSMutableData dataWithCapacity: 0];
    
    // create the connection with the request
    // and start loading the data
    NSURLConnection *theConnection=[[NSURLConnection alloc] initWithRequest:postRequest delegate:self];
    if (!theConnection) {
        // Release the receivedData object.
        receivedData = nil;
        
        
        // Inform the user that the connection failed.
    }
}
-(int)revisaDistancia:(CLLocation *) cord1:(CLLocation *)cord2{
    
    CLLocationDistance distance = [cord1 distanceFromLocation:cord2];
    return distance;
    
}
- (IBAction)setNotification:(NSString *)titulo: (NSString *)subtitulo:(NSString *) BigTitle {
    
    notificaciones=notificaciones+1;
    [UIApplication sharedApplication].applicationIconBadgeNumber++;
    UILocalNotification *localNotification = [[UILocalNotification alloc] init];
    localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:0];
    localNotification.alertBody = [NSString stringWithFormat:@"%@: %@",titulo,subtitulo];
    //if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0.0"))localNotification.alertTitle=[NSString stringWithFormat:@"%@",BigTitle];
    localNotification.soundName = UILocalNotificationDefaultSoundName;
    localNotification.applicationIconBadgeNumber = 0;
    [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
}

- (IBAction)setCallNotification:(NSString *)titulo: (NSString *)subtitulo:(NSDictionary *) data {
    //notificaciones=notificaciones+1;
    [UIApplication sharedApplication].applicationIconBadgeNumber++;
    callNotification = [[UILocalNotification alloc] init];
    callNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:0];
    callNotification.alertBody = [NSString stringWithFormat:@"%@ %@",subtitulo,titulo];
    //if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0.0"))localNotification.alertTitle=[NSString stringWithFormat:@"%@",titulo];
    callNotification.userInfo=data;
    callNotification.category=@"call";
    callNotification.soundName = @"marimba.wav";
    callNotification.alertAction=@"responder";
    callNotification.applicationIconBadgeNumber = 0;
    [[UIApplication sharedApplication] scheduleLocalNotification:callNotification];
    
    
    
     
    //AudioServicesPlayAlertSound(kSystemSoundID_Vibrate);
    //AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    //[self presentViewController:[UIApplication sharedApplication].keyWindow.rootViewController animated:YES completion:nil];
}
-(void) cleanCallNot
{
    NSLog(@"desaparece");
}

- (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
	[self failWithMessage:@"" withError:error];
}

- (void)notificationReceived {
    NSLog(@"Notification received");
    
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    NSLog(@"%@",self.callback);

    if (notificationMessage && self.callback)
    {
        NSMutableString *jsonStr = [NSMutableString stringWithString:@"{"];

        [self parseDictionary:notificationMessage intoJSON:jsonStr];
        [jsonStr appendFormat:@"notificaciones:\"%d\",", notificaciones];
        if (isInline)
        {
            [jsonStr appendFormat:@"foreground:\"%d\"", 1];
            isInline = NO;
        }
		else
            [jsonStr appendFormat:@"foreground:\"%d\"", 0];
        
        [jsonStr appendString:@"}"];

        NSLog(@"Msg: %@", jsonStr);

        NSString * jsCallBack = [NSString stringWithFormat:@"%@(%@);", self.callback, jsonStr];
        dispatch_async(dispatch_get_main_queue(), ^{
            //all you ever do with UIKit.. in your case the reloadData call
            //[self.tableView reloadData];
            [self.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
        });
        
        self.notificationMessage = nil;
        notificaciones=0;
        [self timerOff];
       //***! if(socket)[socket close];
    }
}

// reentrant method to drill down and surface all sub-dictionaries' key/value pairs into the top level json
-(void)parseDictionary:(NSDictionary *)inDictionary intoJSON:(NSMutableString *)jsonString
{
    NSArray         *keys = [inDictionary allKeys];
    NSString        *key;
    
    for (key in keys)
    {
        id thisObject = [inDictionary objectForKey:key];
    
        if ([thisObject isKindOfClass:[NSDictionary class]])
            [self parseDictionary:thisObject intoJSON:jsonString];
        else if ([thisObject isKindOfClass:[NSString class]])
             [jsonString appendFormat:@"\"%@\":\"%@\",",
              key,
              [[[[inDictionary objectForKey:key]
                stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"]
                 stringByReplacingOccurrencesOfString:@"\"" withString:@"\\\""]
                 stringByReplacingOccurrencesOfString:@"\n" withString:@"\\n"]];
        else {
            [jsonString appendFormat:@"\"%@\":\"%@\",", key, [inDictionary objectForKey:key]];
        }
    }
}

- (void)setApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command {

    self.callbackId = command.callbackId;

    NSMutableDictionary* options = [command.arguments objectAtIndex:0];
    int badge = [[options objectForKey:@"badge"] intValue] ?: 0;

    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:badge];

    [self successWithMessage:[NSString stringWithFormat:@"app badge count set to %d", badge]];
}
-(void)successWithMessage:(NSString *)message
{
    if (self.callbackId != nil)
    {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
    }
}

-(void)failWithMessage:(NSString *)message withError:(NSError *)error
{
    NSString        *errorMessage = (error) ? [NSString stringWithFormat:@"%@ - %@", message, [error localizedDescription]] : message;
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
    
}



@end

