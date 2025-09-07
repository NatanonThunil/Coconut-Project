export const useNews = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || '';
  const be_api_url = config.public.beUrl;
  const apiKey = 'Cocon541986';

  // helper: format Date -> "YYYY-MM-DD HH:mm:ss"
  const formatDate = (date: Date | string): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return ""; // fallback if invalid date
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const getNews = async () => {
    const url = `${be_api_url}${apiBase}/news`;
    console.log('Requesting URL:', url);
    return await $fetch(url, {
      headers: { 'cocon-key': apiKey },
    });
  };

  const getNewsById = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error('Invalid news ID:', id);
      throw new Error('Invalid news ID');
    }

    const url = `${be_api_url}${apiBase}/news/${id}`;
    console.log('Requesting URL:', url);
    try {
      return await $fetch(url, { headers: { 'cocon-key': apiKey } });
    } catch (error) {
      console.error(`Error fetching news by ID (${id}):`, error);
      throw error;
    }
  };

  const createNews = async (
    image: string,
    title: string,
    title_en: string,
    description: string,
    description_en: string,
    summerize: string,
    summerize_en: string,
    author: string,
    upload_date: Date | string, // <-- allow both
    status: boolean,
    hot_new: boolean
  ) => {
    const url = `${be_api_url}${apiBase}/news`;
    return await $fetch(url, {
      method: "POST",
      headers: { "cocon-key": apiKey },
      body: {
        image,
        title,
        title_en,
        description,
        description_en,
        summerize,
        summerize_en,
        author,
        upload_date: formatDate(upload_date), // safe now
        status,
        hot_new,
      },
    });
  };

  const updateNews = async (
    id: number,
    payload: {
      image?: string;
      title?: string;
      title_en?: string;
      description?: string;
      description_en?: string;
      summerize?: string;
      summerize_en?: string;
      author?: string;
      upload_date?: Date | string; // <-- allow both
      status?: boolean;
      hot_new?: boolean;
    }
  ) => {
    const url = `${be_api_url}${apiBase}/news/${id}`;

    const body = {
      ...payload,
      ...(payload.upload_date ? { upload_date: formatDate(payload.upload_date) } : {}),
    };

    return await $fetch(url, {
      method: "PUT",
      headers: { "cocon-key": apiKey },
      body,
    });
  };

  const deleteNews = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error('Invalid news ID:', id);
      throw new Error('Invalid news ID');
    }

    const url = `${be_api_url}${apiBase}/news/${id}`;
    console.log('Deleting news at URL:', url);
    return await $fetch(url, {
      method: 'DELETE',
      headers: { 'cocon-key': apiKey },
    });
  };

  return { getNews, getNewsById, createNews, updateNews, deleteNews };
};
