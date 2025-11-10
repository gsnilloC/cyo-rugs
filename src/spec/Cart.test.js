import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../components/cart';
import { CartProvider } from '../components/cartContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock useCart hook
const mockCartData = {
  cartItems: [],
  total: 0,
  handleIncrease: jest.fn(),
  handleDecrease: jest.fn(),
  handleCheckout: jest.fn(),
};

jest.mock('../hooks/useCart', () => ({
  __esModule: true,
  default: () => mockCartData,
}));

// Helper to render with providers
const renderCart = () => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart Component - Empty State', () => {
  beforeEach(() => {
    mockCartData.cartItems = [];
    mockCartData.total = 0;
  });

  test('renders cart title', () => {
    renderCart();
    expect(screen.getByText('Your Shopping Cart')).toBeTruthy();
  });

  test('shows empty cart message when no items', () => {
    renderCart();
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
  });

  test('does not show checkout button when cart is empty', () => {
    const { container } = renderCart();
    const checkoutButton = container.querySelector('.checkoutButton');
    expect(checkoutButton).toBeFalsy();
  });
});

describe('Cart Component - With Items', () => {
  beforeEach(() => {
    mockCartData.cartItems = [
      {
        id: '1',
        name: 'Test Rug 1',
        price: 100.00,
        quantity: 2,
        selectedColor: 'Blue',
        imageUrls: ['https://example.com/image1.jpg'],
      },
      {
        id: '2',
        name: 'Test Rug 2',
        price: 150.00,
        quantity: 1,
        selectedColor: 'Red',
        imageUrls: ['https://example.com/image2.jpg'],
      },
    ];
    mockCartData.total = 350.00;
  });

  test('displays all cart items', () => {
    renderCart();
    expect(screen.getByText('Test Rug 1')).toBeTruthy();
    expect(screen.getByText('Test Rug 2')).toBeTruthy();
  });

  test('shows item images', () => {
    const { container } = renderCart();
    const images = container.querySelectorAll('.cartItemImage');
    expect(images.length).toBe(2);
    expect(images[0].src).toBe('https://example.com/image1.jpg');
  });

  test('displays item colors', () => {
    renderCart();
    expect(screen.getByText('Blue')).toBeTruthy();
    expect(screen.getByText('Red')).toBeTruthy();
  });

  test('shows correct quantities', () => {
    const { container } = renderCart();
    const quantities = container.querySelectorAll('.quantityText');
    expect(quantities[0].textContent).toBe('2');
    expect(quantities[1].textContent).toBe('1');
  });

  test('displays item prices', () => {
    renderCart();
    expect(screen.getByText('$100.00')).toBeTruthy();
    expect(screen.getByText('$150.00')).toBeTruthy();
  });

  test('shows subtotal', () => {
    renderCart();
    expect(screen.getByText(/Subtotal:/)).toBeTruthy();
    // Price is split across elements, so use regex or container query
    expect(screen.getByText(/350\.00/)).toBeTruthy();
  });

  test('quantity increase button calls handleIncrease', () => {
    const { container } = renderCart();
    const increaseButtons = container.querySelectorAll('.quantityButton');
    const firstIncreaseButton = Array.from(increaseButtons).find(btn => btn.textContent === '+');
    
    fireEvent.click(firstIncreaseButton);
    expect(mockCartData.handleIncrease).toHaveBeenCalled();
  });

  test('quantity decrease button calls handleDecrease', () => {
    const { container } = renderCart();
    const decreaseButtons = container.querySelectorAll('.quantityButton');
    const firstDecreaseButton = Array.from(decreaseButtons).find(btn => btn.textContent === '-');
    
    fireEvent.click(firstDecreaseButton);
    expect(mockCartData.handleDecrease).toHaveBeenCalled();
  });

  test('renders checkout button', () => {
    const { container } = renderCart();
    const checkoutButton = container.querySelector('.checkoutButton');
    expect(checkoutButton).toBeTruthy();
    expect(checkoutButton.textContent).toBe('Checkout');
  });

  test('checkout button calls handleCheckout', () => {
    const { container } = renderCart();
    const checkoutButton = container.querySelector('.checkoutButton');
    
    fireEvent.click(checkoutButton);
    expect(mockCartData.handleCheckout).toHaveBeenCalled();
  });
});

