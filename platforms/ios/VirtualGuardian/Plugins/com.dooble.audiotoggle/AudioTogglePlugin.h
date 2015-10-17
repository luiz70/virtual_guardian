@import AudioToolbox;
@import AVFoundation;
#import <Cordova/CDVPlugin.h>

@interface AudioTogglePlugin : CDVPlugin
{
    SystemSoundID  pewPewSound;
    AVAudioPlayer *backgroundMusicPlayer;
    AVAudioPlayer *backgroundMusicPlayer2;
}
- (void)setAudioMode:(CDVInvokedUrlCommand*)command;
-(void)playTone:(CDVInvokedUrlCommand *)command;
-(void)playBye:(CDVInvokedUrlCommand *)command;
//@property SystemSoundID  pewPewSound;

@end
