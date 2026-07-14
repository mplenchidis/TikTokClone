import { Text, View, Button, StyleSheet, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView, } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function NewPostScreen() {

    const [facing, setFacing] = useState<CameraType>('back');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [video, setVideo] = useState<string>();

    const cameraRef = useRef<CameraView>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();


    const videoPlayer = useVideoPlayer(null, (player) => {
        player.loop = true;
    });

    useEffect(() => {


        (async () => {
            if (permission && !permission.granted && permission.canAskAgain) {
                await requestPermission();
            }
            if (microphonePermission && !microphonePermission.granted && microphonePermission.canAskAgain) {
                await requestMicrophonePermission();
            }
        })()

    }, [permission, microphonePermission]);

    if (!permission || !microphonePermission) {
        return < View />;
    }


    if ((permission && !permission.granted && !permission.canAskAgain) || (microphonePermission && !microphonePermission.granted && !microphonePermission.canAskAgain)) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>We need your permission to use the camera and microphone to record videos.</Text>
                <Button title="Grant Permission" onPress={() => Linking.openSettings()} />
            </View>
        );
    }

    const toggleCamera = () => setFacing(facing === 'back' ? 'front' : 'back');

    const selectFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            aspect: [9, 16],
        })
        if (!result.canceled) {
            const uri = result.assets[0].uri
            setVideo(uri)
            await videoPlayer.replaceAsync(uri)
            videoPlayer.play
        }
    }

    const dismissVideo = () => {
        setVideo(undefined)
        videoPlayer.release()
    }

    const postVideo = () => {
    }

    const stopRecording = () => {
        setIsRecording(false);
        cameraRef.current?.stopRecording();


    }
    const startRecording = async () => {
        setIsRecording(true);
        const recordedVideo = await cameraRef.current?.recordAsync();
        if (recordedVideo?.uri) {
            const uri = recordedVideo.uri
            setVideo(uri);
            await videoPlayer.replaceAsync(uri)
            videoPlayer.play()
            console.log('Recorded video URI:', uri);
        }
    }


    const renderCamera = () => {
        return (
            <View style={{ flex: 1 }}>
                <Text>New Post</Text>
                <CameraView mode="video" ref={cameraRef} style={{ flex: 1 }} facing={facing} />
                <View style={styles.tobBar}>
                    <Ionicons name="close" size={40} color="white" onPress={() => router.back()} />
                </View>
                <View style={styles.bottomControls}>
                    <Ionicons name="images" size={40} color="white" onPress={selectFromGallery} />
                    <TouchableOpacity style={[
                        styles.recordButton,
                        isRecording && styles.recordingButton,
                    ]} onPress={isRecording ? stopRecording : startRecording} />
                    <Ionicons name="camera-reverse" size={40} color="white" onPress={toggleCamera} />

                </View>
            </View>
        )
    }


    const renderRecorderVideo = () => {
        return (
            <SafeAreaView
                edges={['bottom']}
                style={{ flex: 1 }}>
                <Ionicons name="close" size={32} color="white" onPress={dismissVideo} style={styles.closeIcon} />
                <View style={styles.videoContainer}>
                    <VideoView

                        player={videoPlayer}
                        contentFit='cover'
                        style={styles.videoPlayer}
                    />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.descriptionContainer}
                    keyboardVerticalOffset={20}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Add a description..."
                        placeholderTextColor="#aaa"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    >


                    </TextInput>

                    <TouchableOpacity style={styles.postButton} onPress={postVideo}>
                        <Text style={styles.postText}>Post</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }



    return (
        <>
            {video ? renderRecorderVideo() : renderCamera()}
        </>
    );
}

const styles = StyleSheet.create({
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    permissionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',

    },
    recordButton: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
    },
    recordingButton: {
        backgroundColor: 'red',
    },
    tobBar: {
        position: 'absolute',
        top: 50,
        left: 10,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    closeIcon: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 1

    },
    videoPlayer: {
        aspectRatio: 9 / 16,
    },
    input: {
        flex: 1,
        color: 'white',
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 15,
        maxHeight: 110,
        paddingHorizontal: 10,
    },
    postButton: {
        backgroundColor: "#FF0050",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    postText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: '700'
    },
    videoContainer: {
        flex: 1,

    },
    descriptionContainer: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15

    }
});