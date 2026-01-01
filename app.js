// Manga Reader Application
class MangaReader {
    constructor() {
        this.metadata = null;
        this.currentVolume = null;
        this.currentChapter = null;
        this.currentPage = 1;
        this.totalPages = 1;
        
        this.init();
    }
    
    async init() {
        await this.loadMetadata();
        this.setupEventListeners();
        this.showVolumeBrowser();
    }
    
    async loadMetadata() {
        try {
            const response = await fetch('manga/metadata/manga.json');
            this.metadata = await response.json();
        } catch (error) {
            console.error('Error loading metadata:', error);
            alert('Failed to load manga metadata. Please check the file path.');
        }
    }
    
    setupEventListeners() {
        // Volume browser
        document.getElementById('back-to-volumes').addEventListener('click', () => {
            this.showVolumeBrowser();
        });
        
        // Chapter browser
        document.getElementById('back-to-chapters').addEventListener('click', () => {
            this.showChapterBrowser(this.currentVolume);
        });
        
        // Reader navigation
        document.getElementById('prev-page').addEventListener('click', () => {
            this.previousPage();
        });
        document.getElementById('next-page').addEventListener('click', () => {
            this.nextPage();
        });
        document.getElementById('prev-page-bottom').addEventListener('click', () => {
            this.previousPage();
        });
        document.getElementById('next-page-bottom').addEventListener('click', () => {
            this.nextPage();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isReaderVisible()) {
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    this.previousPage();
                } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    e.preventDefault();
                    this.nextPage();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.showChapterBrowser(this.currentVolume);
                }
            }
        });
    }
    
    showVolumeBrowser() {
        document.getElementById('volume-browser').classList.remove('hidden');
        document.getElementById('chapter-browser').classList.add('hidden');
        document.getElementById('reader').classList.add('hidden');
        
        this.renderVolumes();
    }
    
    renderVolumes() {
        const volumesList = document.getElementById('volumes-list');
        volumesList.innerHTML = '';
        
        if (!this.metadata || !this.metadata.volumes) {
            volumesList.innerHTML = '<p>No volumes found.</p>';
            return;
        }
        
        this.metadata.volumes.forEach(volume => {
            const card = document.createElement('div');
            card.className = 'volume-card';
            card.innerHTML = `
                <h3>${volume.id.toUpperCase()}</h3>
                <p>${volume.chapters.length} chapters</p>
            `;
            card.addEventListener('click', () => {
                this.showChapterBrowser(volume);
            });
            volumesList.appendChild(card);
        });
    }
    
    showChapterBrowser(volume) {
        this.currentVolume = volume;
        document.getElementById('volume-browser').classList.add('hidden');
        document.getElementById('chapter-browser').classList.remove('hidden');
        document.getElementById('reader').classList.add('hidden');
        
        document.getElementById('current-volume-title').textContent = 
            `Volume ${volume.number}: ${volume.id.toUpperCase()}`;
        
        this.renderChapters(volume);
    }
    
    renderChapters(volume) {
        const chaptersList = document.getElementById('chapters-list');
        chaptersList.innerHTML = '';
        
        volume.chapters.forEach(chapter => {
            const card = document.createElement('div');
            card.className = 'chapter-card';
            card.innerHTML = `
                <h3>Chapter ${chapter.number}</h3>
                <p>${chapter.title}</p>
                <p style="margin-top: 10px; font-size: 0.85rem; color: #999;">
                    ${chapter.imageCount} pages
                </p>
            `;
            card.addEventListener('click', () => {
                this.showReader(volume, chapter);
            });
            chaptersList.appendChild(card);
        });
    }
    
    showReader(volume, chapter) {
        this.currentVolume = volume;
        this.currentChapter = chapter;
        this.currentPage = 1;
        this.totalPages = chapter.imageCount;
        
        document.getElementById('volume-browser').classList.add('hidden');
        document.getElementById('chapter-browser').classList.add('hidden');
        document.getElementById('reader').classList.remove('hidden');
        
        document.getElementById('reader-volume').textContent = 
            `Volume ${volume.number}`;
        document.getElementById('reader-chapter').textContent = 
            `Chapter ${chapter.number}: ${chapter.title}`;
        
        this.updatePageDisplay();
        this.loadPage();
    }
    
    loadPage() {
        const volumeId = this.currentVolume.id;
        const chapterId = this.currentChapter.id;
        const pageNum = this.currentPage.toString().padStart(3, '0');
        
        const img = document.getElementById('manga-image');
        
        // Try .jpg first, then .png
        const imagePathJpg = `manga/volumes/${volumeId}/${chapterId}/${pageNum}.jpg`;
        const imagePathPng = `manga/volumes/${volumeId}/${chapterId}/${pageNum}.png`;
        
        // Try JPG first
        const testImg = new Image();
        testImg.onload = () => {
            img.src = imagePathJpg;
        };
        testImg.onerror = () => {
            // If JPG fails, try PNG
            img.src = imagePathPng;
        };
        testImg.src = imagePathJpg;
        
        this.updatePageDisplay();
        this.updateNavigationButtons();
        
        // Scroll to top of image
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updatePageDisplay() {
        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = this.totalPages;
    }
    
    updateNavigationButtons() {
        const prevButtons = [
            document.getElementById('prev-page'),
            document.getElementById('prev-page-bottom')
        ];
        const nextButtons = [
            document.getElementById('next-page'),
            document.getElementById('next-page-bottom')
        ];
        
        prevButtons.forEach(btn => {
            btn.disabled = this.currentPage <= 1;
        });
        
        nextButtons.forEach(btn => {
            btn.disabled = this.currentPage >= this.totalPages;
        });
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadPage();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadPage();
        }
    }
    
    isReaderVisible() {
        return !document.getElementById('reader').classList.contains('hidden');
    }
}

// Initialize the reader when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MangaReader();
});

