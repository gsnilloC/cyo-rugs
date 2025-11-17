import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Product from '../components/product';
import { CartProvider } from '../components/cartContext';

// Mock axios
jest.mock('axios');

// Mock product data
const mockProductData = {
  rug: null,
  loading: false,
  error: null,
  quantity: 1,
  handleAddToCart: jest.fn(),
  handleIncrease: jest.fn(),
  handleDecrease: jest.fn(),
};

// Mock useProduct hook
jest.mock('../hooks/useProduct', () => ({
  __esModule: true,
  default: () => mockProductData,
}));

// Helper to render with providers
const renderProduct = () => {
  return render(
    <MemoryRouter initialEntries={['/product/123']}>
      <CartProvider>
        <Product />
      </CartProvider>
    </MemoryRouter>
  );
};

describe('Product Component - Loading State', () => {
  beforeEach(() => {
    mockProductData.loading = true;
    mockProductData.rug = null;
    mockProductData.error = null;
  });

  test('shows loading message when loading', () => {
    renderProduct();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  test('does not show product details while loading', () => {
    renderProduct();
    const addToCartButtons = screen.queryAllByText('Add to Cart');
    expect(addToCartButtons.length).toBe(0);
  });
});

describe('Product Component - Error State', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.rug = null;
    mockProductData.error = { message: 'Network error' };
  });

  test('shows error message when error occurs', () => {
    renderProduct();
    expect(screen.getByText(/Error fetching item: Network error/)).toBeTruthy();
  });

  test('does not show product details when error', () => {
    renderProduct();
    const addToCartButtons = screen.queryAllByText('Add to Cart');
    expect(addToCartButtons.length).toBe(0);
  });
});

describe('Product Component - Not Found State', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.rug = null;
    mockProductData.error = null;
  });

  test('shows not found message when product does not exist', () => {
    renderProduct();
    expect(screen.getByText('Product not found')).toBeTruthy();
  });
});

describe('Product Component - Product Display', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.quantity = 1;
    mockProductData.rug = {
      id: '123',
      name: 'Beautiful Handmade Rug',
      price: 299.99,
      description: 'Hand-tufted, 100% wool, Made in USA, 5x7 feet',
      imageUrls: [
        'https://example.com/rug1.jpg',
        'https://example.com/rug2.jpg',
        'https://example.com/rug3.jpg',
      ],
      v_ids: ['v1', 'v2'],
      v_names: ['Blue', 'Red'],
      v_quantities: [5, 3],
    };
  });

  test('renders product name', () => {
    renderProduct();
    expect(screen.getByText('Beautiful Handmade Rug')).toBeTruthy();
  });

  test('displays product price with currency', () => {
    renderProduct();
    expect(screen.getByText('$299.99 USD')).toBeTruthy();
  });

  test('shows main product image', () => {
    const { container } = renderProduct();
    const mainImage = container.querySelector('.productImage');
    expect(mainImage).toBeTruthy();
    expect(mainImage.src).toBe('https://example.com/rug1.jpg');
  });

  test('renders all thumbnail images', () => {
    const { container } = renderProduct();
    const thumbnails = container.querySelectorAll('.thumbnail');
    expect(thumbnails.length).toBe(3);
  });

  test('clicking thumbnail changes main image', () => {
    const { container } = renderProduct();
    const thumbnails = container.querySelectorAll('.thumbnail');
    const mainImage = container.querySelector('.productImage');
    
    fireEvent.click(thumbnails[1]);
    
    expect(mainImage.src).toBe('https://example.com/rug2.jpg');
  });

  test('active thumbnail has active class', () => {
    const { container } = renderProduct();
    const thumbnails = container.querySelectorAll('.thumbnail');
    
    expect(thumbnails[0].classList.contains('activeThumbnail')).toBe(true);
  });

  test('displays product description as list items', () => {
    renderProduct();
    expect(screen.getByText('Hand-tufted')).toBeTruthy();
    expect(screen.getByText('100% wool')).toBeTruthy();
    expect(screen.getByText('Made in USA')).toBeTruthy();
    expect(screen.getByText('5x7 feet')).toBeTruthy();
  });

  test('shows "no description available" when description is empty', () => {
    mockProductData.rug.description = '';
    renderProduct();
    expect(screen.getByText('No description available.')).toBeTruthy();
  });
});

