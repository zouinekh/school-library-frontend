export interface Book {
    id: string;
    title: string;
    author: string;
    availableCopies: number;
}

export interface Checkout {
    id: string;
    studentName: string;
    bookId: string;
    checkoutDate: Date;
    returnDate?: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
}