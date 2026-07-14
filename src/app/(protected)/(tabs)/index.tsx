import PostListItem from '@/components/PostListItem';
import { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions, Platform, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import FeedTab from '@/components/GenericComponents/FeedTab';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/services/posts';



const TABS = {
    EXPLORE: 'Explore',
    FOLLOWING: 'Following',
    FOR_YOU: 'For You',
}

export default function HomeScreen() {
    const { height: windowHeight } = useWindowDimensions();
    const tabBarHeight = useBottomTabBarHeight();
    const itemHeight = windowHeight - tabBarHeight;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS.FOR_YOU);


    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam }) => fetchPosts(pageParam),
        initialPageParam: { limit: 3, cursor: undefined },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return {
                limit: 3,
                cursor: lastPage[lastPage.length - 1].id
            }
        }
    })


    const posts = useMemo(() => data?.pages.flat() || [], [data])


    if (isLoading) {
        return (
            <ActivityIndicator size={'large'} style={{ flex: 1, justifyContent: 'center' }} />
        )
    }
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{
                    color: "#fff",
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 10
                }}>
                    Error Occured while fetching the posts

                </Text>
            </View>
        )
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
        setCurrentIndex(newIndex);
    };

    return (
        <View style={{ height: itemHeight }}>

            <View style={styles.topBar}>
                <MaterialIcons name="live-tv" size={24} color="white" />
                <View style={styles.navigationBar}>
                    <FeedTab title={TABS.EXPLORE} setActiveTab={setActiveTab} activeTab={activeTab} />
                    <FeedTab title={TABS.FOLLOWING} setActiveTab={setActiveTab} activeTab={activeTab} />
                    <FeedTab title={TABS.FOR_YOU} setActiveTab={setActiveTab} activeTab={activeTab} />

                </View>
                <Ionicons name="search" size={24} color="white" />
            </View>
            <FlatList
                style={{ flex: 1 }}
                data={posts}
                renderItem={({ item, index }) => <PostListItem postItem={item} isActive={currentIndex === index} height={itemHeight} />}
                showsVerticalScrollIndicator={false}
                pagingEnabled={Platform.OS === 'web'}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                disableIntervalMomentum
                onScroll={onScroll}
                scrollEventThrottle={16}
                onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
                onEndReachedThreshold={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        gap: 30,

    },
    topBar: {
        flexDirection: 'row',
        position: 'absolute',
        top: 70,
        zIndex: 1,
        width: '100%',
        paddingHorizontal: 15,
    }
});