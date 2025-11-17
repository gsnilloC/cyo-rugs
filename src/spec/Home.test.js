import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/home';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock the useHome hook
const mockHomeData = {
  scrollContainerRef: { current: null },
};

jest.mock('../hooks/useHome', () => ({
  __esModule: true,
  default: () => mockHomeData,
}));

// Helper to render with router
const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Component - Initial Render', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders welcome message', () => {
    renderHome();
    expect(screen.getByText('Welcome to CYO Rugs')).toBeTruthy();
  });

  test('displays intro paragraph', () => {
    renderHome();
    expect(screen.getByText(/Create your own world by transforming your space/)).toBeTruthy();
  });

  test('renders video element', () => {
    const { container } = renderHome();
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.muted).toBe(true);
  });

  test('video has correct attributes', () => {
    const { container } = renderHome();
    const video = container.querySelector('video');
    expect(video.hasAttribute('playsInline')).toBe(true);
  });

  test('video has fallback message', () => {
    renderHome();
    expect(screen.getByText(/Your browser does not support the video tag/)).toBeTruthy();
  });
});

describe('Home Component - Navigation Links', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders Shop Now button', () => {
    renderHome();
    expect(screen.getByText('Shop Now')).toBeTruthy();
  });

  test('Shop Now links to /shop', () => {
    const { container } = renderHome();
    const link = container.querySelector('a[href="/shop"]');
    expect(link).toBeTruthy();
    expect(link.textContent).toBe('Shop Now');
  });

  test('renders Create a 1 of 1 section', () => {
    renderHome();
    expect(screen.getByText('Create a 1 of 1')).toBeTruthy();
  });

  test('Create a 1 of 1 description is present', () => {
    renderHome();
    expect(screen.getByText(/Transform your ideas into reality with custom orders/)).toBeTruthy();
  });

  test('links to request page', () => {
    const { container } = renderHome();
    const link = container.querySelector('a[href="/request"]');
    expect(link).toBeTruthy();
  });
});

describe('Home Component - Featured Collection', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        imageUrls: [
          'https://example.com/featured1.jpg',
          'https://example.com/featured2.jpg',
          'https://example.com/featured3.jpg',
        ],
      },
    });
  });

  test('renders Featured Collection title', () => {
    renderHome();
    expect(screen.getByText('Featured Collection')).toBeTruthy();
  });

  test('fetches homepage images from API', async () => {
    renderHome();
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/homepage-images');
    });
  });

  test('displays fetched images', async () => {
    const { container } = renderHome();
    
    await waitFor(() => {
      const images = container.querySelectorAll('.featuredRugImage');
      expect(images.length).toBe(3);
    });
  });

  test('images have correct src attributes', async () => {
    const { container } = renderHome();
    
    await waitFor(() => {
      const images = container.querySelectorAll('.featuredRugImage');
      expect(images[0].src).toBe('https://example.com/featured1.jpg');
    });
    
    const images = container.querySelectorAll('.featuredRugImage');
    expect(images[1].src).toBe('https://example.com/featured2.jpg');
    expect(images[2].src).toBe('https://example.com/featured3.jpg');
  });

  test('handles empty API response', async () => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
    
    const { container } = renderHome();
    
    await waitFor(() => {
      const images = container.querySelectorAll('.featuredRugImage');
      expect(images.length).toBe(0);
    });
  });

  test('handles API error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Network error'));
    
    renderHome();
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });
});

describe('Home Component - Happy Customers Section', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders Happy Customers title', () => {
    renderHome();
    expect(screen.getByText('Happy Customers')).toBeTruthy();
  });

  test('displays customer photos', () => {
    const { container } = renderHome();
    const customerSection = container.querySelector('.customerPhotos');
    expect(customerSection).toBeTruthy();
  });

  test('renders all 6 customer images', () => {
    const { container } = renderHome();
    const images = container.querySelectorAll('.customerPhotos img');
    expect(images.length).toBe(6);
  });

  test('customer images have alt text', () => {
    const { container } = renderHome();
    const images = container.querySelectorAll('.customerPhotos img');
    
    images.forEach((img, index) => {
      expect(img.alt).toContain('Happy Customer');
    });
  });
});

