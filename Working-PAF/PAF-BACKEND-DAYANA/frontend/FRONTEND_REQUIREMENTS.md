# Frontend Implementation Requirements

## 1. API Integration Setup

### Base Configuration
```javascript
// src/config/api.config.js
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};
```

### Authentication Service
```javascript
// src/services/auth.service.js
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, credentials);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};
```

## 2. Required Components Structure

### Profile Management Components

1. **Profile View Component**
```javascript
// src/components/Profile/ProfileView.js
Required Props:
- user: {
    id: string,
    fullName: string,
    email: string,
    imageUrl: string,
    biography: string,
    location: string,
    timezone: string,
    astronomyLevel: string,
    astronomyInterests: string[],
    observationEquipment: string[],
    websiteUrl: string,
    instagramProfile: string,
    twitterProfile: string,
    knownLanguages: string[],
    profileCompleteness: number
}
```

2. **Profile Edit Component**
```javascript
// src/components/Profile/ProfileEdit.js
Required Props:
- user: (same as ProfileView)
- onSave: (updatedUser) => void
- onCancel: () => void
```

3. **Profile Photo Component**
```javascript
// src/components/Profile/ProfilePhoto.js
Required Props:
- currentPhotoUrl: string
- onPhotoUpdate: (file) => void
- maxFileSize: number (10MB)
```

## 3. API Integration Services

### User Service
```javascript
// src/services/user.service.js
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const userService = {
    // Get current user profile
    getCurrentUser: async () => {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Update profile
    updateProfile: async (userId, userData) => {
        const response = await axios.put(
            `${API_CONFIG.BASE_URL}/users/${userId}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },

    // Update profile photo
    updateProfilePhoto: async (userId, photoFile) => {
        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await axios.put(
            `${API_CONFIG.BASE_URL}/users/${userId}/photo`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Delete profile
    deleteProfile: async (userId) => {
        await axios.delete(`${API_CONFIG.BASE_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
};
```

## 4. Required Form Fields and Validation

### Profile Update Form Fields
```javascript
const profileFields = {
    fullName: {
        type: 'text',
        required: true,
        maxLength: 100
    },
    biography: {
        type: 'textarea',
        required: false,
        maxLength: 500
    },
    location: {
        type: 'text',
        required: false,
        maxLength: 100
    },
    timezone: {
        type: 'select',
        required: false,
        options: ['UTC', 'EST', 'PST', 'GMT', 'IST'] // Add more as needed
    },
    astronomyLevel: {
        type: 'select',
        required: false,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Professional']
    },
    astronomyInterests: {
        type: 'multiselect',
        required: false,
        options: ['Astrophotography', 'Telescope Making', 'Star Gazing', 'Planetary Science']
    },
    observationEquipment: {
        type: 'multiselect',
        required: false,
        options: ['Telescope', 'Binoculars', 'Camera', 'Mount']
    },
    websiteUrl: {
        type: 'url',
        required: false
    },
    instagramProfile: {
        type: 'text',
        required: false,
        pattern: '^@?[a-zA-Z0-9_]+$'
    },
    twitterProfile: {
        type: 'text',
        required: false,
        pattern: '^@?[a-zA-Z0-9_]+$'
    },
    knownLanguages: {
        type: 'multiselect',
        required: false,
        options: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
    }
};
```

## 5. Error Handling

### Error Types to Handle
```javascript
const errorTypes = {
    NETWORK_ERROR: 'Network error occurred',
    UNAUTHORIZED: 'Please login to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
    VALIDATION_ERROR: 'Please check your input',
    FILE_SIZE_ERROR: 'File size should be less than 10MB',
    FILE_TYPE_ERROR: 'Only image files are allowed'
};
```

## 6. Environment Variables
```plaintext
# .env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_MAX_FILE_SIZE=10485760 # 10MB in bytes
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

## 7. Testing Requirements

### Unit Tests Required
1. Profile data fetching
2. Profile update functionality
3. Photo upload functionality
4. Form validation
5. Error handling
6. Authentication flow

### Integration Tests Required
1. Complete profile update flow
2. Photo upload and update flow
3. Profile deletion flow
4. Authentication and authorization flow

## 8. Security Considerations

1. Implement token refresh mechanism
2. Secure storage of authentication tokens
3. Input sanitization
4. File type validation
5. File size validation
6. XSS protection
7. CSRF protection

## 9. Performance Considerations

1. Image optimization before upload
2. Lazy loading of profile components
3. Caching of user data
4. Debouncing of form inputs
5. Proper error boundary implementation

## 10. Accessibility Requirements

1. ARIA labels for all form elements
2. Keyboard navigation support
3. Screen reader compatibility
4. Color contrast compliance
5. Focus management 