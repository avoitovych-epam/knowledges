import toast from 'react-hot-toast';

interface Router {
  push: (url: string) => void;
}

export const handleNavigate = (router: Router, url: string) => {
  router.push(url);
};

export const handleError = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    toast.error(error.message || message || 'An unexpected error occurred');
  }
};
