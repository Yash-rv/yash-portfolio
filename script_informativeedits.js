document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide header on scroll (mobile only)
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    
    function handleScroll() {
        // Apply auto-hide on all screen sizes (both mobile and desktop)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
        } else {
            // Scrolling up - show header
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    const videoItems = document.querySelectorAll('.video-item');
    const videos = document.querySelectorAll('.video-container video');
    let overlayTimeouts = {}; // Store timeout IDs for each video

    videoItems.forEach((videoItem, index) => {
        const video = videoItem.querySelector('video');
        const overlay = videoItem.querySelector('.video-overlay');
        const overlayText = videoItem.querySelector('.video-overlay p');
        
        // Add click event to the entire video item
        videoItem.addEventListener('click', (e) => {
            // Prevent event bubbling to avoid conflicts
            e.stopPropagation();
            
            // Clear any existing timeout for this video
            if (overlayTimeouts[index]) {
                clearTimeout(overlayTimeouts[index]);
                delete overlayTimeouts[index];
            }
            
            // Mute all other videos and reset their overlays
            videos.forEach((otherVideo, otherIndex) => {
                if (otherIndex !== index) {
                    otherVideo.muted = true;
                    const otherOverlay = videoItems[otherIndex].querySelector('.video-overlay');
                    const otherOverlayText = videoItems[otherIndex].querySelector('.video-overlay p');
                    
                    // Clear timeout for other videos
                    if (overlayTimeouts[otherIndex]) {
                        clearTimeout(overlayTimeouts[otherIndex]);
                        delete overlayTimeouts[otherIndex];
                    }
                    
                    // Reset overlay for muted videos (let CSS handle hover)
                    if (otherOverlay && otherOverlayText) {
                        otherOverlay.style.opacity = ''; // Remove inline style, let CSS handle it
                        otherOverlayText.textContent = 'Click to play with sound';
                    }
                }
            });

            // Toggle mute for the clicked video
            video.muted = !video.muted;
            
            // Update overlay text and visibility based on mute state
            if (overlay && overlayText) {
                if (video.muted) {
                    // For muted videos, remove inline opacity and let CSS handle hover
                    overlay.style.opacity = '';
                    overlayText.textContent = 'Click to play with sound';
                } else {
                    // For playing videos, show overlay temporarily
                    overlay.style.opacity = '1';
                    overlayText.textContent = 'Playing with sound - Click to mute';
                    
                    // Hide overlay after 1.5 seconds when playing with sound
                    overlayTimeouts[index] = setTimeout(() => {
                        overlay.style.opacity = '0';
                        delete overlayTimeouts[index];
                    }, 1500);
                }
            }
        });
        
        // Show overlay on hover when video is playing with sound
        videoItem.addEventListener('mouseenter', () => {
            if (!video.muted && overlay) {
                // Clear any existing timeout
                if (overlayTimeouts[index]) {
                    clearTimeout(overlayTimeouts[index]);
                    delete overlayTimeouts[index];
                }
                overlay.style.opacity = '1';
            }
        });
        
        // Hide overlay when mouse leaves (only if video is playing with sound)
        videoItem.addEventListener('mouseleave', () => {
            if (!video.muted && overlay) {
                overlayTimeouts[index] = setTimeout(() => {
                    overlay.style.opacity = '0';
                    delete overlayTimeouts[index];
                }, 1000); // Shorter delay when mouse leaves
            }
        });
        
        // Add cursor pointer to indicate clickable area
        videoItem.style.cursor = 'pointer';
    });
});