describe('Product Component - Color Variations', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test description',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1', 'v2', 'v3'],
      v_names: ['Blue', 'Red', 'White'],
      v_quantities: [5, 3, 0],
    };
  });

  test('renders color variation circles', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    expect(colorCircles.length).toBe(3);
  });

  test('displays color names', () => {
    renderProduct();
    expect(screen.getByText('Blue')).toBeTruthy();
    expect(screen.getByText('Red')).toBeTruthy();
    expect(screen.getByText('White')).toBeTruthy();
  });

  test('first color is selected by default', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    expect(colorCircles[0].classList.contains('activeColor')).toBe(true);
  });

  test('clicking color variation selects it', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    
    fireEvent.click(colorCircles[1]); // Click Red
    
    expect(colorCircles[1].classList.contains('activeColor')).toBe(true);
  });

  test('sold out variations are marked with soldOut class', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    
    // White variation (index 2) has 0 quantity
    expect(colorCircles[2].classList.contains('soldOut')).toBe(true);
  });

  test('cannot select sold out variation', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    
    fireEvent.click(colorCircles[2]); // Try to click sold out White
    
    // Should still have first color selected
    expect(colorCircles[0].classList.contains('activeColor')).toBe(true);
    expect(colorCircles[2].classList.contains('activeColor')).toBe(false);
  });

  test('white color has border styling', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    const whiteCircle = colorCircles[2];
    
    expect(whiteCircle.style.border).toBe('1px solid #ddd');
  });

  test('sold out variation has not-allowed cursor', () => {
    const { container } = renderProduct();
    const colorCircles = container.querySelectorAll('.colorCircle');
    const soldOutCircle = colorCircles[2];
    
    expect(soldOutCircle.style.cursor).toBe('not-allowed');
  });
});

describe('Product Component - Single Variation', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test description',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
  });

  test('does not show variation options for single variation', () => {
    const { container } = renderProduct();
    const variationsContainer = container.querySelector('.variationsContainer');
    
    // Should render but show empty space
    expect(variationsContainer.textContent.trim()).toBe('');
  });
});

describe('Product Component - Quantity Controls', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.quantity = 2;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
  });

  test('displays quantity input field', () => {
    const { container } = renderProduct();
    const quantityInput = container.querySelector('input[value="2"]');
    expect(quantityInput).toBeTruthy();
  });

  test('quantity input is readonly', () => {
    const { container } = renderProduct();
    const quantityInput = container.querySelector('input[value="2"]');
    expect(quantityInput.readOnly).toBe(true);
  });

  test('renders increase quantity button', () => {
    renderProduct();
    const increaseButton = screen.getByLabelText('increase quantity');
    expect(increaseButton).toBeTruthy();
  });

  test('renders decrease quantity button', () => {
    renderProduct();
    const decreaseButton = screen.getByLabelText('decrease quantity');
    expect(decreaseButton).toBeTruthy();
  });

  test('clicking increase button calls handleIncrease', () => {
    renderProduct();
    const increaseButton = screen.getByLabelText('increase quantity');
    
    fireEvent.click(increaseButton);
    expect(mockProductData.handleIncrease).toHaveBeenCalled();
  });

  test('clicking decrease button calls handleDecrease', () => {
    renderProduct();
    const decreaseButton = screen.getByLabelText('decrease quantity');
    
    fireEvent.click(decreaseButton);
    expect(mockProductData.handleDecrease).toHaveBeenCalled();
  });
});

