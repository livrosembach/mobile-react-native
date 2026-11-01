import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  SectionList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, ChevronRight, Star, LogOut } from 'lucide-react-native';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';
import { LibraryBook, ReadingStatus } from '../types/book';
import { getCoverUrl, READING_STATUS_LABELS } from '../utils';
import { Button } from '../components/Button';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MyBooks'>,
  NativeStackScreenProps<RootStackParamList>
>;

const STATUS_ORDER: ReadingStatus[] = ['reading', 'want_to_read', 'read'];

export function MyBooksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { library, setReadingStatus, setRating, loading } = useLibrary();
  const { user, logout } = useAuth();

  const navigateToDetail = useCallback(
    (workId: string) => navigation.navigate('BookDetails', { workId }),
    [navigation],
  );

  // Group books by reading status
  const sections = STATUS_ORDER
    .map((status) => ({
      title: READING_STATUS_LABELS[status],
      status,
      data: library.filter((b) => b.readingStatus === status),
    }))
    .filter((s) => s.data.length > 0);

  const renderBook = useCallback(
    ({ item }: { item: LibraryBook }) => {
      const coverUrl = getCoverUrl(item.coverId, 'S');
      return (
        <Pressable
          onPress={() => navigateToDetail(item.workId)}
          style={({ pressed }) => [styles.bookRow, pressed && styles.bookRowPressed]}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. Status: ${READING_STATUS_LABELS[item.readingStatus]}. ${item.rating ? `Rated ${item.rating} stars.` : 'Not rated.'} Tap to open.`}
        >
          {/* Cover */}
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={styles.cover}
              resizeMode="cover"
              accessibilityLabel={`Cover of ${item.title}`}
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.placeholderChar}>
                {item.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.bookMeta}>
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>

            {/* Star rating inline */}
            <View style={styles.starsInline} accessibilityLabel={item.rating ? `${item.rating} stars` : 'Not rated'}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={13}
                  color={item.rating !== null && s <= item.rating ? Colors.star : Colors.starEmpty}
                  fill={item.rating !== null && s <= item.rating ? Colors.star : 'transparent'}
                />
              ))}
            </View>
          </View>

          <ChevronRight size={20} color={Colors.borderStrong} />
        </Pressable>
      );
    },
    [navigateToDetail],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string; status: ReadingStatus } }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Account header */}
      <View style={[styles.pageHeader, { paddingTop: Math.max(insets.top + Spacing.md, Spacing.xxl) }]}>
        <View>
          <Text style={styles.heading}>My Library</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <Button
          label="Sign Out"
          onPress={logout}
          variant="ghost"
          style={styles.logoutBtn}
        />
      </View>

      {library.length === 0 ? (
        <View style={styles.empty}>
          <BookOpen size={56} color={Colors.terracottaLight} strokeWidth={1.5} style={{ marginBottom: Spacing.md }} />
          <Text style={styles.emptyTitle}>Your library is empty</Text>
          <Text style={styles.emptyBody}>
            Discover books and add them to your reading list from the book detail page.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.workId}
          renderItem={renderBook}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          accessibilityLabel="My book library"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.ink,
    fontFamily: 'serif',
  },
  userEmail: {
    ...Typography.small,
    color: Colors.inkMuted,
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.olive,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    ...Shadows.card,
  },
  bookRowPressed: {
    opacity: 0.85,
  },
  cover: {
    width: 48,
    height: 70,
    borderRadius: Radii.sm,
  },
  coverPlaceholder: {
    width: 48,
    height: 70,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderChar: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.terracotta,
    opacity: 0.7,
  },
  bookMeta: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  bookTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  starsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyBody: {
    ...Typography.body,
    color: Colors.inkMuted,
    textAlign: 'center',
  },
});
