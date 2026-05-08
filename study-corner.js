(function () {
    const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const STORAGE_PREFIX = 'studyCornerAnnotations:';
    const READ_ONLY_MODE = true;
    const COLOR_MAP = {
        yellow: 'rgba(250, 204, 21, 0.38)',
        green: 'rgba(74, 222, 128, 0.34)',
        blue: 'rgba(96, 165, 250, 0.34)',
        pink: 'rgba(244, 114, 182, 0.34)',
        orange: 'rgba(251, 146, 60, 0.36)'
    };

    const studyBooks = [
        {
            id: 'backend-developer-interview-mastery',
            title: 'Backend Developer Interview Mastery',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Backend', 'Interviews', 'Career'],
            description: 'Backend interview preparation with practical engineering and system thinking notes.',
            size: '1,295 KB',
            pages: null,
            source: 'books/mybooks/Backend Developer Interview Mastery.pdf'
        },
        {
            id: 'javascript-for-web-development-mastery',
            title: 'JavaScript for Web Development Mastery',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['JavaScript', 'Web Development', 'Frontend'],
            description: 'A web development reference for JavaScript fundamentals and browser-based projects.',
            size: '861 KB',
            pages: null,
            source: 'books/mybooks/JAVASCRIPT FOR WEB DEVELOPMENT MASTER BOOK.pdf'
        },
        {
            id: 'master-english-easily',
            title: 'Master English Easily',
            author: 'Ishfaq Dar / Curated',
            category: 'Self-Development',
            tags: ['English', 'Communication', 'Language'],
            description: 'A language-learning book for improving English fluency and confidence.',
            size: '943 KB',
            pages: null,
            source: 'books/mybooks/MASTER ENGLISH EASILY.pdf'
        },
        {
            id: 'fresher-to-job-ready-data-analyst',
            title: 'Fresher to Job-Ready Data Analyst',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Data Analysis', 'Career', 'SQL', 'Python'],
            description: 'A structured transition guide from beginner analyst to portfolio-ready candidate.',
            size: '3,213 KB',
            pages: null,
            source: 'books/mybooks/Fresher to Job-Ready Data Analyst.pdf'
        },
        {
            id: 'english',
            title: 'English',
            author: 'Ishfaq Dar / Curated',
            category: 'Reference',
            tags: ['English', 'Reference', 'Language'],
            description: 'English reference material for study, practice, and quick revision.',
            size: '1,057 KB',
            pages: null,
            source: 'books/mybooks/English.pdf'
        },
        {
            id: 'book-3-advanced-backend-system-design',
            title: 'BOOK 3 Advanced Backend and System Design',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Backend', 'System Design', 'Architecture'],
            description: 'Advanced backend patterns, system design, and scalable architecture notes.',
            size: '835 KB',
            pages: null,
            source: 'books/mybooks/BOOK 3 Advanced Backend & System Design1.pdf'
        },
        {
            id: 'book-1-python-backend-foundations',
            title: 'BOOK 1 Python Backend Foundations',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Python', 'Backend', 'Foundations'],
            description: 'Foundational Python backend concepts for APIs, services, and server-side workflows.',
            size: '611 KB',
            pages: null,
            source: 'books/mybooks/BOOK 1 PYTHON BACKEND FOUNDATIONS1.pdf'
        },
        {
            id: 'book-2-backend-development-databases',
            title: 'BOOK 2 Backend Development and Databases',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Backend', 'Databases', 'SQL'],
            description: 'Backend database design, data modeling, queries, and persistence fundamentals.',
            size: '752 KB',
            pages: null,
            source: 'books/mybooks/BOOK 2 Backend Development & Databases.pdf'
        },
        {
            id: 'python-engineering',
            title: 'Python Engineering',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Python', 'Engineering', 'Programming'],
            description: 'Python engineering practices for writing reliable, maintainable applications.',
            size: '2,437 KB',
            pages: null,
            source: 'books/mybooks/Python Engineering.pdf'
        },
        {
            id: 'python-for-backend-development',
            title: 'Python for Backend Development',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Python', 'Backend', 'APIs'],
            description: 'A backend-focused Python guide covering API thinking and service foundations.',
            size: '1,908 KB',
            pages: null,
            source: 'books/mybooks/Python for Backend Development.pdf'
        },
        {
            id: 'backend-engineering-to-ai-systems',
            title: 'Backend Engineering to AI Systems',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Backend', 'AI Systems', 'Engineering'],
            description: 'A bridge from backend engineering foundations to AI-powered system design.',
            size: '1,626 KB',
            pages: null,
            source: 'books/mybooks/Backend Engineering to AI Systems.pdf'
        },
        {
            id: 'python-dsa',
            title: 'PYTHON DSA',
            author: 'Ishfaq Dar / Curated',
            category: 'Technical',
            tags: ['Python', 'DSA', 'Algorithms'],
            description: 'Python data structures and algorithms material for coding practice and revision.',
            size: '1,794 KB',
            pages: null,
            source: 'books/mybooks/PYTHON DSA.pdf'
        }
    ];

    const state = {
        activeCategory: 'All',
        filteredBooks: studyBooks.slice(),
        libraryPage: 1,
        booksPerPage: 8,
        currentBook: null,
        pdfDoc: null,
        scale: 1.1,
        rotation: 0,
        currentPage: 1,
        pageCount: 0,
        renderedPages: new Set(),
        renderingPages: new Set(),
        pageText: new Map(),
        annotations: { highlights: [], notes: [], drawings: {} },
        highlightColor: 'yellow',
        noteMode: false,
        drawMode: false,
        drawing: null,
        observer: null,
        thumbObserver: null,
        searchQuery: '',
        searchMatches: [],
        searchIndex: -1,
        ttsUtterance: null,
        coverCache: new Map()
    };

    const els = {};

    document.addEventListener('DOMContentLoaded', initStudyCorner);

    function initStudyCorner() {
        if (!document.body.hasAttribute('data-study-corner')) {
            return;
        }

        cacheElements();
        configurePdfJs();
        renderCategoryFilters();
        filterBooks();
        bindEvents();
        updateReaderAvailability(false);
    }

    function cacheElements() {
        els.libraryCount = document.getElementById('libraryCount');
        els.bookSearch = document.getElementById('bookSearch');
        els.categoryFilters = document.getElementById('categoryFilters');
        els.bookGrid = document.getElementById('bookGrid');
        els.libraryPagination = document.getElementById('libraryPagination');
        els.readerShell = document.querySelector('.reader-shell');
        els.readerBookTitle = document.getElementById('readerBookTitle');
        els.readerBookMeta = document.getElementById('readerBookMeta');
        els.readerDownloadLink = document.getElementById('readerDownloadLink');
        els.downloadPaymentModal = document.getElementById('downloadPaymentModal');
        els.paymentBookTitle = document.getElementById('paymentBookTitle');
        els.paymentWhatsappLink = document.getElementById('paymentWhatsappLink');
        els.thumbnailStrip = document.getElementById('thumbnailStrip');
        els.outlineList = document.getElementById('outlineList');
        els.notesList = document.getElementById('notesList');
        els.prevPage = document.getElementById('prevPage');
        els.nextPage = document.getElementById('nextPage');
        els.pageNumber = document.getElementById('pageNumber');
        els.pageCount = document.getElementById('pageCount');
        els.zoomOut = document.getElementById('zoomOut');
        els.zoomIn = document.getElementById('zoomIn');
        els.zoomValue = document.getElementById('zoomValue');
        els.fitWidth = document.getElementById('fitWidth');
        els.fitPage = document.getElementById('fitPage');
        els.rotatePage = document.getElementById('rotatePage');
        els.fullscreenReader = document.getElementById('fullscreenReader');
        els.documentSearch = document.getElementById('documentSearch');
        els.prevMatch = document.getElementById('prevMatch');
        els.nextMatch = document.getElementById('nextMatch');
        els.matchCount = document.getElementById('matchCount');
        els.highlightSelection = document.getElementById('highlightSelection');
        els.noteMode = document.getElementById('noteMode');
        els.drawMode = document.getElementById('drawMode');
        els.clearDrawing = document.getElementById('clearDrawing');
        els.ttsButton = document.getElementById('ttsButton');
        els.readerTheme = document.getElementById('readerTheme');
        els.readerStatus = document.getElementById('readerStatus');
        els.pdfViewport = document.getElementById('pdfViewport');
        els.sidebarTabs = Array.from(document.querySelectorAll('.sidebar-tab'));
    }

    function configurePdfJs() {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
        }
        els.libraryCount.textContent = String(studyBooks.length);
    }

    function bindEvents() {
        els.bookSearch.addEventListener('input', () => {
            state.libraryPage = 1;
            filterBooks();
        });

        els.categoryFilters.addEventListener('click', (event) => {
            const button = event.target.closest('[data-category]');
            if (!button) return;
            state.activeCategory = button.dataset.category;
            state.libraryPage = 1;
            renderCategoryFilters();
            filterBooks();
        });

        els.bookGrid.addEventListener('click', (event) => {
            const readButton = event.target.closest('[data-read-book]');
            const downloadButton = event.target.closest('[data-download-book]');
            if (readButton) {
                openBook(readButton.dataset.readBook);
                return;
            }
            if (downloadButton) {
                openPaymentPrompt(downloadButton.dataset.downloadBook);
            }
        });

        els.libraryPagination.addEventListener('click', (event) => {
            const button = event.target.closest('[data-library-page]');
            if (!button) return;
            state.libraryPage = Number(button.dataset.libraryPage);
            renderBooks();
        });

        els.prevPage.addEventListener('click', () => goToPage(state.currentPage - 1));
        els.nextPage.addEventListener('click', () => goToPage(state.currentPage + 1));
        els.pageNumber.addEventListener('change', () => goToPage(Number(els.pageNumber.value)));
        els.zoomOut.addEventListener('click', () => setScale(state.scale - 0.15));
        els.zoomIn.addEventListener('click', () => setScale(state.scale + 0.15));
        els.fitWidth.addEventListener('click', fitToWidth);
        els.fitPage.addEventListener('click', fitToPage);
        els.rotatePage.addEventListener('click', rotateDocument);
        els.fullscreenReader.addEventListener('click', toggleFullscreen);

        els.documentSearch.addEventListener('input', debounce(runDocumentSearch, 250));
        els.prevMatch.addEventListener('click', () => moveSearchMatch(-1));
        els.nextMatch.addEventListener('click', () => moveSearchMatch(1));

        document.querySelectorAll('.color-swatch').forEach((button) => {
            button.addEventListener('click', () => {
                state.highlightColor = button.dataset.color;
                document.querySelectorAll('.color-swatch').forEach((item) => item.classList.remove('active'));
                button.classList.add('active');
            });
        });

        els.highlightSelection.addEventListener('click', addHighlightFromSelection);
        els.noteMode.addEventListener('click', toggleNoteMode);
        els.drawMode.addEventListener('click', toggleDrawMode);
        els.clearDrawing.addEventListener('click', clearCurrentDrawing);
        els.ttsButton.addEventListener('click', speakCurrentPage);
        els.readerDownloadLink.addEventListener('click', () => {
            if (state.currentBook) {
                openPaymentPrompt(state.currentBook.id);
            }
        });

        els.readerTheme.addEventListener('change', () => {
            els.readerShell.dataset.theme = els.readerTheme.value;
        });

        els.sidebarTabs.forEach((tab) => {
            tab.addEventListener('click', () => showSidebarPanel(tab.dataset.panel));
        });

        els.thumbnailStrip.addEventListener('click', (event) => {
            const button = event.target.closest('[data-page]');
            if (!button) return;
            goToPage(Number(button.dataset.page));
        });

        els.outlineList.addEventListener('click', (event) => {
            const button = event.target.closest('[data-page]');
            if (!button) return;
            goToPage(Number(button.dataset.page));
        });

        els.notesList.addEventListener('click', (event) => {
            const button = event.target.closest('[data-page]');
            if (!button) return;
            goToPage(Number(button.dataset.page));
        });

        els.pdfViewport.addEventListener('click', handlePageClick);
        els.pdfViewport.addEventListener('dblclick', removeHighlight);
        els.pdfViewport.addEventListener('pointerdown', startDrawing);
        els.pdfViewport.addEventListener('pointermove', continueDrawing);
        window.addEventListener('pointerup', stopDrawing);

        els.downloadPaymentModal.addEventListener('click', (event) => {
            if (event.target.closest('[data-close-payment]')) {
                closePaymentPrompt();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !els.downloadPaymentModal.hidden) {
                closePaymentPrompt();
            }
        });
    }

    function renderCategoryFilters() {
        const categories = ['All'].concat(Array.from(new Set(studyBooks.map((book) => book.category))));
        els.categoryFilters.innerHTML = categories.map((category) => (
            `<button type="button" class="category-filter${state.activeCategory === category ? ' active' : ''}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`
        )).join('');
    }

    function filterBooks() {
        const query = els.bookSearch.value.trim().toLowerCase();
        state.filteredBooks = studyBooks.filter((book) => {
            const text = [
                book.title,
                book.author,
                book.category,
                book.description,
                book.tags.join(' ')
            ].join(' ').toLowerCase();
            const categoryMatch = state.activeCategory === 'All' || book.category === state.activeCategory;
            return categoryMatch && (!query || text.includes(query));
        });
        renderBooks();
    }

    function renderBooks() {
        const start = (state.libraryPage - 1) * state.booksPerPage;
        const visibleBooks = state.filteredBooks.slice(start, start + state.booksPerPage);

        if (!visibleBooks.length) {
            els.bookGrid.innerHTML = '<div class="empty-library">No books match your search.</div>';
            els.libraryPagination.innerHTML = '';
            return;
        }

        els.bookGrid.innerHTML = visibleBooks.map((book) => {
            const tags = book.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
            const pageLabel = book.pages ? `${book.pages} pages` : 'Page count on load';
            return `
                <article class="book-card">
                    <div class="book-cover" data-cover="${escapeHtml(book.id)}">
                        <span>${escapeHtml(book.category)}</span>
                        <strong>${escapeHtml(bookInitials(book.title))}</strong>
                        <small>PDF</small>
                    </div>
                    <div class="book-card-body">
                        <div class="book-card-heading">
                            <h3>${escapeHtml(book.title)}</h3>
                            <p>${escapeHtml(book.author)}</p>
                        </div>
                        <p class="book-description">${escapeHtml(book.description)}</p>
                        <div class="book-tags">${tags}</div>
                        <div class="book-meta">
                            <span><i class="fas fa-file-pdf"></i> ${escapeHtml(book.size)}</span>
                            <span data-page-count="${escapeAttribute(book.id)}"><i class="fas fa-layer-group"></i> ${escapeHtml(pageLabel)}</span>
                        </div>
                        <div class="book-actions">
                            <button type="button" class="library-action primary" data-read-book="${escapeHtml(book.id)}">
                                <i class="fas fa-book-open"></i>
                                Read Online
                            </button>
                            <button type="button" class="library-action secondary" data-download-book="${escapeHtml(book.id)}">
                                <i class="fas fa-download"></i>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        renderPagination();
        renderBookCovers(visibleBooks);
    }

    function renderBookCovers(books) {
        if (!window.pdfjsLib) return;

        books.forEach((book) => {
            const cover = els.bookGrid.querySelector(`[data-cover="${cssEscape(book.id)}"]`);
            if (!cover || cover.classList.contains('cover-rendered')) return;

            if (state.coverCache.has(book.id)) {
                cover.innerHTML = `<img src="${state.coverCache.get(book.id)}" alt="${escapeAttribute(book.title)} cover">`;
                cover.classList.add('cover-rendered');
                return;
            }

            window.pdfjsLib.getDocument(book.source).promise
                .then((pdf) => {
                    book.pages = pdf.numPages;
                    updateBookPageCount(book);
                    return pdf.getPage(1);
                })
                .then((page) => {
                    const viewport = page.getViewport({ scale: 0.42 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const ratio = window.devicePixelRatio || 1;
                    canvas.width = Math.floor(viewport.width * ratio);
                    canvas.height = Math.floor(viewport.height * ratio);
                    context.setTransform(ratio, 0, 0, ratio, 0, 0);
                    return page.render({ canvasContext: context, viewport }).promise.then(() => canvas);
                })
                .then((canvas) => {
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
                    state.coverCache.set(book.id, dataUrl);
                    if (cover.isConnected) {
                        cover.innerHTML = `<img src="${dataUrl}" alt="${escapeAttribute(book.title)} cover">`;
                        cover.classList.add('cover-rendered');
                    }
                })
                .catch(() => {
                    cover.classList.add('cover-unavailable');
                });
        });
    }

    function updateBookPageCount(book) {
        const pageCount = els.bookGrid.querySelector(`[data-page-count="${cssEscape(book.id)}"]`);
        if (pageCount && book.pages) {
            pageCount.innerHTML = `<i class="fas fa-layer-group"></i> ${book.pages} pages`;
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(state.filteredBooks.length / state.booksPerPage);
        if (totalPages <= 1) {
            els.libraryPagination.innerHTML = '';
            return;
        }

        const buttons = [];
        for (let index = 1; index <= totalPages; index += 1) {
            buttons.push(`<button type="button" class="${state.libraryPage === index ? 'active' : ''}" data-library-page="${index}">${index}</button>`);
        }
        els.libraryPagination.innerHTML = buttons.join('');
    }

    async function openBook(bookId) {
        const book = studyBooks.find((item) => item.id === bookId);
        if (!book) return;

        resetReader();
        state.currentBook = book;
        state.annotations = loadAnnotations(book.id);
        els.readerBookTitle.textContent = book.title;
        els.readerBookMeta.textContent = `${book.author} | ${book.category} | ${book.size}`;
        els.readerDownloadLink.classList.remove('disabled');
        els.readerDownloadLink.disabled = false;
        updateReaderAvailability(true);
        setReaderStatus('Loading PDF and preparing reader tools...');
        els.readerShell.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (!window.pdfjsLib) {
            setReaderStatus('PDF.js could not load. Check your internet connection or host PDF.js locally.');
            return;
        }

        try {
            const loadingTask = window.pdfjsLib.getDocument(book.source);
            state.pdfDoc = await loadingTask.promise;
            state.pageCount = state.pdfDoc.numPages;
            book.pages = state.pageCount;
            els.pageCount.textContent = `/ ${state.pageCount}`;
            els.pageNumber.max = String(state.pageCount);
            createPageShells();
            await renderOutline();
            renderNotesList();
            setupPageObserver();
            setupThumbnailObserver();
            await renderPage(1, true);
            goToPage(1);
            setReaderStatus('Reader ready.');
            renderBooks();
        } catch (error) {
            setReaderStatus(`PDF not found yet. Add the file at ${book.source} and reload this page.`);
        }
    }

    function resetReader() {
        if (state.observer) state.observer.disconnect();
        if (state.thumbObserver) state.thumbObserver.disconnect();
        state.pdfDoc = null;
        state.scale = 1.1;
        state.rotation = 0;
        state.currentPage = 1;
        state.pageCount = 0;
        state.renderedPages.clear();
        state.renderingPages.clear();
        state.pageText.clear();
        state.searchQuery = '';
        state.searchMatches = [];
        state.searchIndex = -1;
        state.noteMode = false;
        state.drawMode = false;
        state.drawing = null;
        els.pdfViewport.innerHTML = '';
        els.thumbnailStrip.innerHTML = '';
        els.outlineList.innerHTML = '';
        els.notesList.innerHTML = '';
        els.documentSearch.value = '';
        els.matchCount.textContent = '0 matches';
        els.pageNumber.value = '1';
        els.pageCount.textContent = '/ 0';
        updateZoomLabel();
        els.readerDownloadLink.classList.add('disabled');
        els.readerDownloadLink.disabled = true;
        els.noteMode.classList.remove('active');
        els.drawMode.classList.remove('active');
        els.readerShell.classList.remove('draw-active');
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    function updateReaderAvailability(enabled) {
        [
            els.prevPage,
            els.nextPage,
            els.pageNumber,
            els.zoomOut,
            els.zoomIn,
            els.fitWidth,
            els.fitPage,
            els.rotatePage,
            els.fullscreenReader,
            els.documentSearch,
            els.prevMatch,
            els.nextMatch,
            els.highlightSelection,
            els.noteMode,
            els.drawMode,
            els.clearDrawing,
            els.ttsButton,
            els.readerTheme
        ].forEach((element) => {
            element.disabled = !enabled;
        });
    }

    function openPaymentPrompt(bookId) {
        const book = studyBooks.find((item) => item.id === bookId) || state.currentBook;
        const bookTitle = book ? book.title : 'Selected PDF';
        const message = `Assalamu Alaikum, I want to download "${bookTitle}" from your Study Corner. Please share payment details.`;
        els.paymentBookTitle.textContent = bookTitle;
        els.paymentWhatsappLink.href = `https://wa.me/917006370956?text=${encodeURIComponent(message)}`;
        els.downloadPaymentModal.hidden = false;
        document.body.classList.add('modal-open');
        setTimeout(() => els.paymentWhatsappLink.focus(), 0);
    }

    function closePaymentPrompt() {
        els.downloadPaymentModal.hidden = true;
        document.body.classList.remove('modal-open');
    }

    function createPageShells() {
        const pages = [];
        for (let pageNumber = 1; pageNumber <= state.pageCount; pageNumber += 1) {
            pages.push(`
                <section class="pdf-page-shell" id="pdf-page-${pageNumber}" data-page="${pageNumber}">
                    <div class="pdf-page-label">Page ${pageNumber}</div>
                    <div class="pdf-page-surface">
                        <canvas class="pdf-canvas"></canvas>
                        <div class="pdf-text-layer"></div>
                        <div class="pdf-highlight-layer"></div>
                        <canvas class="pdf-draw-layer"></canvas>
                        <div class="pdf-note-layer"></div>
                    </div>
                </section>
            `);
        }
        els.pdfViewport.innerHTML = pages.join('');
        els.thumbnailStrip.innerHTML = Array.from({ length: state.pageCount }, (_, index) => {
            const pageNumber = index + 1;
            return `
                <button type="button" class="thumbnail-button" data-page="${pageNumber}" aria-label="Go to page ${pageNumber}">
                    <canvas></canvas>
                    <span>${pageNumber}</span>
                </button>
            `;
        }).join('');
    }

    function setupPageObserver() {
        if (state.observer) state.observer.disconnect();
        state.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const pageNumber = Number(entry.target.dataset.page);
                if (entry.isIntersecting) {
                    renderPage(pageNumber);
                    updateCurrentPage(pageNumber);
                }
            });
        }, {
            root: els.pdfViewport,
            rootMargin: '700px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('.pdf-page-shell').forEach((page) => state.observer.observe(page));
    }

    function setupThumbnailObserver() {
        if (state.thumbObserver) state.thumbObserver.disconnect();
        state.thumbObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const button = entry.target;
                renderThumbnail(Number(button.dataset.page), button);
                state.thumbObserver.unobserve(button);
            });
        }, {
            root: els.thumbnailStrip,
            threshold: 0.1
        });

        els.thumbnailStrip.querySelectorAll('.thumbnail-button').forEach((button) => state.thumbObserver.observe(button));
    }

    async function renderPage(pageNumber, force) {
        if (!state.pdfDoc || pageNumber < 1 || pageNumber > state.pageCount) return;
        if (!force && state.renderedPages.has(pageNumber)) return;
        if (state.renderingPages.has(pageNumber)) return;

        state.renderingPages.add(pageNumber);
        const shell = getPageShell(pageNumber);
        if (!shell) return;

        try {
            const page = await state.pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: state.scale, rotation: state.rotation });
            const surface = shell.querySelector('.pdf-page-surface');
            const canvas = shell.querySelector('.pdf-canvas');
            const context = canvas.getContext('2d');
            const ratio = window.devicePixelRatio || 1;

            surface.style.width = `${viewport.width}px`;
            surface.style.height = `${viewport.height}px`;
            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);

            await page.render({ canvasContext: context, viewport }).promise;

            const textContent = await page.getTextContent();
            state.pageText.set(pageNumber, textContent.items.map((item) => item.str).join(' '));
            await renderTextLayer(surface, textContent, viewport);
            prepareDrawingLayer(surface, pageNumber, viewport, ratio);
            if (!READ_ONLY_MODE) {
                renderHighlights(pageNumber);
                renderNotes(pageNumber);
            }
            applySearchHighlights(pageNumber);
            state.renderedPages.add(pageNumber);
        } catch (error) {
            shell.classList.add('page-error');
        } finally {
            state.renderingPages.delete(pageNumber);
        }
    }

    async function renderTextLayer(surface, textContent, viewport) {
        const textLayer = surface.querySelector('.pdf-text-layer');
        textLayer.innerHTML = '';
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;

        if (window.pdfjsLib && window.pdfjsLib.renderTextLayer) {
            await window.pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textLayer,
                viewport,
                textDivs: []
            }).promise;
        }
    }

    function prepareDrawingLayer(surface, pageNumber, viewport, ratio) {
        const canvas = surface.querySelector('.pdf-draw-layer');
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const context = canvas.getContext('2d');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        if (!READ_ONLY_MODE) {
            restoreDrawing(pageNumber, canvas);
        }
    }

    async function renderThumbnail(pageNumber, button) {
        if (!state.pdfDoc || button.classList.contains('rendered')) return;
        try {
            const page = await state.pdfDoc.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1, rotation: state.rotation });
            const scale = Math.min(0.2, 118 / baseViewport.width);
            const viewport = page.getViewport({ scale, rotation: state.rotation });
            const canvas = button.querySelector('canvas');
            const context = canvas.getContext('2d');
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            await page.render({ canvasContext: context, viewport }).promise;
            button.classList.add('rendered');
        } catch (error) {
            button.classList.add('thumbnail-error');
        }
    }

    async function renderOutline() {
        els.outlineList.innerHTML = '<p class="sidebar-empty">Loading outline...</p>';
        const outline = await state.pdfDoc.getOutline();

        if (!outline || !outline.length) {
            els.outlineList.innerHTML = `
                <button type="button" data-page="1">Start</button>
                <button type="button" data-page="${state.pageCount}">Last page</button>
                <p class="sidebar-empty">No embedded table of contents was found.</p>
            `;
            return;
        }

        const buttons = [];
        for (const item of outline) {
            const pageNumber = await resolveOutlinePage(item.dest);
            if (pageNumber) {
                buttons.push(`<button type="button" data-page="${pageNumber}">${escapeHtml(item.title || `Page ${pageNumber}`)}</button>`);
            }
        }

        els.outlineList.innerHTML = buttons.length ? buttons.join('') : '<p class="sidebar-empty">No readable outline entries were found.</p>';
    }

    async function resolveOutlinePage(destination) {
        try {
            const explicitDestination = Array.isArray(destination) ? destination : await state.pdfDoc.getDestination(destination);
            if (!explicitDestination || !explicitDestination[0]) return null;
            const pageIndex = await state.pdfDoc.getPageIndex(explicitDestination[0]);
            return pageIndex + 1;
        } catch (error) {
            return null;
        }
    }

    function goToPage(pageNumber) {
        if (!state.pdfDoc) return;
        const normalized = clamp(Math.round(pageNumber || 1), 1, state.pageCount);
        const shell = getPageShell(normalized);
        if (!shell) return;
        renderPage(normalized);
        shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateCurrentPage(normalized);
    }

    function updateCurrentPage(pageNumber) {
        state.currentPage = clamp(pageNumber, 1, state.pageCount || 1);
        els.pageNumber.value = String(state.currentPage);
        els.thumbnailStrip.querySelectorAll('.thumbnail-button').forEach((button) => {
            button.classList.toggle('active', Number(button.dataset.page) === state.currentPage);
        });
    }

    function setScale(nextScale) {
        state.scale = clamp(nextScale, 0.55, 2.6);
        updateZoomLabel();
        rerenderVisiblePages();
    }

    async function fitToWidth() {
        if (!state.pdfDoc) return;
        const page = await state.pdfDoc.getPage(state.currentPage);
        const viewport = page.getViewport({ scale: 1, rotation: state.rotation });
        const availableWidth = Math.max(320, els.pdfViewport.clientWidth - 64);
        setScale(availableWidth / viewport.width);
    }

    async function fitToPage() {
        if (!state.pdfDoc) return;
        const page = await state.pdfDoc.getPage(state.currentPage);
        const viewport = page.getViewport({ scale: 1, rotation: state.rotation });
        const availableWidth = Math.max(320, els.pdfViewport.clientWidth - 64);
        const availableHeight = Math.max(420, els.pdfViewport.clientHeight - 70);
        setScale(Math.min(availableWidth / viewport.width, availableHeight / viewport.height));
    }

    function rotateDocument() {
        state.rotation = (state.rotation + 90) % 360;
        rerenderVisiblePages(true);
        setupThumbnailObserver();
    }

    function rerenderVisiblePages(resetThumbnails) {
        state.renderedPages.clear();
        state.renderingPages.clear();
        const visiblePages = getVisiblePageNumbers();
        visiblePages.forEach((pageNumber) => renderPage(pageNumber, true));
        if (resetThumbnails) {
            els.thumbnailStrip.querySelectorAll('.thumbnail-button').forEach((button) => {
                button.classList.remove('rendered');
                const canvas = button.querySelector('canvas');
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }

    function getVisiblePageNumbers() {
        const viewportRect = els.pdfViewport.getBoundingClientRect();
        return Array.from(document.querySelectorAll('.pdf-page-shell')).filter((shell) => {
            const rect = shell.getBoundingClientRect();
            return rect.bottom >= viewportRect.top - 400 && rect.top <= viewportRect.bottom + 400;
        }).map((shell) => Number(shell.dataset.page));
    }

    function updateZoomLabel() {
        els.zoomValue.textContent = `${Math.round(state.scale * 100)}%`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            els.readerShell.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    async function runDocumentSearch() {
        if (!state.pdfDoc) return;
        const query = els.documentSearch.value.trim().toLowerCase();
        state.searchQuery = query;
        state.searchMatches = [];
        state.searchIndex = -1;

        clearSearchHighlights();

        if (!query) {
            els.matchCount.textContent = '0 matches';
            return;
        }

        setReaderStatus('Searching document...');
        for (let pageNumber = 1; pageNumber <= state.pageCount; pageNumber += 1) {
            const text = (await getPageText(pageNumber)).toLowerCase();
            const count = countOccurrences(text, query);
            for (let index = 0; index < count; index += 1) {
                state.searchMatches.push({ page: pageNumber });
            }
        }

        els.matchCount.textContent = `${state.searchMatches.length} ${state.searchMatches.length === 1 ? 'match' : 'matches'}`;
        getVisiblePageNumbers().forEach(applySearchHighlights);
        setReaderStatus(state.searchMatches.length ? 'Search complete.' : 'No matches found.');
        if (state.searchMatches.length) {
            moveSearchMatch(1);
        }
    }

    async function getPageText(pageNumber) {
        if (state.pageText.has(pageNumber)) return state.pageText.get(pageNumber);
        const page = await state.pdfDoc.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item) => item.str).join(' ');
        state.pageText.set(pageNumber, text);
        return text;
    }

    function moveSearchMatch(direction) {
        if (!state.searchMatches.length) return;
        state.searchIndex = (state.searchIndex + direction + state.searchMatches.length) % state.searchMatches.length;
        const match = state.searchMatches[state.searchIndex];
        els.matchCount.textContent = `${state.searchIndex + 1} / ${state.searchMatches.length}`;
        goToPage(match.page);
    }

    function applySearchHighlights(pageNumber) {
        const shell = getPageShell(pageNumber);
        if (!shell || !state.searchQuery) return;
        shell.querySelectorAll('.reader-search-hit').forEach((span) => span.classList.remove('reader-search-hit'));
        shell.querySelectorAll('.pdf-text-layer span').forEach((span) => {
            if (span.textContent.toLowerCase().includes(state.searchQuery)) {
                span.classList.add('reader-search-hit');
            }
        });
    }

    function clearSearchHighlights() {
        document.querySelectorAll('.reader-search-hit').forEach((span) => span.classList.remove('reader-search-hit'));
    }

    function addHighlightFromSelection() {
        if (READ_ONLY_MODE) {
            setReaderStatus('Read mode is active. Downloads are available after payment request.');
            return;
        }
        if (!state.currentBook) return;
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount || !selection.toString().trim()) {
            setReaderStatus('Select text in the PDF before highlighting.');
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();
        const newHighlights = [];

        Array.from(range.getClientRects()).forEach((rect) => {
            if (rect.width < 3 || rect.height < 3) return;
            const pageShell = pageShellFromPoint(rect.left + Math.min(rect.width / 2, rect.width - 1), rect.top + Math.min(rect.height / 2, rect.height - 1));
            if (!pageShell) return;
            const surface = pageShell.querySelector('.pdf-page-surface');
            const surfaceRect = surface.getBoundingClientRect();
            newHighlights.push({
                id: makeId(),
                page: Number(pageShell.dataset.page),
                color: state.highlightColor,
                text: selectedText,
                rect: {
                    x: (rect.left - surfaceRect.left) / surfaceRect.width,
                    y: (rect.top - surfaceRect.top) / surfaceRect.height,
                    width: rect.width / surfaceRect.width,
                    height: rect.height / surfaceRect.height
                }
            });
        });

        if (!newHighlights.length) {
            setReaderStatus('Could not place that highlight.');
            return;
        }

        state.annotations.highlights.push(...newHighlights);
        saveAnnotations();
        selection.removeAllRanges();
        new Set(newHighlights.map((highlight) => highlight.page)).forEach(renderHighlights);
        setReaderStatus('Highlight saved.');
    }

    function renderHighlights(pageNumber) {
        const shell = getPageShell(pageNumber);
        if (!shell) return;
        const layer = shell.querySelector('.pdf-highlight-layer');
        layer.innerHTML = '';

        state.annotations.highlights
            .filter((highlight) => highlight.page === pageNumber)
            .forEach((highlight) => {
                const mark = document.createElement('button');
                mark.type = 'button';
                mark.className = `persisted-highlight hl-${highlight.color}`;
                mark.dataset.highlightId = highlight.id;
                mark.title = highlight.text || 'Saved highlight';
                mark.style.left = `${highlight.rect.x * 100}%`;
                mark.style.top = `${highlight.rect.y * 100}%`;
                mark.style.width = `${highlight.rect.width * 100}%`;
                mark.style.height = `${highlight.rect.height * 100}%`;
                layer.appendChild(mark);
            });
    }

    function removeHighlight(event) {
        const highlight = event.target.closest('[data-highlight-id]');
        if (!highlight || !state.currentBook) return;
        state.annotations.highlights = state.annotations.highlights.filter((item) => item.id !== highlight.dataset.highlightId);
        saveAnnotations();
        highlight.remove();
        setReaderStatus('Highlight removed.');
    }

    function toggleNoteMode() {
        if (READ_ONLY_MODE) {
            setReaderStatus('Read mode is active.');
            return;
        }
        state.noteMode = !state.noteMode;
        if (state.noteMode) {
            state.drawMode = false;
            els.drawMode.classList.remove('active');
            els.readerShell.classList.remove('draw-active');
        }
        els.noteMode.classList.toggle('active', state.noteMode);
        setReaderStatus(state.noteMode ? 'Click a page to place a note.' : 'Note tool closed.');
    }

    function handlePageClick(event) {
        if (!state.noteMode || !state.currentBook) return;
        if (event.target.closest('.page-note')) return;
        const surface = event.target.closest('.pdf-page-surface');
        if (!surface) return;
        const shell = surface.closest('.pdf-page-shell');
        const rect = surface.getBoundingClientRect();
        const noteText = window.prompt('Add note');
        if (!noteText || !noteText.trim()) return;

        state.annotations.notes.push({
            id: makeId(),
            page: Number(shell.dataset.page),
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
            text: noteText.trim()
        });
        saveAnnotations();
        renderNotes(Number(shell.dataset.page));
        renderNotesList();
        state.noteMode = false;
        els.noteMode.classList.remove('active');
        setReaderStatus('Note saved.');
    }

    function renderNotes(pageNumber) {
        const shell = getPageShell(pageNumber);
        if (!shell) return;
        const layer = shell.querySelector('.pdf-note-layer');
        layer.innerHTML = '';

        state.annotations.notes
            .filter((note) => note.page === pageNumber)
            .forEach((note) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'page-note';
                button.dataset.noteId = note.id;
                button.style.left = `${note.x * 100}%`;
                button.style.top = `${note.y * 100}%`;
                button.innerHTML = '<i class="fas fa-note-sticky"></i>';
                button.title = note.text;
                button.addEventListener('click', () => editNote(note.id));
                layer.appendChild(button);
            });
    }

    function editNote(noteId) {
        const note = state.annotations.notes.find((item) => item.id === noteId);
        if (!note) return;
        const nextText = window.prompt('Edit note. Leave empty to delete.', note.text);
        if (nextText === null) return;

        if (!nextText.trim()) {
            state.annotations.notes = state.annotations.notes.filter((item) => item.id !== noteId);
        } else {
            note.text = nextText.trim();
        }

        saveAnnotations();
        renderNotes(note.page);
        renderNotesList();
    }

    function renderNotesList() {
        if (!state.annotations.notes.length) {
            els.notesList.innerHTML = '<p class="sidebar-empty">No notes yet.</p>';
            return;
        }

        els.notesList.innerHTML = state.annotations.notes.map((note) => `
            <button type="button" data-page="${note.page}">
                <span>Page ${note.page}</span>
                <small>${escapeHtml(note.text)}</small>
            </button>
        `).join('');
    }

    function toggleDrawMode() {
        if (READ_ONLY_MODE) {
            setReaderStatus('Read mode is active.');
            return;
        }
        state.drawMode = !state.drawMode;
        if (state.drawMode) {
            state.noteMode = false;
            els.noteMode.classList.remove('active');
        }
        els.drawMode.classList.toggle('active', state.drawMode);
        els.readerShell.classList.toggle('draw-active', state.drawMode);
        setReaderStatus(state.drawMode ? 'Pen tool active.' : 'Pen tool closed.');
    }

    function startDrawing(event) {
        if (!state.drawMode || !event.target.classList.contains('pdf-draw-layer')) return;
        event.preventDefault();
        const canvas = event.target;
        const pageNumber = Number(canvas.closest('.pdf-page-shell').dataset.page);
        const context = canvas.getContext('2d');
        const point = canvasPoint(event, canvas);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = COLOR_MAP[state.highlightColor].replace(/0\.\d+\)/, '0.95)');
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(point.x, point.y);
        canvas.setPointerCapture(event.pointerId);
        state.drawing = { canvas, context, pageNumber };
    }

    function continueDrawing(event) {
        if (!state.drawing) return;
        event.preventDefault();
        const point = canvasPoint(event, state.drawing.canvas);
        state.drawing.context.lineTo(point.x, point.y);
        state.drawing.context.stroke();
    }

    function stopDrawing() {
        if (!state.drawing || !state.currentBook) return;
        state.annotations.drawings[state.drawing.pageNumber] = state.drawing.canvas.toDataURL('image/png');
        saveAnnotations();
        state.drawing = null;
        setReaderStatus('Drawing saved.');
    }

    function clearCurrentDrawing() {
        const shell = getPageShell(state.currentPage);
        if (!shell || !state.currentBook) return;
        const canvas = shell.querySelector('.pdf-draw-layer');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        delete state.annotations.drawings[state.currentPage];
        saveAnnotations();
        setReaderStatus('Drawing cleared for this page.');
    }

    function restoreDrawing(pageNumber, canvas) {
        const dataUrl = state.annotations.drawings[pageNumber];
        if (!dataUrl) return;
        const image = new Image();
        image.onload = () => {
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
        };
        image.src = dataUrl;
    }

    async function speakCurrentPage() {
        if (!state.pdfDoc || !window.speechSynthesis) return;
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            els.ttsButton.classList.remove('active');
            return;
        }

        const text = await getPageText(state.currentPage);
        if (!text.trim()) return;
        state.ttsUtterance = new SpeechSynthesisUtterance(text);
        state.ttsUtterance.onend = () => els.ttsButton.classList.remove('active');
        els.ttsButton.classList.add('active');
        window.speechSynthesis.speak(state.ttsUtterance);
    }

    function loadAnnotations(bookId) {
        try {
            const stored = window.localStorage.getItem(STORAGE_PREFIX + bookId);
            if (!stored) return { highlights: [], notes: [], drawings: {} };
            const parsed = JSON.parse(stored);
            return {
                highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
                notes: Array.isArray(parsed.notes) ? parsed.notes : [],
                drawings: parsed.drawings && typeof parsed.drawings === 'object' ? parsed.drawings : {}
            };
        } catch (error) {
            return { highlights: [], notes: [], drawings: {} };
        }
    }

    function saveAnnotations() {
        if (!state.currentBook) return;
        try {
            window.localStorage.setItem(STORAGE_PREFIX + state.currentBook.id, JSON.stringify(state.annotations));
        } catch (error) {
            setReaderStatus('Storage is full, so the latest annotation could not be saved.');
        }
    }

    function showSidebarPanel(panel) {
        els.sidebarTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.panel === panel));
        document.querySelectorAll('.sidebar-panel').forEach((item) => item.classList.remove('active'));
        document.getElementById(panel === 'thumbnails' ? 'thumbnailStrip' : panel === 'outline' ? 'outlineList' : 'notesList').classList.add('active');
    }

    function setReaderStatus(message) {
        els.readerStatus.textContent = message;
    }

    function getPageShell(pageNumber) {
        return document.getElementById(`pdf-page-${pageNumber}`);
    }

    function pageShellFromPoint(x, y) {
        return document.elementsFromPoint(x, y)
            .map((element) => element.closest ? element.closest('.pdf-page-shell') : null)
            .find(Boolean);
    }

    function canvasPoint(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function bookInitials(title) {
        return title
            .replace(/book\s+\d+/i, '')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 3)
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    }

    function countOccurrences(text, query) {
        if (!query) return 0;
        let count = 0;
        let position = text.indexOf(query);
        while (position !== -1) {
            count += 1;
            position = text.indexOf(query, position + query.length);
        }
        return count;
    }

    function debounce(callback, delay) {
        let timeoutId;
        return function debounced() {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(callback, delay);
        };
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function makeId() {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, '&#096;');
    }

    function cssEscape(value) {
        if (window.CSS && window.CSS.escape) {
            return window.CSS.escape(value);
        }
        return String(value).replace(/"/g, '\\"');
    }
})();