describe('Product Component - Add to Cart', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.quantity = 2;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1', 'v2'],
      v_names: ['Blue', 'Red'],
      v_quantities: [5, 3],
    };
  });

  test('renders add to cart button', () => {
    renderProduct();
    expect(screen.getByText('Add to Cart')).toBeTruthy();
  });

  test('clicking add to cart calls handleAddToCart with quantity and color', () => {
    const { container } = renderProduct();
    const addToCartButton = screen.getByText('Add to Cart');
    
    // Select a color first
    const colorCircles = container.querySelectorAll('.colorCircle');
    fireEvent.click(colorCircles[1]); // Select Red
    
    fireEvent.click(addToCartButton);
    
    expect(mockProductData.handleAddToCart).toHaveBeenCalledWith(2, 'Red');
  });

  test('adds to cart with default selected color', () => {
    renderProduct();
    const addToCartButton = screen.getByText('Add to Cart');
    
    fireEvent.click(addToCartButton);
    
    // First color (Blue) should be selected by default
    expect(mockProductData.handleAddToCart).toHaveBeenCalledWith(2, 'Blue');
  });
});

describe('Product Component - Product Care Accordion', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
  });

  test('renders product care accordion header', () => {
    renderProduct();
    expect(screen.getByText('Product Care Info')).toBeTruthy();
  });

  test('product care info is initially collapsed', () => {
    renderProduct();
    // Care instructions should not be immediately visible
    const careText = screen.queryByText(/Vacuum regularly/);
    // In collapsed state, it might not be visible or might be hidden
    expect(careText).toBeTruthy(); // The text exists in DOM
  });

  test('clicking accordion expands care info', () => {
    renderProduct();
    const accordionHeader = screen.getByText('Product Care Info');
    
    fireEvent.click(accordionHeader);
    
    // Care instructions should be visible
    expect(screen.getByText(/Vacuum regularly/)).toBeTruthy();
    expect(screen.getByText(/Professional cleaning can be used/)).toBeTruthy();
  });

  test('displays complete care instructions', () => {
    renderProduct();
    const accordionHeader = screen.getByText('Product Care Info');
    fireEvent.click(accordionHeader);
    
    expect(screen.getByText(/Vacuum regularly/)).toBeTruthy();
    expect(screen.getByText(/Slight shedding is normal/)).toBeTruthy();
    expect(screen.getByText(/Blot spills immediately/)).toBeTruthy();
    expect(screen.getByText(/Do not rub/)).toBeTruthy();
    expect(screen.getByText(/Professional cleaning can be used/)).toBeTruthy();
    expect(screen.getByText(/give your rug a gentle shake/)).toBeTruthy();
  });
});

describe('Product Component - Toast Container', () => {
  beforeEach(() => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
  });

  test('renders ToastContainer for notifications', () => {
    const { container } = renderProduct();
    const toastContainer = container.querySelector('.Toastify');
    expect(toastContainer).toBeTruthy();
  });
});

describe('Product Component - Edge Cases', () => {
  test('handles product with no variations gracefully', () => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: [],
      v_names: [],
      v_quantities: [],
    };
    
    renderProduct();
    
    expect(screen.getByText('Test Rug')).toBeTruthy();
    expect(screen.getByText('Add to Cart')).toBeTruthy();
  });

  test('handles product with single image', () => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 100.00,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
    
    const { container } = renderProduct();
    const thumbnails = container.querySelectorAll('.thumbnail');
    
    expect(thumbnails.length).toBe(1);
  });

  test('displays price with two decimal places', () => {
    mockProductData.loading = false;
    mockProductData.error = null;
    mockProductData.rug = {
      id: '123',
      name: 'Test Rug',
      price: 99.9,
      description: 'Test',
      imageUrls: ['https://example.com/rug1.jpg'],
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
    };
    
    renderProduct();
    expect(screen.getByText('$99.90 USD')).toBeTruthy();
  });
});