describe('Cart Component - Discount Codes', () => {
  beforeEach(() => {
    mockCartData.cartItems = [
      {
        id: '1',
        name: 'Test Rug',
        price: 100.00,
        quantity: 1,
        selectedColor: 'Blue',
        imageUrls: ['https://example.com/image1.jpg'],
      },
    ];
    mockCartData.total = 100.00;
  });

  test('renders discount input field', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    expect(discountInput).toBeTruthy();
  });

  test('renders apply discount button', () => {
    renderCart();
    expect(screen.getByText('Apply Discount')).toBeTruthy();
  });

  test('accepts discount code input', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    expect(discountInput.value).toBe('CYO1OF1');
  });

  test('applies valid discount code CYO1OF1', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    fireEvent.click(applyButton);
    
    // Should show discounted price (10% off)
    expect(screen.getByText('$90.00')).toBeTruthy();
  });

  test('applies valid discount code WTRUGGY', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'WTRUGGY' } });
    fireEvent.click(applyButton);
    
    expect(screen.getByText('$90.00')).toBeTruthy();
  });

  test('applies valid discount code RUGTUFF', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'RUGTUFF' } });
    fireEvent.click(applyButton);
    
    expect(screen.getByText('$90.00')).toBeTruthy();
  });

  test('applies valid discount code 1OFMINE', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: '1OFMINE' } });
    fireEvent.click(applyButton);
    
    expect(screen.getByText('$90.00')).toBeTruthy();
  });

  test('shows error for invalid discount code', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'INVALID' } });
    fireEvent.click(applyButton);
    
    expect(screen.getByText('Invalid discount code.')).toBeTruthy();
  });

  test('shows error when trying to apply discount twice', () => {
    renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    // Apply first time
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    fireEvent.click(applyButton);
    
    // Try to apply again
    fireEvent.click(applyButton);
    
    expect(screen.getByText('Discount code already applied.')).toBeTruthy();
  });

  test('shows old price crossed out when discount applied', () => {
    const { container } = renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    fireEvent.click(applyButton);
    
    const oldPrice = container.querySelector('.oldPrice');
    expect(oldPrice).toBeTruthy();
    expect(oldPrice.textContent).toBe('$100.00');
  });

  test('shows remove discount button after applying', () => {
    const { container } = renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    fireEvent.click(applyButton);
    
    // Use the same container, don't re-render
    const removeButton = container.querySelector('.removeDiscountButton');
    expect(removeButton).toBeTruthy();
  });

  test('removes discount when remove button clicked', () => {
    const { container } = renderCart();
    const discountInput = screen.getByPlaceholderText('Enter discount code');
    const applyButton = screen.getByText('Apply Discount');
    
    // Apply discount
    fireEvent.change(discountInput, { target: { value: 'CYO1OF1' } });
    fireEvent.click(applyButton);
    
    // Remove discount
    const removeButton = container.querySelector('.removeDiscountButton');
    fireEvent.click(removeButton);
    
    // Should show original price
    expect(screen.getByText('$100.00')).toBeTruthy();
    expect(discountInput.value).toBe('');
  });
});

describe('Cart Component - Loading State', () => {
  test('shows loading spinner during checkout', async () => {
    mockCartData.cartItems = [
      {
        id: '1',
        name: 'Test Rug',
        price: 100.00,
        quantity: 1,
        selectedColor: 'Blue',
        imageUrls: ['https://example.com/image1.jpg'],
      },
    ];
    mockCartData.total = 100.00;

    mockCartData.handleCheckout = jest.fn((items, setLoading) => {
      setLoading(true);
    });

    const { container } = renderCart();
    const checkoutButton = container.querySelector('.checkoutButton');
    
    fireEvent.click(checkoutButton);
    
    // Loading spinner should appear
    await waitFor(() => {
      const spinner = container.querySelector('.MuiCircularProgress-root');
      expect(spinner).toBeTruthy();
    });
  });
});

describe('Cart Component - Item Links', () => {
  beforeEach(() => {
    mockCartData.cartItems = [
      {
        id: '123',
        name: 'Test Rug',
        price: 100.00,
        quantity: 1,
        selectedColor: 'Blue',
        imageUrls: ['https://example.com/image1.jpg'],
      },
    ];
    mockCartData.total = 100.00;
  });

  test('item name links to product page', () => {
    const { container } = renderCart();
    const link = container.querySelector('a[href="/product/123"]');
    expect(link).toBeTruthy();
    expect(link.textContent).toBe('Test Rug');
  });
});

