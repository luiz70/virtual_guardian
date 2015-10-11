#ifndef SwiftIOObjc_Tester_h
#define SwiftIOObjc_Tester_h

@class SocketIOClient;

@interface Tester : NSObject

@property (readwrite, nonatomic) SocketIOClient* socket;

- (id)init;
- (void)connect;
- (void)sendMessage:(NSString*)msg;

@end

#endif