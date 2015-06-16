//
//  AppDelegate+notification.m
//  pushtest
//
//  Created by Robert Easterday on 10/26/12.
//
//

#import "AppDelegate+notification.h"
#import "PushPlugin.h"
#import <objc/runtime.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>

static char launchNotificationKey;

CLLocationManager *locationManager;
NSMutableArray *locations;

@implementation AppDelegate (notification)


- (id) getCommandInstance:(NSString*)className
{
	return [self.viewController getCommandInstance:className];
}
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
// its dangerous to override a method from within a category.
// Instead we will use method swizzling. we set this up in the load call.
+ (void)load
{
    Method original, swizzled;
    
    original = class_getInstanceMethod(self, @selector(init));
    swizzled = class_getInstanceMethod(self, @selector(swizzled_init));
    method_exchangeImplementations(original, swizzled);
    
}

- (AppDelegate *)swizzled_init
{
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(createNotificationChecker:)
               name:@"UIApplicationDidFinishLaunchingNotification" object:nil];
	
	// This actually calls the original init method over in AppDelegate. Equivilent to calling super
	// on an overrided method, this is not recursive, although it appears that way. neat huh?
	return [self swizzled_init];
}

// This code will be called immediately after application:didFinishLaunchingWithOptions:. We need
// to process notifications in cold-start situations

- (void)createNotificationChecker:(NSNotification *)notification
{
	if (notification)
	{
		NSDictionary *launchOptions = [notification userInfo];
		if (launchOptions)
			self.launchNotification = [launchOptions objectForKey: @"UIApplicationLaunchOptionsRemoteNotificationKey"];
	}
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    [pushHandler didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    [pushHandler didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler{
    //revisa registro
    
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
                    if(distAuto>=0){
                        //avisauto
                        [self informa:userInfo :@"NotificaAuto":distAuto];
                    }
                }else if(distAuto>=0){
                    //avisauto
                    [self informa:userInfo :@"NotificaAuto":distAuto];
                }else{
                    if (appState == UIApplicationStateActive) {
                        PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
                        pushHandler.notificaciones=pushHandler.notificaciones+1;
                        pushHandler.notificationMessage = userInfo;
                        pushHandler.isInline = YES;
                        [pushHandler notificationReceived];
                    } else {
                        [self setNotification:[userInfo objectForKey:@"Titulo"]:[userInfo objectForKey:@"Subtitulo"]:@"Virtual Guardian"];
                        self.launchNotification = userInfo;
                    }
                }
                break;
                
                default:
                    if (appState == UIApplicationStateActive) {
                        PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
                        pushHandler.notificaciones=pushHandler.notificaciones+1;
                        pushHandler.notificationMessage = userInfo;
                        pushHandler.isInline = YES;
                        [pushHandler notificationReceived];
                    } else {
                        if([userInfo[@"Tipo"] intValue]<5)
                        [self setNotification:[userInfo objectForKey:@"Titulo"]:[userInfo objectForKey:@"Subtitulo"]:@"Virtual Guardian"];
                        else [self setNotification:[userInfo objectForKey:@"Subtitulo"]:@"":[userInfo objectForKey:@"Titulo"]];
                        self.launchNotification = userInfo;
                    }
                break;
            }
        
        
    }
    completionHandler(UIBackgroundFetchResultNoData);
    return;
}


-(BOOL)revisaPersonal:(NSDictionary *)userInfo{
    
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
        //NSLog(@"%f,%f",currentLocation.coordinate.latitude,currentLocation.coordinate.longitude);
        CLLocation *eventLoc=[[CLLocation alloc] initWithLatitude:[[userInfo objectForKey:@"Latitud"] doubleValue] longitude:[[userInfo objectForKey:@"Longitud"] doubleValue]];
        int dist=[self revisaDistancia:currentLocation:eventLoc];
       //NSLog(@"%d",dist);
        if(dist<=[userInfo[@"RangoPersonal"] intValue] && dist>0)
        return dist;
        else return -1;
        [locationManager stopUpdatingLocation];

    } else {
        return -1;
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
    
    NSMutableURLRequest *postRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://45.40.137.37/portal/php/notificacionAndroid.php"]];
    
    // Set the request's content type to application/x-www-form-urlencoded
    [postRequest setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    // Designate the request a POST request and specify its body data
    [postRequest setHTTPMethod:@"POST"];
    [postRequest setHTTPBody:[NSData dataWithBytes:[post UTF8String] length:strlen([post UTF8String])]];
    
    // Initialize the NSURLConnection and proceed as described in
    // Retrieving the Contents of a URL
    NSURLRequest *theRequest=[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://www.virtual-guardian.com/portal/php/notificacionAndroid.php"]
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
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    pushHandler.notificaciones=pushHandler.notificaciones+1;
    UILocalNotification *localNotification = [[UILocalNotification alloc] init];
    localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:0];
    localNotification.alertBody = [NSString stringWithFormat:@"%@: %@",titulo,subtitulo];
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0.0"))localNotification.alertTitle=[NSString stringWithFormat:@"%@",BigTitle];
    localNotification.soundName = UILocalNotificationDefaultSoundName;
    localNotification.applicationIconBadgeNumber = 0;
    [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    
    NSLog(@"active");
    
    //zero badge
    application.applicationIconBadgeNumber = 0;

    if (self.launchNotification) {
        NSLog(@"active");
        PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
		
        pushHandler.notificationMessage = self.launchNotification;
        self.launchNotification = nil;
        [pushHandler performSelectorOnMainThread:@selector(notificationReceived) withObject:pushHandler waitUntilDone:NO];
    }
}

// The accessors use an Associative Reference since you can't define a iVar in a category
// http://developer.apple.com/library/ios/#documentation/cocoa/conceptual/objectivec/Chapters/ocAssociativeReferences.html
- (NSMutableArray *)launchNotification
{
   return objc_getAssociatedObject(self, &launchNotificationKey);
}

- (void)setLaunchNotification:(NSDictionary *)aDictionary
{
    objc_setAssociatedObject(self, &launchNotificationKey, aDictionary, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)dealloc
{
    self.launchNotification	= nil; // clear the association and release the object
}
#pragma mark
#pragma mark locationManager delegate methods

-(void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    NSString *currentLatitude = [[NSString alloc] initWithFormat:@"%g", newLocation.coordinate.latitude];
    NSLog(@"AppDelegate says: latitude: %@", currentLatitude);
}

/*- (void)locationManager: (CLLocationManager *)manager
    didUpdateToLocation: (CLLocation *)newLocation
           fromLocation: (CLLocation *)oldLocation
{
    
    float latitude = newLocation.coordinate.latitude;
    NSLog([NSString stringWithFormat:@"%f",latitude]);
    float longitude = newLocation.coordinate.longitude;
    NSLog([NSString stringWithFormat:@"%f", longitude]);
    //[self returnLatLongString:strLatitude:strLongitude];
    
}

/*-(NSString*)returnLatLongString
{
    NSString *str = @"lat=";
    str = [str stringByAppendingString:strLatitude];
    str = [str stringByAppendingString:@"&long="];
    str = [str stringByAppendingString:strLongitude];
    
    return str;
}*/
@end
