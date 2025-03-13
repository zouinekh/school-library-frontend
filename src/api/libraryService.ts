import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Book, Checkout, PaginatedResponse } from '../types/library';

const API = axios.create({
    baseURL: 'http://localhost:3001',
});

export default {
    // Books
    async getBooks(page = 1, size = 10): Promise<AxiosResponse<PaginatedResponse<Book>>> {
        return API.get('/books', { params: { page, size } });
    },
    async getBook(id: string): Promise<AxiosResponse<Book>> {
        return API.get(`/books/${id}`);
    },
    async createBook(book: Partial<Book>): Promise<AxiosResponse<Book>> {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 900) + 100; // 3-digit random number
        const bookId = `B-${timestamp}${randomSuffix}`;
        const bookWithId = {
            ...book,
            id: bookId
        };

        return API.put('/books', bookWithId);
    },

    async updateBook(id: string, book: Partial<Book>): Promise<AxiosResponse<Book>> {
        return API.patch(`/books/${id}`, book);
    },

    async deleteBook(id: string): Promise<AxiosResponse<void>> {
        return API.delete(`/books/${id}`);
    },

    // Checkouts
    async getCheckouts(page = 1, size = 10): Promise<AxiosResponse<PaginatedResponse<Checkout>>> {
        return API.get('/checkouts', { params: { page, size } });
    },

    async getBookCheckoutHistory(bookId: string): Promise<AxiosResponse<PaginatedResponse<Checkout>>> {
        return API.get(`/checkouts/book/${bookId}`);
    },

    async createCheckout(checkout: Omit<Checkout, 'id' | 'checkoutDate'>): Promise<AxiosResponse<Checkout>> {
        return API.put('/checkouts', checkout);
    },

    async returnBook(id: string): Promise<AxiosResponse<Checkout>> {
        return API.patch(`/checkouts/${id}`);
    }
};