import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Shop from '../components/shop';

// Mock axios
jest.mock('axios');

// Mock the useShop hook
const mockShopData = {
  paginatedRugs: [],
  loading: false,
  error: null,
  currentPage: 1,
  setCurrentPage: jest.fn(),
  totalPages: 1,
};

jest.mock('../hooks/useShop', () => ({
  __esModule: true,
  default: () => mockShopData,
}));

// Helper to render with router
const renderShop = () => {
  return render(
    <BrowserRouter>
      <Shop />
    </BrowserRouter>
  );
};

describe('Shop Component - Loading State', () => {
  beforeEach(() => {
    mockShopData.loading = true;
    mockShopData.paginatedRugs = [];
    mockShopData.error = null;
  });

  test('displays loading spinner when loading', () => {
    const { container } = renderShop();
    const spinner = container.querySelector('.MuiCircularProgress-root');
    expect(spinner).toBeTruthy();
  });

  test('does not show rugs while loading', () => {
    renderShop();
    const title = screen.queryByText('Hand Tufted Rugs');
    expect(title).toBeFalsy();
  });
});

describe('Shop Component - Error State', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.paginatedRugs = [];
    mockShopData.error = { message: 'Network error' };
  });

  test('displays error message when error occurs', () => {
    renderShop();
    expect(screen.getByText(/Error fetching items: Network error/)).toBeTruthy();
  });

  test('does not show rugs when error', () => {
    renderShop();
    const title = screen.queryByText('Hand Tufted Rugs');
    expect(title).toBeFalsy();
  });
});

describe('Shop Component - Empty State', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.paginatedRugs = [];
    mockShopData.error = null;
  });

  test('shows no rugs message when empty', () => {
    renderShop();
    expect(screen.getByText(/No rugs available in stock/)).toBeTruthy();
  });

  test('displays check back later message', () => {
    renderShop();
    expect(screen.getByText(/Please check back later!/)).toBeTruthy();
  });
});

describe('Shop Component - Product Display', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Beautiful Blue Rug',
        price: 299.99,
        imageUrls: ['https://example.com/rug1.jpg'],
        inventoryCount: 5,
      },
      {
        id: 'rug2',
        name: 'Elegant Red Rug',
        price: 399.50,
        imageUrls: ['https://example.com/rug2.jpg'],
        inventoryCount: 3,
      },
    ];
  });

  test('renders shop title', () => {
    renderShop();
    expect(screen.getByText('Hand Tufted Rugs')).toBeTruthy();
  });

  test('displays all products', () => {
    renderShop();
    expect(screen.getByText('Beautiful Blue Rug')).toBeTruthy();
    expect(screen.getByText('Elegant Red Rug')).toBeTruthy();
  });

  test('shows product images', () => {
    const { container } = renderShop();
    const images = container.querySelectorAll('.rugImage');
    expect(images.length).toBe(2);
    expect(images[0].src).toBe('https://example.com/rug1.jpg');
  });

  test('displays prices with currency', () => {
    renderShop();
    expect(screen.getByText('$299.99 USD')).toBeTruthy();
    expect(screen.getByText('$399.50 USD')).toBeTruthy();
  });

  test('formats prices with two decimal places', () => {
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Test Rug',
        price: 100,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
    
    renderShop();
    expect(screen.getByText('$100.00 USD')).toBeTruthy();
  });

  test('links to product pages', () => {
    const { container } = renderShop();
    const link = container.querySelector('a[href="/product/rug1"]');
    expect(link).toBeTruthy();
  });
});

describe('Shop Component - Sold Out Products', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Sold Out Rug',
        price: 299.99,
        imageUrls: ['https://example.com/soldout.jpg'],
        inventoryCount: 0,
      },
    ];
  });

  test('displays sold out badge', () => {
    renderShop();
    expect(screen.getByText('Sold Out')).toBeTruthy();
  });

  test('applies sold out styling', () => {
    const { container } = renderShop();
    const rugItem = container.querySelector('.soldOut');
    expect(rugItem).toBeTruthy();
  });

  test('still shows product details for sold out items', () => {
    renderShop();
    expect(screen.getByText('Sold Out Rug')).toBeTruthy();
    expect(screen.getByText('$299.99 USD')).toBeTruthy();
  });
});

describe('Shop Component - 1 of 1 Special Items', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: '1:1 Unique Rug',
        price: 499.99,
        imageUrls: ['https://example.com/unique.jpg'],
        inventoryCount: 1,
      },
    ];
  });

  test('shows 1 of 1 sticker for special items', () => {
    const { container } = renderShop();
    const sticker = container.querySelector('.sticker');
    expect(sticker).toBeTruthy();
    expect(sticker.alt).toBe('1 of 1 sticker');
  });

  test('does not show sticker for regular items', () => {
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Regular Rug',
        price: 299.99,
        imageUrls: ['img.jpg'],
        inventoryCount: 5,
      },
    ];
    
    const { container } = renderShop();
    const sticker = container.querySelector('.sticker');
    expect(sticker).toBeFalsy();
  });
});

