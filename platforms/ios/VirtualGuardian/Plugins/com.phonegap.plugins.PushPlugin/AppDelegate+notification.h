//
//  AppDelegate+notification.h
//  pushtest
//
//  Created by Robert Easterday on 10/26/12.
//
//

#import "AppDelegate.h"
#import <CoreLocation/CoreLocation.h>

@interface AppDelegate (notification)
- (void)applicationDidBecomeActive:(UIApplication *)application;
- (id) getCommandInstance:(NSString*)className;
- (void)notificawv;

@property (nonatomic, retain) NSDictionary	*launchNotification;
@property (nonatomic, retain) UILocalNotification* local;
@property (nonatomic,retain) NSString *DistanciaAuto;
@end