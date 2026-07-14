import { Post } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router/build/exports';
import { useVideoPlayer, VideoView, } from "expo-video";
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";




type VideoItemProps = {
    postItem: Post
    isActive: boolean
    height: number
}


export default function PostListItem({ postItem, isActive, height }: VideoItemProps) {
    const { video_url, nrOfLikes, description, user, nrOfComments, nrOfShares } = postItem;
    const player = useVideoPlayer(video_url, player => {
        player.loop = true;

    })


    useFocusEffect(
        useCallback(() => {
            if (!player) return;
            try {
                if (isActive) {
                    player.play();
                }
            } catch (error) {
                console.error('Error playing video:', error);
            }
            return () => {
                try {
                    if (player && isActive) {
                        player.pause();
                    }
                } catch (error) {
                    console.error('Error pausing video:', error);
                }
            }
        }, [isActive, player])
    );






    return (
        <View style={{ height }}>
            <VideoView style={{ flex: 1 }} player={player} contentFit="cover" nativeControls={false} />
            <View style={styles.interactionBar}>
                <TouchableOpacity style={styles.interactionButton} onPress={() => console.log('Like pressed')} >
                    <Ionicons name="heart" size={33} color="#fff" />
                    <Text style={styles.interactionText}>{0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interactionButton} onPress={() => console.log('Comment Pressed')} >
                    <Ionicons name="chatbubble" size={30} color="#fff" />
                    <Text style={styles.interactionText}>{nrOfComments[0].count || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionButton} onPress={() => console.log('Share Pressed')} >
                    <Ionicons name="arrow-redo" size={33} color="#fff" />
                    <Text style={styles.interactionText}>{0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionButton} onPress={() => console.log('Profile Pressed')} >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.videoInfo}>

                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    interactionBar: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        alignItems: 'center',
        gap: 25,
    },
    interactionButton: {
        alignItems: 'center',
        gap: 5,
    },
    interactionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',

    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    videoInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 100,
        gap: 5,
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        color: '#fff',
        fontWeight: '400',
    }

})