import { useEffect, useRef } from 'react';

export default function useDocumentTitle(title) {
  const initialTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return () => {
    document.title = initialTitle.current;
  };
}
