import { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Bell, Loader2 } from 'lucide-react';
import { getUserById, updateUser } from '@/services/user.service';
import type { User } from '@/services/user.service';

function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Datos del formulario de perfil
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    email: '',
  });

  // Cargar información del usuario (asumiendo que el ID está en localStorage o auth context)
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener el usuario completo del localStorage
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        setError('No se encontró el usuario en localStorage');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.userId

      const userFromApi = await getUserById(userId);
      setUser(userFromApi);
      setProfileData({
        name: userFromApi.name,
        lastName: userFromApi.lastName,
        email: userFromApi.email,
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updateData = {
        name: profileData.name,
        lastName: profileData.lastName,
        email: profileData.email,
      };

      const updatedUser = await updateUser(user.id, updateData, selectedImage);
      setUser(updatedUser);
      setSelectedImage(null);
      setSuccess('Perfil actualizado correctamente');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setSelectedImage(file);
    setError('');
    setSuccess('Imagen seleccionada. Haz clic en "Guardar cambios" para actualizar.');
  };

  const getRoleLabel = (roleId: number) => {
    const roles: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Usuario',
      3: 'Moderador',
    };
    return roles[roleId] || 'Usuario';
  };

  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-600 p-8">
        No se pudo cargar la información del usuario
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">Administra las preferencias de tu cuenta</p>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Perfil */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="w-full h-full object-cover" />
              ) : user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name, user.lastName)
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                {selectedImage ? 'Cambiar imagen' : 'Seleccionar foto'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={saving}
                />
              </label>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSuccess('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <input
                type="text"
                value={getRoleLabel(user.roleId)}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleProfileSubmit}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar cambios
          </button>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Notificaciones por Email</p>
                <p className="text-sm text-gray-500 mt-1">Recibe actualizaciones por correo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Nuevas Encuestas</p>
                <p className="text-sm text-gray-500 mt-1">Avisos cuando se crea una encuesta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Nuevas Respuestas</p>
                <p className="text-sm text-gray-500 mt-1">Notificaciones de respuestas nuevas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;