@import MediaPlayer;
#import "AudioTogglePlugin.h"
#import <AudioToolbox/AudioToolbox.h>
#import <AVFoundation/AVFoundation.h>

@implementation AudioTogglePlugin

//@synthesize pewPewSound;
- (void)setAudioMode:(CDVInvokedUrlCommand *)command
{
    NSError* __autoreleasing err = nil;
    NSString* mode = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:0]];
    
    UInt32 audioRouteOverride = kAudioSessionOverrideAudioRoute_None;
    AVAudioSession *session = [AVAudioSession sharedInstance];
    
    if ([mode isEqualToString:@"earpiece"]) {
        NSLog(@"ear");
        [session setCategory:AVAudioSessionCategoryPlayAndRecord withOptions:AVAudioSessionCategoryOptionAllowBluetooth error:&err];
        audioRouteOverride = kAudioSessionProperty_OverrideCategoryDefaultToSpeaker;
        AudioSessionSetProperty(kAudioSessionProperty_OverrideAudioRoute, sizeof(audioRouteOverride), &audioRouteOverride);
    } else if ([mode isEqualToString:@"speaker"]) {
        NSLog(@"speak");
        [session setCategory:AVAudioSessionCategoryAmbient withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker error:&err];
    }
}
-(void) playTone:(CDVInvokedUrlCommand *)command
{
    //[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryRecord error:nil];
   /*NSString *pewPewPath = [[NSBundle mainBundle]
                            pathForResource:@"callTone" ofType:@"wav"];
    NSURL *pewPewURL = [NSURL fileURLWithPath:pewPewPath];
    AudioServicesCreateSystemSoundID((__bridge CFURLRef)pewPewURL,  &pewPewSound);
    AudioServicesPlaySystemSound(pewPewSound);
    NSError *error;*/
   
     NSString *backgroundMusicPath = [[NSBundle mainBundle] pathForResource:@"callTone" ofType:@"wav"];
     NSURL *backgroundMusicURL = [NSURL fileURLWithPath:backgroundMusicPath];
    
     backgroundMusicPlayer = [[AVAudioPlayer alloc]
     initWithContentsOfURL:backgroundMusicURL error:nil];
    
    backgroundMusicPlayer.delegate = self;  // We need this so we can restart after interruptions
    backgroundMusicPlayer.numberOfLoops = 1;	// Negative number means loop forever
    [backgroundMusicPlayer prepareToPlay];
    [backgroundMusicPlayer play];
    NSError *setCategoryErr = nil;
    NSError *activationErr  = nil;
    [[AVAudioSession sharedInstance] setActive:YES error:nil];
    [MPRemoteCommandCenter sharedCommandCenter].previousTrackCommand.enabled = NO;
    [MPRemoteCommandCenter sharedCommandCenter].skipBackwardCommand.enabled = NO;
    [MPRemoteCommandCenter sharedCommandCenter].seekBackwardCommand.enabled = NO;
    [MPRemoteCommandCenter sharedCommandCenter].playCommand.enabled = NO;
    [MPRemoteCommandCenter sharedCommandCenter].pauseCommand.enabled=NO;
    [[MPRemoteCommandCenter sharedCommandCenter].playCommand
 addTarget:self action:@selector(play)];
   /* NSNumber * n=0;
    NSMutableDictionary *songInfo = [[NSMutableDictionary alloc] init];
    [songInfo setObject:@"" forKey:MPMediaItemPropertyTitle];
    [songInfo setObject:@"" forKey:MPMediaItemPropertyArtist];
    [songInfo setObject:@"" forKey:MPMediaItemPropertyAlbumTitle];
    //[songInfo setObject:n forKey:MPMediaItemPropertyPlaybackDuration];
    
    [[MPNowPlayingInfoCenter defaultCenter] setNowPlayingInfo:songInfo];*/
    
}
-(void) stopTone:(CDVInvokedUrlCommand *)command{
    if(backgroundMusicPlayer){
        [backgroundMusicPlayer stop];
        backgroundMusicPlayer=NULL;
    }
}
-(void)play{
    NSLog(@"played");
}

@end
