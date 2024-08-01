import React from 'react';
import { useBorrowedBooks } from './Borrowed';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

function BookDetail({ route }) {
  const { book } = route.params;
  const { borrowBook } = useBorrowedBooks();

  const handleBorrow = async () => {
    const result = await borrowBook(book);
    if (result === 'Limit Reached') {
      alert('You can only borrow up to 3 books at a time.');
    } else if (result === 'Already Borrowed') {
      alert('This book is already borrowed.');
    } else if (result === 'Success') {
      alert('Book borrowed successfully.');
    } else {
      alert('An error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.cover }} style={styles.coverImage} />
      <Text style={styles.title}>{book.name}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.rating}>Rating: {book.rating}</Text>
      <Text style={styles.summary}>{book.summary}</Text>
      <Button title="Borrow this book" onPress={handleBorrow}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  coverImage: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default BookDetail;
