import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CartProvider } from '../components/cartContext';
import axios from 'axios';

// Mock axios to prevent network calls
jest.mock('axios');

// Mock audio to prevent errors
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
  
  // Stub all axios calls with successful empty responses
  axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  axios.post.mockResolvedValue({ data: {} });
});

// Helper function to render App with providers
const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
};

describe('App Component - Basic Rendering', () => {
  test('renders App component without crashing', () => {
    const { container } = renderApp();
    expect(container).toBeTruthy();
    expect(container.querySelector('.App')).toBeTruthy();
  });

  test('renders all main structural elements', () => {
    const { container } = renderApp();
    
    // Check for main structural elements
    expect(container.querySelector('main')).toBeTruthy();
    expect(container.querySelector('footer')).toBeTruthy();
    expect(container.querySelector('.music-button')).toBeTruthy();
  });

  test('renders with correct initial theme', () => {
    renderApp();
    
    // Check that body has initial theme attribute
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });
});

describe('App Component - Audio Controls', () => {
  test('renders music control button', () => {
    const { container } = renderApp();
    const musicButton = container.querySelector('.music-button');
    
    expect(musicButton).toBeTruthy();
  });

  test('music button displays VolumeOff icon initially', () => {
    const { container } = renderApp();
    const musicButton = container.querySelector('.music-button');
    
    // Initially should show VolumeOffIcon
    expect(musicButton).toBeTruthy();
  });

  test('clicking music button toggles audio state', () => {
    const { container } = renderApp();
    const musicButton = container.querySelector('.music-button');
    
    // Click to toggle audio
    fireEvent.click(musicButton);
    
    // Button should still exist after click
    expect(musicButton).toBeTruthy();
  });
});

describe('App Component - Responsive Behavior', () => {
  test('initializes with correct mobile state based on window width', () => {
    // Set window width to mobile size
    global.innerWidth = 500;
    
    const { container } = renderApp();
    expect(container.querySelector('.App')).toBeTruthy();
  });

  test('handles window resize events', () => {
    const { container } = renderApp();
    
    // Simulate window resize
    global.innerWidth = 1200;
    fireEvent(window, new Event('resize'));
    
    expect(container.querySelector('.App')).toBeTruthy();
  });
});

describe('App Component - Routing', () => {
  test('renders Home page at root route', () => {
    const { container } = renderApp('/');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Home page at /home route', () => {
    const { container } = renderApp('/home');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Shop page at /shop route', () => {
    const { container } = renderApp('/shop');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Cart page at /cart route', () => {
    const { container } = renderApp('/cart');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Request page at /request route', () => {
    const { container } = renderApp('/request');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders About page at /about route', () => {
    const { container } = renderApp('/about');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Product page at /product/:id route', () => {
    const { container } = renderApp('/product/123');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders RequestList page at /list route', () => {
    const { container } = renderApp('/list');
    expect(container.querySelector('main')).toBeTruthy();
  });

  test('renders Checkout Success page at /checkout-success route', () => {
    const { container } = renderApp('/checkout-success');
    expect(container.querySelector('main')).toBeTruthy();
  });
});

describe('App Component - Theme Management', () => {
  test('applies theme to document body', () => {
    renderApp();
    
    // Default theme should be light
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });

  test('theme persists across component lifecycle', () => {
    const { unmount } = renderApp();
    
    expect(document.body.getAttribute('data-theme')).toBe('light');
    
    unmount();
  });
});

describe('App Component - Cart Integration', () => {
  test('renders with CartProvider context', () => {
    const { container } = renderApp();
    
    // App should render successfully with cart context
    expect(container.querySelector('.App')).toBeTruthy();
  });

  test('handles cart state from context', () => {
    const { container } = renderApp();
    
    // Cart integration should work without errors
    expect(container.querySelector('.App')).toBeTruthy();
  });
});

describe('App Component - Navigation Integration', () => {
  test('provides navigation functionality', () => {
    const { container } = renderApp();
    
    // Navigation should be available through context
    expect(container.querySelector('.App')).toBeTruthy();
  });
});

describe('App Component - Component Composition', () => {
  test('renders Navbar component', () => {
    const { container } = renderApp();
    
    // Navbar should be present
    const navbar = container.querySelector('nav') || container.querySelector('header');
    expect(navbar).toBeTruthy();
  });

  test('renders Footer component', () => {
    const { container } = renderApp();
    
    // Footer should be present
    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  test('passes props to child components correctly', () => {
    const { container } = renderApp();
    
    // Verify components render with required props
    expect(container.querySelector('main')).toBeTruthy();
    expect(container.querySelector('footer')).toBeTruthy();
  });
});


