@import AudioToolbox;
@import AVFoundation;
#import <Cordova/CDVPlugin.h>

@interface AudioTogglePlugin : CDVPlugin
{
    SystemSoundID  pewPewSound;
    AVAudioPlayer *backgroundMusicPlayer;
}
- (void)setAudioMode:(CDVInvokedUrlCommand*)command;
-(void)playTone:(CDVInvokedUrlCommand *)command;
//@property SystemSoundID  pewPewSound;

@end
