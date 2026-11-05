
const chapters = Array.from(document.querySelectorAll(".chapter"));
const backgroundScenes = Array.from(document.querySelectorAll(".background-scene"));

const progressBar = document.getElementById("progressBar");
const previousButton = document.getElementById("previousChapter");
const nextButton = document.getElementById("nextChapter");
const chapterIndicator = document.getElementById("chapterIndicator");

let currentChapter = 0;

// Update reading progress
function updateProgress() {
    const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
        progressBar.style.width = "100%";
        return;
    }

    const scrollPercentage =
        (window.scrollY / scrollableHeight) * 100;

    progressBar.style.width = scrollPercentage + "%";
}

// Update chapter number and navigation buttons
function updateChapterNavigation(index) {
    currentChapter = index;

    const chapterNumber = String(index + 1).padStart(2, "0");
    const totalChapters = String(chapters.length).padStart(2, "0");

    chapterIndicator.textContent =
        `${chapterNumber} / ${totalChapters}`;

    previousButton.disabled = index === 0;
    nextButton.disabled = index === chapters.length - 1;
}

// Change background according to the current chapter
function updateBackground(chapter) {
    const section = chapter.closest(".story-section");

    if (!section) return;

    const sceneName = section.dataset.scene;

    backgroundScenes.forEach(scene => {
        if (scene.dataset.scene === sceneName) {
            scene.classList.add("active");
        } else {
            scene.classList.remove("active");
        }
    });
}

// Detect which chapter is currently in view
const chapterObserver = new IntersectionObserver((entries) => {
    const visibleChapters =
        entries.filter(entry => entry.isIntersecting);

    if (visibleChapters.length === 0) return;

    visibleChapters.sort((a, b) => {
        const centerA = Math.abs(
            a.boundingClientRect.top +
            a.boundingClientRect.height / 2 -
            window.innerHeight / 2
        );

        const centerB = Math.abs(
            b.boundingClientRect.top +
            b.boundingClientRect.height / 2 -
            window.innerHeight / 2
        );

        return centerA - centerB;
    });

    const activeChapter = visibleChapters[0].target;
    const chapterIndex = chapters.indexOf(activeChapter);

    if (chapterIndex !== -1) {
        updateChapterNavigation(chapterIndex);
        updateBackground(activeChapter);
    }

}, {
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0
});

// Observe all six chapters
chapters.forEach(chapter => {
    chapterObserver.observe(chapter);
});

// Navigate to a selected chapter
function goToChapter(index) {
    if (index < 0 || index >= chapters.length) return;

    chapters[index].scrollIntoView({
        behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",

        block: "start"
    });
}

// Previous and next buttons
previousButton.addEventListener("click", () => {
    goToChapter(currentChapter - 1);
});

nextButton.addEventListener("click", () => {
    goToChapter(currentChapter + 1);
});

// Reading progress
window.addEventListener("scroll", updateProgress, {
    passive: true
});

window.addEventListener("resize", updateProgress);

// Initial setup
updateProgress();
updateChapterNavigation(0);
