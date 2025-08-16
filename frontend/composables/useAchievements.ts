export const useAchievements = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiKey = 'Cocon541986';
  const apiBase = config.public.apiBase;
  const getAchievements = async () => {
    const url = `${be_api_url}${apiBase}/achievements`;
    console.log('Requesting URL:', url);
    const res = await fetch(url, {
      headers: { 'cocon-key': apiKey },
    });
    if (!res.ok) throw new Error(`Failed to fetch achievements: ${res.statusText}`);
    return res.json();
  };

  const getAchievementById = async (id: number) => {
    if (!id || isNaN(id)) throw new Error('Invalid achievement ID');
    const url = `${be_api_url}${apiBase}/achievements/${id}`;
    console.log('Requesting URL:', url);
    const res = await fetch(url, {
      headers: { 'cocon-key': apiKey },
    });
    if (!res.ok) throw new Error(`Failed to fetch achievement: ${res.statusText}`);
    return res.json();
  };

  const createAchievement = async (
    title: string,
    title_en: string,
    author: string,
    description: string,
    description_en: string,
    uploadDate: string | Date,
    status: boolean,
    pdf: string,
    canDownload: boolean
  ) => {
    if (!title || !author) throw new Error('Title and Author are required');

    const formattedDate =
      typeof uploadDate === 'string'
        ? uploadDate
        : new Date(uploadDate).toISOString().slice(0, 19).replace('T', ' ');

    const backendStatus = status ? 1 : 0;

    const url = `${be_api_url}${apiBase}/achievements`;
    console.log('Requesting URL:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        title_en,
        author,
        description,
        description_en,
        uploadDate: formattedDate,
        status: backendStatus,
        pdf,
        canDownload,
      }),
    });

    if (!res.ok) throw new Error(`Failed to create achievement: ${res.statusText}`);
    return res.json();
  };

  const updateAchievement = async (
    id: number,
    title: string,
    title_en: string,
    author: string,
    description: string,
    description_en: string,
    uploadDate: string | Date,
    status: boolean,
    pdf: string,
    canDownload: boolean
  ) => {
    if (!id || isNaN(id)) throw new Error('Invalid achievement ID');
    if (!title || !author) throw new Error('Title and Author are required');

    const formattedDate =
      typeof uploadDate === 'string'
        ? uploadDate
        : new Date(uploadDate).toISOString().slice(0, 19).replace('T', ' ');

    const backendStatus = status ? 1 : 0;

    const url = `${be_api_url}${apiBase}/achievements/${id}`;
    console.log('Updating achievement ID:', id, 'URL:', url);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        title_en,
        author,
        description,
        description_en,
        uploadDate: formattedDate,
        status: backendStatus,
        pdf,
        canDownload,
      }),
    });

    if (!res.ok) throw new Error(`Failed to update achievement: ${res.statusText}`);
    return res.json();
  };

  const deleteAchievement = async (id: number) => {
    if (!id || isNaN(id)) throw new Error('Invalid achievement ID');

    const url = `${be_api_url}${apiBase}/achievements/${id}`;
    console.log('Deleting achievement ID:', id, 'URL:', url);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'cocon-key': apiKey },
    });

    if (!res.ok) throw new Error(`Failed to delete achievement: ${res.statusText}`);
    return res.json();
  };

  return {
    getAchievements,
    getAchievementById,
    createAchievement,
    updateAchievement,
    deleteAchievement,
  };
};
