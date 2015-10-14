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

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>
#import <PushKit/PushKit.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import <Socket_IO_Client_Swift/Socket_IO_Client_Swift-Swift.h>

@interface PushPlugin : CDVPlugin
{
    NSDictionary *notificationMessage;
    NSDictionary *notificationMessageTemp;
    BOOL    isInline;
    NSString *notificationCallbackId;
    NSString *callback;
    int notificaciones;
    BOOL background;
    BOOL ready;
    BOOL inCall;
    NSTimer *time;
    SocketIOClient* socket;
    BOOL SocketForeground;
    BOOL SocketConected;
    
}
@property BOOL  background;
@property (nonatomic, copy) NSString *callbackId;
@property (nonatomic, copy) NSString *notificationCallbackId;
@property (nonatomic, copy) NSString *callback;
@property (nonatomic,copy) CLLocationManager *locationManager;
@property (nonatomic,retain) NSString *DistanciaAuto;
@property (nonatomic, strong) NSDictionary *notificationMessage;
@property (nonatomic, strong) NSDictionary *notificationMessageTemp;
@property (nonatomic,copy) UILocalNotification * callNotification;
@property (nonatomic,copy) SocketIOClient * socket;
@property BOOL                          isInline;
@property int notificaciones;

- (void)register:(CDVInvokedUrlCommand*)command;
- (void)carLocation:(CDVInvokedUrlCommand*)command;
- (void)cancelcall;
- (void)aceptcall;
- (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error;
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type;
- (void)setNotificationMessage:(NSDictionary *)notification;
- (void)notificationReceived;


@end