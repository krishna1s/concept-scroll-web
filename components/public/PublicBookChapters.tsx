import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { Chapter } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, FileText, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { PublicContentLayout } from './PublicContentLayout';

interface PublicBookChaptersProps {
  bookId: string;
  bookName: string;
  onBack: () => void;
  onChapterSelect?: (chapterId: string) => void;
}

export function PublicBookChapters({ 
  bookId, 
  bookName, 
  onBack,
  onChapterSelect
}: PublicBookChaptersProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { strings } = useLocalization();
  const t = strings.public;

  useEffect(() => {
    document.title = t.meta.chaptersTitle.replace('{bookName}', bookName);
    const loadChapters = async () => {
      try {
        const data = await apiClient.getPublicChapters(bookId);
        // Sort by chapter number
        const sorted = data.sort((a, b) => a.chapter_number - b.chapter_number);
        setChapters(sorted);
      } catch (error) {
        console.error('Failed to load chapters', error);
      } finally {
        setLoading(false);
      }
    };
    loadChapters();
  }, [bookId, bookName, t]);

  return (
    <PublicContentLayout
      title={bookName}
      subtitle={t.subtitle.chapters}
      onBack={onBack}
      backLabel={t.actions.backToBooks}
      loading={loading}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {chapters.map((chapter) => (
          <Card 
            key={chapter.id} 
            className="group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500"
            onClick={() => onChapterSelect && onChapterSelect(chapter.id)}
          >
            <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {chapter.chapter_number}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {chapter.title || chapter.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {chapter.description && (
                                <p className="text-sm text-gray-500 w-full mb-2">{chapter.description}</p>
                            )}
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-normal">
                                <FileText className="h-3 w-3 mr-1" /> {t.labels.notes}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-normal">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> {t.labels.solutions}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-indigo-600">
                    <PlayCircle className="h-6 w-6" />
                </Button>
            </CardContent>
          </Card>
        ))}

        {chapters.length === 0 && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">
                <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>{t.empty.noChapters}</p>
            </div>
        )}
      </div>
    </PublicContentLayout>
  );
}
