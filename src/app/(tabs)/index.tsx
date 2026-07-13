import PostListItem from '@/components/PostListItem';
import posts from '@assets/data/posts.json';
import { FlatList, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View >
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostListItem postItem={item} />}
            />
        </View>
    );
}