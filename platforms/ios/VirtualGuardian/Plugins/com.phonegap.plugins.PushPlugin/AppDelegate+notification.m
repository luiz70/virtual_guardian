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
    //[pushHandler didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application handleActionWithIdentifier:(NSString *)identifier forLocalNotification:(UILocalNotification *)notification completionHandler:(void (^)())completionHandler
{
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    if ([identifier isEqualToString:@"aceptar"])
    {
        [pushHandler aceptcall];
        //[[FightManager sharedManager] fightLikeAnIdiot];
    }
    else if ([identifier isEqualToString:@"rechazar"])
    {
        [pushHandler cancelcall];
        //[[FightManager sharedManager] surrenderLikeABaby];
    }
    
    completionHandler();
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    [pushHandler didFailToRegisterForRemoteNotificationsWithError:error];
}

-(void)notificawv{
    PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
    [pushHandler notificationReceived];

}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    
    NSLog(@"active");
    /*SocketIOClient * socket = [[SocketIOClient alloc] initWithSocketURL:@"localhost:8080" opts:nil];
    
    [socket on:@"connect" callback:^(NSArray* data, SocketAckEmitter* ack) {
        NSLog(@"socket connected");
    }];
    
    [socket on:@"currentAmount" callback:^(NSArray* data, SocketAckEmitter* ack) {
        double cur = [[data objectAtIndex:0] floatValue];
        
        [socket emitWithAck:@"canUpdate" withItems:@[@(cur)]](0, ^(NSArray* data) {
            [socket emit:@"update" withItems:@[@{@"amount": @(cur + 2.50)}]];
        });
        
        [ack with:@[@"Got your currentAmount, ", @"dude"]];
    }];
    
    [socket connect];*/
    
    //zero badge
    
    if(application.applicationIconBadgeNumber!=0){
        application.applicationIconBadgeNumber= 0;
        PushPlugin *pushHandler = [self getCommandInstance:@"PushPlugin"];
        [pushHandler notificationReceived];
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

@end
