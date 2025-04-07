// Timeline configuration - specific years we have data for
const timelineConfig = {
    years: [1800, 1820, 1840, 1860, 1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020],
    startYear: 1920, // Initial year to display
    yearSpacing: 300, // Vertical spacing between years in pixels
    centerOffset: 0   // Fine-tune the center positioning
};

// Initialize variables
let currentYearIndex = timelineConfig.years.indexOf(timelineConfig.startYear);
let isScrolling = false;
let scrollTimeout;
let lastScrollTime = 0;
let scrollDirection = 0; // 0 = no scroll, 1 = down, -1 = up

// Setup tab navigation
const tabs = document.querySelectorAll('.tab');
const contentSections = document.querySelectorAll('.content-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and content sections
        tabs.forEach(t => t.classList.remove('active'));
        contentSections.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        document.getElementById(`${tabName}-content`).classList.add('active');
    });
});

// Generate timeline with year markers
function generateTimeline() {
    const timelineYears = document.getElementById('timeline-years');
    
    // Clear any existing markers
    timelineYears.innerHTML = '';
    
    // Add all year markers at their spaced positions
    timelineConfig.years.forEach((year, index) => {
        const marker = document.createElement('div');
        
        // Determine if this is the current year
        const isCurrentYear = index === currentYearIndex;
        
        marker.className = `year-marker ${isCurrentYear ? 'black' : 'gray'}`;
        marker.setAttribute('data-year', year);
        marker.setAttribute('data-index', index);
        marker.textContent = year;
        
        // Position based on index
        const position = index * timelineConfig.yearSpacing;
        marker.style.top = `${position}px`;
        
        timelineYears.appendChild(marker);
    });
    
    // Center the timeline on the current year
    centerTimelineOnCurrentYear();
}

// Center the timeline on the current year
function centerTimelineOnCurrentYear() {
    const currentYearPosition = currentYearIndex * timelineConfig.yearSpacing;
    const containerHeight = document.querySelector('.timeline-container').offsetHeight;
    const offset = (containerHeight / 2) - currentYearPosition + timelineConfig.centerOffset;
    
    document.getElementById('timeline-years').style.transform = `translateY(${offset}px)`;
}

// Update which year is current (black) and update content
function updateCurrentYear(newIndex) {
    if (newIndex < 0 || newIndex >= timelineConfig.years.length) return;
    
    // Update markers
    const markers = document.querySelectorAll('.year-marker');
    markers.forEach(marker => {
        const index = parseInt(marker.getAttribute('data-index'));
        if (index === newIndex) {
            marker.className = 'year-marker black';
        } else {
            marker.className = 'year-marker gray';
        }
    });
    
    // Update current year
    currentYearIndex = newIndex;
    const currentYear = timelineConfig.years[currentYearIndex];
    document.getElementById('current-year-display').textContent = currentYear;
    
    // Center timeline on the new current year
    centerTimelineOnCurrentYear();
    
    // Update content for the current year
    updateContent(currentYear);
}

// Update content based on year
function updateContent(year) {
    console.log(`Updating content for year: ${year}`);
    
    // Update gender history content
    document.getElementById('gender-content').innerHTML = 
        `Gender History content for ${year}`;
    
    // Update fragrance history content
    document.getElementById('fragrance-content').innerHTML = 
        `Fragrance History content for ${year}`;
}


// Handle mouse wheel scrolling
function handleWheel(event) {
    // Prevent default scroll
    event.preventDefault();
    
    // Debounce scrolling
    const now = Date.now();
    if (now - lastScrollTime < 800) return;
    lastScrollTime = now;
    
    // Determine scroll direction
    const delta = event.deltaY;
    scrollDirection = delta > 0 ? 1 : -1;
    
    // Move to next or previous year
    if (scrollDirection === 1) {
        // Scrolling down - move to next year
        if (currentYearIndex < timelineConfig.years.length - 1) {
            updateCurrentYear(currentYearIndex + 1);
        }
    } else {
        // Scrolling up - move to previous year
        if (currentYearIndex > 0) {
            updateCurrentYear(currentYearIndex - 1);
        }
    }
}

// Handle keyboard navigation
function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        // Move to next year
        if (currentYearIndex < timelineConfig.years.length - 1) {
            updateCurrentYear(currentYearIndex + 1);
        }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        // Move to previous year
        if (currentYearIndex > 0) {
            updateCurrentYear(currentYearIndex - 1);
        }
    }
}

// Initialize the page
function init() {
    generateTimeline();
    
    // Setup event listeners for scrolling
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    // Make timeline markers clickable
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('year-marker')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            updateCurrentYear(index);
        }
    });
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', init);