import React from 'react'
import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/templates/Header';
import HomePage from './components/pages/HomePage';
import BooksPage from './components/pages/BooksPage';
import MembersPage from './components/organisms/MemberList';
import AddMemberPage from './components/pages/AddMemberPage';
import AddBookPage from './components/pages/AddBookPage';
import EditBookPage from './components/pages/EditBookPage';
import EditMemberPage from './components/pages/EditMemberPage';
import BookDetailPage from './components/pages/BookDetailPage';
import MemberDetailPage from './components/pages/MemberDetailPage';
import InfiniteScrollList from './components/pages/InfiniteScroll';
import BookManagemets from './components/pages/BookManagements';
import BorrowPage from './components/pages/BorrowPage';
import BorrowForm from './components/molecules/BorrowForm';
import ReturnForm from './components/molecules/ReturnForm';
import ReturnPage from './components/pages/ReturnPage';
import Login from './components/pages/login';
import Profile from './components/pages/profile';
import Footer from './components/templates/Footer';
import Register from './components/pages/register';

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BookManagemets />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/books/add" element={<AddBookPage />} />
        <Route path="/books/search" element={<BooksPage />} />
        <Route path="/books/edit/:id" element={<EditBookPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/add" element={<AddMemberPage />} />
        <Route path="/members/:id" element={<MemberDetailPage />} />
        <Route path="/members/edit/:id" element={<EditMemberPage />} />
        <Route path="/infinite" element={<InfiniteScrollList />} />
        <Route path="/borrow" element={<BorrowPage />} />
        <Route path="/borrow/form" element={<BorrowForm />} />
        <Route path="/return" element={<ReturnPage />} />
        <Route path="/return/form" element={<ReturnForm />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/profile" element={<Profile />}/>
      </Routes>
      <Footer />
    </Router>
    </QueryClientProvider>
  )
}

export default App
