import React, { useState, useEffect }  from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from './firebaseConfig';
import { StyleSheet, Text, View, FlatList, Button, Alert, Image, TouchableOpacity } from 'react-native';

function BookList({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'BookApp'); // Specify the collection
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { book: item })} style={styles.bookItem}>
            <Text style={styles.bookName}>{item.name}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bookAuthor: {
    fontSize: 18,
    color: '#000',
  },
});

export default BookList;
