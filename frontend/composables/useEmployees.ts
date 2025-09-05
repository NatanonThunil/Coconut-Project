export const useEmployees = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiBase = config.public.apiBase || '';
  const apiKey = 'Cocon541986';

  const getEmployees = async () => {
    const url = `${be_api_url}${apiBase}/employees`;
    console.log('Requesting URL:', url);

    return await $fetch(url, {
      headers: { 'cocon-key': apiKey },
    });
  };

  const getEmployeeById = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error('Invalid employee ID:', id);
      throw new Error('Invalid employee ID');
    }

    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Requesting URL:', url);

    try {
      return await $fetch(url, {
        headers: { 'cocon-key': apiKey },
      });
    } catch (error) {
      console.error(`Error fetching employee by ID (${id}):`, error);
      throw error;
    }
  };

  const createEmployee = async (
    name: string,
    name_en: string,
    image: string,
    address: string,
    address_en: string,
    phoneNumber: string,
    status: boolean,
    description: string,
    description_en: string,
    email: string
  ) => {
    const url = `${be_api_url}${apiBase}/employees`;
    console.log('Creating employee at URL:', url);

    return await $fetch(url, {
      method: 'POST',
      headers: { 'cocon-key': apiKey },
      body: {
        name,
        name_en,
        image,
        address,
        address_en,
        phoneNumber,
        status,
        description,
        description_en,
        email,
      },
    });
  };

  const updateEmployee = async (
    id: number,
    payload: {
      name?: string;
      name_en?: string;
      image?: string;
      address?: string;
      address_en?: string;
      phoneNumber?: string;
      status?: boolean | number;
      description?: string;
      description_en?: string;
      email?: string;
    }
  ) => {
    if (!id || isNaN(id)) {
      console.error('Invalid employee ID:', id);
      throw new Error('Invalid employee ID');
    }

    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Updating employee at URL:', url);

    try {
      return await $fetch(url, {
        method: 'PUT',
        headers: { 'cocon-key': apiKey },
        body: payload,
      });
    } catch (error) {
      console.error(`Error updating employee (${id}):`, error);
      throw error;
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error('Invalid employee ID:', id);
      throw new Error('Invalid employee ID');
    }

    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Deleting employee at URL:', url);

    return await $fetch(url, {
      method: 'DELETE',
      headers: { 'cocon-key': apiKey },
    });
  };

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
