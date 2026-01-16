import { API_CONFIG } from "@/utils/config";

// Interfaz del usuario transformado para el frontend
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roleId: number;
  registrationDate: string;
  profileImageUrl: string | null;
}

// Respuesta del backend (snake_case)
interface UserResponseBackend {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  registration_date: string;
  profile_image_url: string | null;
}

interface GetUserResponse {
  user: UserResponseBackend;
}

interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  profileImage?: File | null;
}

interface UpdatePasswordDto {
  current_password: string;
  new_password: string;
}

interface UpdateUserResponse {
  message: string;
  user: UserResponseBackend;
}

// Transformar respuesta del backend al formato del frontend
const transformUser = (userResponse: UserResponseBackend): User => {
  return {
    id: userResponse.id,
    name: userResponse.name,
    lastName: userResponse.last_name,
    email: userResponse.email,
    roleId: userResponse.role_id,
    registrationDate: userResponse.registration_date,
    profileImageUrl: userResponse.profile_image_url,
  };
};

// Eliminar la función transformUserToBackend ya que ahora usamos FormData
// y los endpoints de imagen ya no son necesarios

// Obtener información del usuario por ID
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const url = `${API_CONFIG.baseURL}/users/${userId}`;
    console.log('Fetching user from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: GetUserResponse = await response.json();
    console.log('User data from backend:', data);
    
    const transformedData = transformUser(data.user);
    console.log('Transformed user:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Actualizar información del usuario (incluyendo imagen de perfil)
export const updateUser = async (
  userId: number, 
  userData: { name?: string; lastName?: string; email?: string },
  profileImage?: File | null
): Promise<User> => {
  try {
    const url = `${API_CONFIG.baseURL}/users/${userId}`;
    console.log('Updating user at:', url);
    
    // Crear FormData para enviar datos multipart/form-data
    const formData = new FormData();
    
    if (userData.name !== undefined) formData.append('name', userData.name);
    if (userData.lastName !== undefined) formData.append('lastName', userData.lastName);
    if (userData.email !== undefined) formData.append('email', userData.email);
    if (profileImage !== undefined) {
      if (profileImage === null) {
        formData.append('profileImage', '');
      } else {
        formData.append('profileImage', profileImage);
      }
    }

    console.log('User data to send (FormData):', Array.from(formData.entries()));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
      },
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: UpdateUserResponse = await response.json();
    console.log('Updated user from backend:', data);
    
    const transformedData = transformUser(data.user);
    console.log('Transformed updated user:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};