describe('Home Component - Sections Structure', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders intro section', () => {
    const { container } = renderHome();
    const introSection = container.querySelector('.introSection');
    expect(introSection).toBeTruthy();
  });

  test('renders featured collection section', () => {
    const { container } = renderHome();
    const featuredSection = container.querySelector('.featuredCollection');
    expect(featuredSection).toBeTruthy();
  });

  test('renders custom section', () => {
    const { container } = renderHome();
    const customSection = container.querySelector('.customSection');
    expect(customSection).toBeTruthy();
  });

  test('renders happy customers section', () => {
    const { container } = renderHome();
    const happyCustomersSection = container.querySelector('.happyCustomers');
    expect(happyCustomersSection).toBeTruthy();
  });

  test('sections appear in correct order', () => {
    const { container } = renderHome();
    const sections = container.querySelectorAll('.homeContainer > div');
    
    expect(sections[0].classList.contains('introSection')).toBe(true);
    expect(sections[1].classList.contains('featuredCollection')).toBe(true);
    expect(sections[2].classList.contains('customSection')).toBe(true);
    expect(sections[3].classList.contains('happyCustomers')).toBe(true);
  });
});

describe('Home Component - Scroll Indicators', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders scroll indicators', () => {
    const { container } = renderHome();
    const indicators = container.querySelectorAll('.scrollIndicator');
    expect(indicators.length).toBe(2); // One for featured, one for customers
  });

  test('scroll container has ref attached', () => {
    const { container } = renderHome();
    const scrollContainer = container.querySelector('.rugScrollContainer');
    expect(scrollContainer).toBeTruthy();
  });
});

describe('Home Component - API Integration', () => {
  test('calls API only once on mount', async () => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
    
    renderHome();
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  test('handles successful API response', async () => {
    axios.get.mockResolvedValue({
      data: {
        imageUrls: ['img1.jpg', 'img2.jpg'],
      },
    });
    
    const { container } = renderHome();
    
    await waitFor(() => {
      const images = container.querySelectorAll('.featuredRugImage');
      expect(images.length).toBe(2);
    });
  });

  test('handles API response with many images', async () => {
    const manyImages = Array.from({ length: 10 }, (_, i) => `image${i}.jpg`);
    axios.get.mockResolvedValue({
      data: { imageUrls: manyImages },
    });
    
    const { container } = renderHome();
    
    await waitFor(() => {
      const images = container.querySelectorAll('.featuredRugImage');
      expect(images.length).toBe(10);
    });
  });

  test('continues rendering even if API fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    
    renderHome();
    
    // Should still render other sections
    expect(screen.getByText('Welcome to CYO Rugs')).toBeTruthy();
    expect(screen.getByText('Happy Customers')).toBeTruthy();
  });
});

describe('Home Component - Learn More Button', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('renders LearnMoreButton component', () => {
    const { container } = renderHome();
    const customSection = container.querySelector('.customSection');
    const link = customSection.querySelector('a[href="/request"]');
    expect(link).toBeTruthy();
  });
});

describe('Home Component - Responsive Elements', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('video container exists', () => {
    const { container } = renderHome();
    const videoContainer = container.querySelector('.videoContainer');
    expect(videoContainer).toBeTruthy();
  });

  test('text container exists', () => {
    const { container } = renderHome();
    const textContainer = container.querySelector('.textContainer');
    expect(textContainer).toBeTruthy();
  });

  test('rug scroll container exists', () => {
    const { container } = renderHome();
    const scrollContainer = container.querySelector('.rugScrollContainer');
    expect(scrollContainer).toBeTruthy();
  });

  test('customer scroll container exists', () => {
    const { container } = renderHome();
    const customerScrollContainer = container.querySelector('.customerScrollContainer');
    expect(customerScrollContainer).toBeTruthy();
  });
});

describe('Home Component - Content Accuracy', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { imageUrls: [] } });
  });

  test('displays complete welcome paragraph', () => {
    renderHome();
    const text = screen.getByText(/Create your own world by transforming your space/);
    expect(text.textContent).toContain('crafted from your imagination');
    expect(text.textContent).toContain('bring an extra touch of style');
  });

  test('custom section has descriptive text', () => {
    renderHome();
    expect(screen.getByText(/Transform your ideas into reality with custom orders/)).toBeTruthy();
  });

  test('all main headings are present', () => {
    renderHome();
    expect(screen.getByText('Welcome to CYO Rugs')).toBeTruthy();
    expect(screen.getByText('Featured Collection')).toBeTruthy();
    expect(screen.getByText('Create a 1 of 1')).toBeTruthy();
    expect(screen.getByText('Happy Customers')).toBeTruthy();
  });
});

