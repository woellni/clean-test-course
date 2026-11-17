import { render, screen, waitFor } from '@testing-library/react';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import Home from '.';

describe('Test Home', () => {
  // Exercise: Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Test Render', async () => {
    //Arrange: Setup the mock API
    //Listen for any GET requests using the axios module
    const mockGet = jest.spyOn(axios, 'get');
    //Intercept the GET requests and provide a mocked response
    mockGet.mockImplementation((url) => {
      switch (url) {
        case `${API_URL}/api/category/?format=json`:
          return Promise.resolve({
            data: {
              status: 'success',
              data: [
                {
                  id: 1,
                  name: 'Handhelds',
                  description: "So big, you don't need thumbs.",
                },
                {
                  id: 2,
                  name: 'Appeteasers',
                  description: 'Tease the hangry hippo, he get hangrier',
                },
              ],
            },
          });
        default:
          return Promise.resolve({
            data: {
              status: 'fail',
            },
          });
      }
    });

    //Act: Call the Home page
    render(<Home />);

    //Assert: Check the values in the rendered Home page.
    //There should be 2 categories as defined in the mock response above
    expect(await screen.findAllByTestId(/category-item/i)).toHaveLength(2);
    //The word Appeateasers should be in there as defined in the mock response above.
    expect(await screen.findByText('Appeteasers')).toBeInTheDocument();
  });

  // Exercise: Add integration test (Real Backend API)
    test('Test Render - Integration Test', async () => {
    //Arrange: 
    //No mock! The actual API will be called.
    //Act: Render the Home page
    render(<Home />);

    // Assert: Verify the categories from the real API
    expect(await screen.findAllByTestId(/category-item/i)).toHaveLength(2);
    expect(await screen.findByText('Appeteasers')).toBeInTheDocument();
  });
});
