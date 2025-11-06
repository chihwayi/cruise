import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Calendar, Save, Users, Heart } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDateForInput, parseDateFromInput, formatDateInput } from '@/lib/utils';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  address: string;
  city: string;
  country: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/candidates/profile');
      const data = response.data.candidate;
      setProfile(data);
      
      console.log('Fetched profile data:', data);
      console.log('Date of birth raw:', data.dateOfBirth);
      
      // Format dateOfBirth for display (dd/MM/yyyy)
      const dateOfBirthFormatted = formatDateForInput(data.dateOfBirth);
      console.log('Date of birth formatted:', dateOfBirthFormatted);
      
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phoneNumber || data.phone || '',
        // Handle nullable fields - use empty string if null/undefined
        nationality: data.nationality ?? '',
        dateOfBirth: dateOfBirthFormatted,
        gender: data.gender ?? '',
        maritalStatus: data.maritalStatus ?? '',
        address: data.physicalAddress ?? data.address ?? '',
        city: data.city ?? '',
        country: data.country ?? '',
      });
      
      console.log('Form data set with dateOfBirth:', dateOfBirthFormatted);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Always include all fields, even if empty
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      
      // Include optional fields - use empty string if not provided
      if (formData.phone !== undefined) payload.phoneNumber = formData.phone;
      if (formData.address !== undefined) payload.physicalAddress = formData.address;
      if (formData.nationality !== undefined) payload.nationality = formData.nationality;
      // Convert dd/MM/yyyy to YYYY-MM-DD for API
      if (formData.dateOfBirth !== undefined) {
        const parsedDate = parseDateFromInput(formData.dateOfBirth);
        payload.dateOfBirth = parsedDate || null;
        console.log('Date conversion:', formData.dateOfBirth, '->', parsedDate);
      }
      if (formData.gender !== undefined) payload.gender = formData.gender || null;
      if (formData.maritalStatus !== undefined) payload.maritalStatus = formData.maritalStatus || null;
      if (formData.city !== undefined) payload.city = formData.city;
      if (formData.country !== undefined) payload.country = formData.country;
      
      console.log('Submitting profile update:', JSON.stringify(payload, null, 2));
      
      const response = await apiClient.put('/candidates/profile', payload);
      
      toast.success('Profile updated successfully');
      // Refresh profile data to get the latest from server
      await fetchProfile();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                icon={<User className="h-4 w-4" />}
              />
              <Input
                type="email"
                label="Email"
                value={formData.email}
                disabled
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                type="tel"
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={<Phone className="h-4 w-4" />}
              />
              <Input
                label="Nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                icon={<MapPin className="h-4 w-4" />}
              />
              <Input
                type="text"
                label="Date of Birth (dd/mm/yyyy)"
                placeholder="dd/mm/yyyy"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  setFormData({ ...formData, dateOfBirth: formatted });
                }}
                onBlur={(e) => {
                  // Validate and format on blur
                  const parsed = parseDateFromInput(e.target.value);
                  if (parsed) {
                    const formatted = formatDateForInput(parsed);
                    setFormData({ ...formData, dateOfBirth: formatted });
                  } else if (e.target.value.trim() !== '') {
                    // Invalid date - show error
                    toast.error('Please enter a valid date in dd/mm/yyyy format');
                  }
                }}
                icon={<Calendar className="h-4 w-4" />}
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                icon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                icon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
            <div className="mt-6">
              <Button type="submit" isLoading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

