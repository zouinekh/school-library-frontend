import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Book, Checkout, PaginatedResponse } from '../types/library';

const API = axios.create({
    baseURL: 'http://localhost:3001',
});

export default {
    // Books
    async getBooks(page = 1, size = 10, search = ''): Promise<AxiosResponse<PaginatedResponse<Book>>> {
        const params: Record<string, any> = { page, size };
        if (search) {
            params.search = search;
        }
        return API.get('/books', { params });
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
    },
    // Add this method to your existing libraryService object
    async getDashboardStats(): Promise<AxiosResponse<{
        totalBooks: number;
        availableBooks: number;
        totalCheckouts: number;
        activeCheckouts: number;
    }>> {
        return API.get('/dashboard');
    }
};