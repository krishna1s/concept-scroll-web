import { useState, useEffect } from 'react';
import { ChevronLeft, Search, BookOpen, Star, Filter, ArrowRight, PlayCircle, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { ViewType } from '../App';
import { apiClient } from '../services/api';
import { BACKEND_BASE_URL } from '../config/api';
import { Book, Chapter, Note, Quiz } from '../types';
import { MOCK_BOOKS, MOCK_CHAPTERS, MOCK_CHAPTER_CONTENT } from '../services/mock/mockData';

type LibraryProps = {
  onNavigate: (view: ViewType) => void;
};

type ViewState = 'books' | 'chapters' | 'content';

type ContentType = 'note' | 'video' | 'quiz';

interface ChapterContent {
  id: string;
  title: string;
  type: ContentType;
  duration?: string;
  content?: string;
  // Additional properties for rendering content
  data?: Note | Quiz;
}

export function Library({ onNavigate }: LibraryProps) {
  const [viewState, setViewState] = useState<ViewState>('books');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedContentItem, setSelectedContentItem] = useState<ChapterContent | null>(null);

  // Data States
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterContent, setChapterContent] = useState<ChapterContent[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  // Initial Load - Fetch Books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Try to fetch from real API
      try {
        const fetchedBooks = await apiClient.getBooks({});
        
        // Map API response to UI model
        const mappedBooks = fetchedBooks.map((b: any) => ({
            ...b,
            title: b.name || 'Untitled Book', // Map API 'name' to 'title'
            subject_id: b.subject?.id || 'unknown',
            _subjectName: b.subject?.name || 'General',
            author: b.author || 'NCERT', // Default author
            cover_image: b.cover_image || 'https://images.unsplash.com/photo-1741464038327-cd143c192629?w=300&q=80', // Fallback image
            rating: 4.5
        }));
        
        setBooks(mappedBooks);
        
        // If fetched books is empty, fallback to mock to show UI
        if (mappedBooks.length === 0) {
             throw new Error("No books found");
        }
      } catch (err) {
        console.warn('API getBooks failed or empty, falling back to mock data', err);
        // Map Mock Books to Book Type (ensuring compatibility)
        // MOCK_BOOKS has `rating` and `cover_url`, Book type has `cover_image`
        const mappedMockBooks = MOCK_BOOKS.map(b => ({
            ...b,
            cover_image: b.cover_url,
            is_active: true,
            class_id: 'class-1', // Mock defaults
            medium_id: 'en',
            subject_id: b.subject,
            // We'll store subject name in subject_id for mock simplicity or add a transient field
            _subjectName: b.subject 
        })) as unknown as Book[];
        setBooks(mappedMockBooks);
      }
    } catch (err) {
      setError('Failed to load library content.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update subjects list when books change
  useEffect(() => {
    const uniqueSubjects = Array.from(new Set(books.map(b => (b as any)._subjectName || b.subject_id))).filter(Boolean) as string[];
    setSubjects(uniqueSubjects);
  }, [books]);


  const loadChapters = async (bookId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedChapters = await apiClient.getChapters(bookId);
        
        // Map API response to UI model
        const mappedChapters = fetchedChapters.map((ch: any) => ({
            ...ch,
            title: ch.display_name || ch.name || `Chapter ${ch.number}`,
            chapter_number: ch.number,
            pdf_file: ch.pdf_file
        }));

        setChapters(mappedChapters);
        
        if (mappedChapters.length === 0) {
            // Check for mock fallback if this was a mock book
            if (bookId.startsWith('b')) { // Mock IDs start with 'b'
                 throw new Error("Try mock chapters");
            }
        }
      } catch (err) {
        console.warn('API getChapters failed, falling back to mock data', err);
        // Fallback
        const mockChapters = MOCK_CHAPTERS.filter(ch => ch.book_id === bookId).map(ch => ({
            ...ch,
            chapter_number: ch.number,
            is_active: true,
            book_id: bookId,
            pdf_file: null // Mock doesn't have PDF usually
        })) as unknown as Chapter[];
        setChapters(mockChapters);
      }
    } catch (err) {
      setError('Failed to load chapters.');
    } finally {
      setIsLoading(false);
    }
  };

  // ⚠️ Removed: We don't need to load feed content anymore
  // const loadChapterContent = async (chapterId: string) => { ... } 

  const filteredBooks = books.filter(book => {
    const subjectName = (book as any)._subjectName || book.subject_id;
    const title = book.title || '';
    const author = book.author || '';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject ? subjectName === selectedSubject : true;
    return matchesSearch && matchesSubject;
  });

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setViewState('chapters');
    loadChapters(book.id);
  };

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setViewState('content');
    // We don't load feed content anymore, directly show PDF
  };

  const handleBack = () => {
    if (viewState === 'content') {
        setViewState('chapters');
        setSelectedChapter(null);
    } else if (viewState === 'chapters') {
      setViewState('books');
      setSelectedBook(null);
      setChapters([]);
    } else {
      onNavigate('dashboard');
    }
  };

  // --- Views ---

  if (viewState === 'content' && selectedChapter) {
    // PDF / File View
    const pdfUrl = selectedChapter.pdf_file 
        ? (selectedChapter.pdf_file.startsWith('http') ? selectedChapter.pdf_file : `${BACKEND_BASE_URL}${selectedChapter.pdf_file}`) 
        : null;

    return (
      <div className="min-h-screen pb-20 px-4 pt-6 max-w-6xl mx-auto bg-gray-50 flex flex-col h-screen">
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold truncate">{selectedChapter.title}</h1>
            <p className="text-sm text-gray-500">Chapter {selectedChapter.chapter_number}</p>
          </div>
          {pdfUrl && (
             <a 
               href={pdfUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm text-purple-600 font-medium hover:underline"
             >
               Open in New Tab
             </a>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm flex-1 overflow-hidden relative border border-gray-200">
             {pdfUrl ? (
                 <iframe 
                    src={pdfUrl} // Basic PDF display. For better support, might use Google Docs Viewer or pdf.js
                    className="w-full h-full"
                    title={selectedChapter.title}
                 />
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Available</h3>
                    <p>This chapter does not have an attached PDF file.</p>
                 </div>
             )}
        </div>
      </div>
    );
  }

  // Dead code: Reading View (selectedContentItem) is no longer reachable
  
  if (viewState === 'chapters' && selectedBook) {
    // Chapters List View
    return (
      <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto bg-gray-50">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold truncate">{selectedBook.title}</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-4">
            <div className="w-20 h-28 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                <img src={selectedBook.cover_image} alt={selectedBook.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">{selectedBook.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{selectedBook.author}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {/* Mock rating or default */}
                    <span className="font-medium">{(selectedBook as any).rating || 4.5}</span>
                    <span className="text-gray-400">• {(selectedBook as any)._subjectName || selectedBook.subject_id}</span>
                </div>
            </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-4 px-1">Chapters</h3>

        {isLoading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        ) : (
            <div className="space-y-3">
            {chapters.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No chapters found for this book.
                </div>
            ) : (
                chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        onClick={() => handleChapterClick(chapter)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-purple-200 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <span className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-1 block">Chapter {chapter.chapter_number}</span>
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{chapter.title}</h3>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{chapter.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="w-3 h-3" />
                            {/* Assuming topic/content count might be added in future, using placeholder or derived */}
                            <span>{chapter.notes_count || 0} Topics</span>
                        </div>
                    </div>
                ))
            )}
            </div>
        )}
      </div>
    );
  }

  // Books List View
  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Library</h1>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 bg-gray-50 z-10 pb-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
          />
        </div>

        {/* Subject Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedSubject(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSubject === null
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            All
          </button>
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSubject === subject
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {isLoading && books.length === 0 ? (
        <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
            <div 
                key={book.id} 
                onClick={() => handleBookClick(book)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {(book as any).rating || 4.5}
                </div>
                </div>
                <div className="p-3">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {(book as any)._subjectName || book.subject_id}
                    </span>
                    <div className="p-1.5 text-gray-400 group-hover:text-purple-600 transition-colors">
                    <BookOpen className="w-5 h-5" />
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {!isLoading && filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
