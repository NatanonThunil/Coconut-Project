export const useEmployees = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiBase = config.public.apiBase || '/env-notwork';
  const apiKey = 'Cocon541986';

  const getEmployees = async () => {
    const url = `${be_api_url}${apiBase}/employees`;
    console.log('Requesting URL:', url);
    const res = await fetch(url, {
      headers: { 'cocon-key': apiKey },
    });
    if (!res.ok) throw new Error(`Failed to fetch employees: ${res.statusText}`);
    return res.json();
  };

  const getEmployeeById = async (id: number) => {
    if (!id || isNaN(id)) throw new Error('Invalid employee ID');
    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Requesting URL:', url);
            try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching event by ID (${id}):`, error);
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
    if (!name || !email) throw new Error('Name and Email are required');
    const backendStatus = status ? 1 : 0;

    const url = `${be_api_url}${apiBase}/employees`;
    console.log('Requesting URL:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        name_en,
        image,
        address,
        address_en,
        phoneNumber,
        status: backendStatus,
        description,
        description_en,
        email,
      }),
    });

    if (!res.ok) throw new Error(`Failed to create employee: ${res.statusText}`);
    return res.json();
  };

  const updateEmployee = async (
    id: number,
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
    if (!id || isNaN(id)) throw new Error('Invalid employee ID');
    if (!name || !email) throw new Error('Name and Email are required');
    const backendStatus = status ? 1 : 0;

    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Updating employee ID:', id, 'URL:', url);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        name_en,
        image,
        address,
        address_en,
        phoneNumber,
        status: backendStatus,
        description,
        description_en,
        email,
      }),
    });

    if (!res.ok) throw new Error(`Failed to update employee: ${res.statusText}`);
    return res.json();
  };

  const deleteEmployee = async (id: number) => {
    if (!id || isNaN(id)) throw new Error('Invalid employee ID');

    const url = `${be_api_url}${apiBase}/employees/${id}`;
    console.log('Deleting employee ID:', id, 'URL:', url);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'cocon-key': apiKey },
    });

    if (!res.ok) throw new Error(`Failed to delete employee: ${res.statusText}`);
    return res.json();
  };

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
