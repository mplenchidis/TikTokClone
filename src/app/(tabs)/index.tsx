import PostListItem from '@/components/PostListItem';
import posts from '@assets/data/posts.json';
import { useRef, useState, } from 'react';
import { Dimensions, FlatList, View, ViewToken, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import FeedTab from '@/components/GenericComponents/FeedTab';



const TABS = {
    EXPLORE: 'Explore',
    FOLLOWING: 'Following',
    FOR_YOU: 'For You',
}

export default function HomeScreen() {
    const height = Dimensions.get('window').height;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS.FOR_YOU);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    });

    console.log('Current Index:', currentIndex);

    return (
        <View>

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
                data={posts}
                renderItem={({ item, index }) => <PostListItem postItem={item} isActive={currentIndex === index} />}
                showsVerticalScrollIndicator={false}
                snapToInterval={height - 80}
                decelerationRate="fast"
                disableIntervalMomentum
                onViewableItemsChanged={onViewableItemsChanged.current}
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