describe('Shop Component - Pagination', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
    mockShopData.currentPage = 1;
    mockShopData.totalPages = 3;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Test Rug',
        price: 100,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
  });

  test('displays pagination controls', () => {
    const { container } = renderShop();
    const pagination = container.querySelector('.pagination');
    expect(pagination).toBeTruthy();
  });

  test('shows current page number', () => {
    const { container } = renderShop();
    const activePage = container.querySelector('.activePage');
    expect(activePage).toBeTruthy();
    expect(activePage.textContent).toBe('1');
  });

  test('shows all page numbers', () => {
    const { container } = renderShop();
    const pageNumbers = container.querySelectorAll('.pageNumber');
    expect(pageNumbers.length).toBe(3);
  });

  test('next button calls setCurrentPage', () => {
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    const nextButton = arrows[1]; // Second arrow is next
    
    fireEvent.click(nextButton);
    expect(mockShopData.setCurrentPage).toHaveBeenCalledWith(2);
  });

  test('previous button calls setCurrentPage', () => {
    mockShopData.currentPage = 2;
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    const prevButton = arrows[0]; // First arrow is previous
    
    fireEvent.click(prevButton);
    expect(mockShopData.setCurrentPage).toHaveBeenCalledWith(1);
  });

  test('clicking page number changes page', () => {
    const { container } = renderShop();
    const pageNumbers = container.querySelectorAll('.pageNumber');
    
    fireEvent.click(pageNumbers[2]); // Click page 3
    expect(mockShopData.setCurrentPage).toHaveBeenCalledWith(3);
  });

  test('previous button disabled on first page', () => {
    mockShopData.currentPage = 1;
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    const prevButton = arrows[0];
    
    expect(prevButton.classList.contains('disabled')).toBe(true);
  });

  test('next button disabled on last page', () => {
    mockShopData.currentPage = 3;
    mockShopData.totalPages = 3;
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    const nextButton = arrows[1];
    
    expect(nextButton.classList.contains('disabled')).toBe(true);
  });

  test('shows page indicator for current page', () => {
    const { container } = renderShop();
    const indicator = container.querySelector('.pageIndicator');
    expect(indicator).toBeTruthy();
  });
});

describe('Shop Component - Edge Cases', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
  });

  test('handles products without price gracefully', () => {
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Test Rug',
        price: null,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
    
    renderShop();
    // Should not render the rug without price
    expect(screen.queryByText('Test Rug')).toBeFalsy();
  });

  test('handles missing image URLs', () => {
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Test Rug',
        price: 100,
        imageUrls: [],
        inventoryCount: 1,
      },
    ];
    
    renderShop();
    // Should still render but without image
    expect(screen.getByText('Test Rug')).toBeTruthy();
  });

  test('handles zero price by not rendering item', () => {
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Free Rug',
        price: 0,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
    
    renderShop();
    // Items with price 0 are not rendered (filtered out by component logic)
    expect(screen.queryByText('Free Rug')).toBeFalsy();
  });

  test('handles single page pagination', () => {
    mockShopData.totalPages = 1;
    mockShopData.currentPage = 1;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Only Rug',
        price: 100,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
    
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    
    // Both arrows should be disabled
    expect(arrows[0].classList.contains('disabled')).toBe(true);
    expect(arrows[1].classList.contains('disabled')).toBe(true);
  });

  test('pagination controls are functional', () => {
    mockShopData.totalPages = 3;
    mockShopData.currentPage = 2;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Test Rug',
        price: 100,
        imageUrls: ['img.jpg'],
        inventoryCount: 1,
      },
    ];
    
    const { container } = renderShop();
    const arrows = container.querySelectorAll('.arrow');
    
    // Both arrows should be enabled on middle page
    expect(arrows[0].classList.contains('disabled')).toBe(false);
    expect(arrows[1].classList.contains('disabled')).toBe(false);
  });
});

describe('Shop Component - Multiple Products', () => {
  beforeEach(() => {
    mockShopData.loading = false;
    mockShopData.error = null;
    mockShopData.paginatedRugs = [
      {
        id: 'rug1',
        name: 'Rug 1',
        price: 100,
        imageUrls: ['img1.jpg'],
        inventoryCount: 5,
      },
      {
        id: 'rug2',
        name: '1:1 Special Rug',
        price: 200,
        imageUrls: ['img2.jpg'],
        inventoryCount: 1,
      },
      {
        id: 'rug3',
        name: 'Rug 3',
        price: 150,
        imageUrls: ['img3.jpg'],
        inventoryCount: 0,
      },
    ];
  });

  test('displays mix of regular, special, and sold out items', () => {
    renderShop();
    
    expect(screen.getByText('Rug 1')).toBeTruthy();
    expect(screen.getByText('1:1 Special Rug')).toBeTruthy();
    expect(screen.getByText('Rug 3')).toBeTruthy();
    expect(screen.getByText('Sold Out')).toBeTruthy();
  });

  test('creates correct product links for all items', () => {
    const { container } = renderShop();
    
    expect(container.querySelector('a[href="/product/rug1"]')).toBeTruthy();
    expect(container.querySelector('a[href="/product/rug2"]')).toBeTruthy();
    expect(container.querySelector('a[href="/product/rug3"]')).toBeTruthy();
  });
});

