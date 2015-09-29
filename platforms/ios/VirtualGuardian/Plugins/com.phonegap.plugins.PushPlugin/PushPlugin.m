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

#import "PushPlugin.h"
#import <PushKit/PushKit.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "AppDelegate+notification.h"
#import "CDVBackgroundGeoLocation.h"
#import <AudioToolbox/AudioServices.h>
#import "MainViewController.h"

@implementation PushPlugin

@synthesize notificationMessage;
@synthesize notificaciones;
@synthesize isInline;

@synthesize callbackId;
@synthesize notificationCallbackId;
@synthesize callback;
@synthesize locationManager;

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
    notificationAction1.identifier = @"Accept";
    notificationAction1.title = @"Responder";
    notificationAction1.activationMode = UIUserNotificationActivationModeBackground;
    notificationAction1.destructive = NO;
    notificationAction1.authenticationRequired = NO;
    
    UIMutableUserNotificationAction *notificationAction2 = [[UIMutableUserNotificationAction alloc] init];
    notificationAction2.identifier = @"Reject";
    notificationAction2.title = @"Rechazar";
    notificationAction2.activationMode = UIUserNotificationActivationModeBackground;
    notificationAction2.destructive = YES;
    notificationAction2.authenticationRequired = YES;
    
    UIMutableUserNotificationCategory *notificationCategory = [[UIMutableUserNotificationCategory alloc] init];
    notificationCategory.identifier = @"call";
    [notificationCategory setActions:@[notificationAction1,notificationAction2] forContext:UIUserNotificationActionContextDefault];
    [notificationCategory setActions:@[notificationAction1,notificationAction2] forContext:UIUserNotificationActionContextMinimal];
    
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
// Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type {
    NSLog(@"hola");
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
                if (appState == UIApplicationStateActive) {
                    notificationMessage = userInfo;
                    isInline = YES;
                    
                    [self notificationReceived];
                } else {
                    //if([userInfo[@"Valid"] intValue]==1){
                       // [self setCallNotification:[userInfo objectForKey:@"Correo"]: [userInfo objectForKey:@"Subtitulo"]:userInfo];
                   // notificationMessage = userInfo;
                    /*}else{
                     notificationMessage = nil;
                        UIApplication *app = [UIApplication sharedApplication];
                        NSArray *eventArray = [app scheduledLocalNotifications];
                        for (int i=0; i<[eventArray count]; i++)
                        {
                            UILocalNotification* oneEvent = [eventArray objectAtIndex:i];
                            NSDictionary *userInfoCurrent = oneEvent.userInfo;
                            NSString *uid=[NSString stringWithFormat:@"%@",[userInfoCurrent valueForKey:@"uid"]];
                            NSLog(@"%d", [userInfoCurrent[@"Tipo"] intValue]);
                            /*if ([uid isEqualToString:uidtodelete])
                            {
                                //Cancelling local notification
                                [app cancelLocalNotification:oneEvent];
                                break;
                            }
                        }
                    }*/
                }
                break;
            default:
                if (appState == UIApplicationStateActive) {
                    notificaciones=notificaciones+1;
                    notificationMessage = userInfo;
                    isInline = YES;
                    
                    [self notificationReceived];
                } else {
                    //if([userInfo[@"Tipo"] intValue]<5)
                     [self setNotification:[userInfo objectForKey:@"Correo"]:[userInfo objectForKey:@"Subtitulo"]:@"Virtual Guardian"];
                     //else [self setNotification:[userInfo objectForKey:@"Subtitulo"]:@"":[userInfo objectForKey:@"Titulo"]];
                    notificationMessage = userInfo;
                }
                break;
        }
        
        
    }
    return;

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
    //[UIApplication sharedApplication].applicationIconBadgeNumber++;
   /* UILocalNotification *localNotification = [[UILocalNotification alloc] init];
    localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:0];
    localNotification.alertBody = [NSString stringWithFormat:@"%@\n%@",titulo,subtitulo];
    //if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0.0"))localNotification.alertTitle=[NSString stringWithFormat:@"%@",BigTitle];
    localNotification.userInfo=data;
    localNotification.category=@"call";
    localNotification.soundName = UILocalNotificationDefaultSoundName;
    localNotification.applicationIconBadgeNumber = 0;
    [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];*/
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    MainViewController *rootViewController = window.rootViewController;
    [rootViewController alert ];
     
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
@implementation TestViewController
- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

-(void)loadView
{
    self.view = [[UIView alloc]initWithFrame:[UIScreen mainScreen].applicationFrame];
    self.view.backgroundColor = [UIColor grayColor];
    [self alert ];
}
- (void)alert {
    UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"My Alert"
                                                                   message:@"This is an alert."
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * action) {}];
    
    [alert addAction:defaultAction];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex {
    if(buttonIndex == 0) {
        NSLog(@"OK Button is clicked");
    }
    else if(buttonIndex == 1) {
        NSLog(@"Cancel Button is clicked");
    }
}

@end
