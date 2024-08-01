import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';

const BorrowedBooksContext = createContext();

export function useBorrowedBooks() {
  return useContext(BorrowedBooksContext);
}

export function BorrowedBooksProvider({ children }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const fetchBorrowedBooks = async () => {
    try {
      const borrowedCollection = collection(db, 'BorrowedBooks');
      const borrowedSnapshot = await getDocs(borrowedCollection);
      const borrowedList = borrowedSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      setBorrowedBooks(borrowedList);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const borrowBook = async (book) => {
    if (borrowedBooks.length >= 3) {
      return 'Limit Reached';
    }
    try {
      const borrowedCollection = collection(db, 'BorrowedBooks');
      const borrowedSnapshot = await getDocs(borrowedCollection);
      const alreadyBorrowed = borrowedSnapshot.docs.some(doc => doc.data().bookId === book.id);

      if (alreadyBorrowed) {
        return 'Already Borrowed';
      }

      const docRef = await addDoc(borrowedCollection, { bookId: book.id, ...book });
      console.log('Borrowed book:', { firestoreId: docRef.id, bookId: book.id, ...book }); // Log borrowed book
      fetchBorrowedBooks();
      return 'Success';
    } catch (error) {
      console.error("Error borrowing book:", error);
      return 'Error';
    }
  };

  const returnBook = async (firestoreId) => {
    try {
      const bookDocRef = doc(db, 'BorrowedBooks', firestoreId);
      const bookDocSnap = await getDoc(bookDocRef);

      if (bookDocSnap.exists()) {
        await deleteDoc(bookDocRef);
        fetchBorrowedBooks();
      } else {
        console.error(`Document with Firestore ID ${firestoreId} does not exist.`);
      }
    } catch (error) {
      console.error("Error returning book:", error.message);
    }
  };

  return (
    <BorrowedBooksContext.Provider value={{ borrowedBooks, borrowBook, returnBook }}>
      {children}
    </BorrowedBooksContext.Provider>
  );
}

function BorrowedScreen() {
  const { borrowedBooks, returnBook } = useBorrowedBooks();

  const handleReturn = (firestoreId) => {
    Alert.alert(
      'Return Book',
      'Are you sure you want to return this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => returnBook(firestoreId) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooksText}>No book borrowed yet, let's begin. You can borrow up to 3 books at a time.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.firestoreId}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookName}>{item.name}</Text>
              <Button title="Return" onPress={() => handleReturn(item.firestoreId)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  noBooksText: {
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookName: {
    fontSize: 18,
    color: '#4CAF50',
  },
});

export default BorrowedScreen;
