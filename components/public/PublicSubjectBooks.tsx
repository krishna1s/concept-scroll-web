import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { Book } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, BookOpen, Clock, FileText } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { PublicContentLayout } from './PublicContentLayout';

interface PublicSubjectBooksProps {
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  onSelectBook: (bookId: string, bookName: string) => void;
  onBack: () => void;
}

export function PublicSubjectBooks({ 
  subjectId, 
  subjectName, 
  classId, 
  className,
  onSelectBook, 
  onBack 
}: PublicSubjectBooksProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { strings } = useLocalization();
  const t = strings.public;

  useEffect(() => {
    document.title = t.meta.booksTitle.replace('{subjectName}', subjectName).replace('{className}', className);
    const loadBooks = async () => {
      try {
        const data = await apiClient.getPublicBooks(classId, subjectId);
        setBooks(data);
      } catch (error) {
        console.error('Failed to load books', error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [subjectId, classId, subjectName, className, t]);

  return (
    <PublicContentLayout
      title={t.title.books}
      subtitle={t.subtitle.books}
      breadcrumbs={`${className} • ${subjectName}`}
      onBack={onBack}
      backLabel={t.actions.backToSubjects}
      loading={loading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <Card 
            key={book.id} 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md ring-1 ring-gray-200 flex flex-col h-full"
            onClick={() => onSelectBook(book.id, book.name)}
          >
            <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                {book.cover_image ? (
                      <img 
                        src={book.cover_image} 
                        alt={book.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                        <BookOpen className="h-16 w-16" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium opacity-90">{book.medium} {t.labels.medium}</p>
                </div>
            </div>

            <CardContent className="flex-grow pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {book.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{t.title.chapters}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t.labels.updated}</span>
                  </div>
              </div>
            </CardContent>
            
            <div className="p-6 pt-0 mt-auto">
                <Button className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {t.actions.viewChapters}
                </Button>
            </div>
          </Card>
        ))}

        {books.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
                {t.empty.noBooks}
            </div>
        )}
      </div>
    </PublicContentLayout>
  );
}
