// Category Filter Navigation Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const filtersContainer = document.getElementById('filters');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (filtersContainer && scrollLeftBtn && scrollRightBtn) {
        const scrollAmount = 200; // Amount to scroll in pixels
        
        // Scroll left functionality
        scrollLeftBtn.addEventListener('click', function() {
            filtersContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Scroll right functionality
        scrollRightBtn.addEventListener('click', function() {
            filtersContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update arrow visibility based on scroll position
        function updateArrowVisibility() {
            const maxScrollLeft = filtersContainer.scrollWidth - filtersContainer.clientWidth;
            
            // Hide/show left arrow
            if (filtersContainer.scrollLeft <= 0) {
                scrollLeftBtn.style.opacity = '0.4';
                scrollLeftBtn.style.cursor = 'default';
            } else {
                scrollLeftBtn.style.opacity = '1';
                scrollLeftBtn.style.cursor = 'pointer';
            }
            
            // Hide/show right arrow
            if (filtersContainer.scrollLeft >= maxScrollLeft) {
                scrollRightBtn.style.opacity = '0.4';
                scrollRightBtn.style.cursor = 'default';
            } else {
                scrollRightBtn.style.opacity = '1';
                scrollRightBtn.style.cursor = 'pointer';
            }
        }
        
        // Listen for scroll events to update arrow visibility
        filtersContainer.addEventListener('scroll', updateArrowVisibility);
        
        // Initial arrow visibility check
        updateArrowVisibility();
        
        // Update on window resize
        window.addEventListener('resize', function() {
            setTimeout(updateArrowVisibility, 100);
        });
    }
    
    // Add active state to selected filter
    const filterLinks = document.querySelectorAll('.filter-link');
    const currentUrl = window.location.href;
    
    filterLinks.forEach(link => {
        if (currentUrl.includes(link.getAttribute('href').split('?')[1])) {
            link.querySelector('.filter').classList.add('active-filter');
        }
    });
    
    // Tax toggle functionality (existing)
    const taxSwitch = document.getElementById('switchCheckDefault');
    const taxInfoElements = document.querySelectorAll('.tax-info');
    
    if (taxSwitch && taxInfoElements.length > 0) {
        taxSwitch.addEventListener('change', function() {
            taxInfoElements.forEach(element => {
                element.style.display = this.checked ? 'inline' : 'none';
            });
        });
    }
});

// Touch/swipe support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', function() {
        const filtersContainer = document.getElementById('filters');
        if (!filtersContainer) return;
        
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        
        filtersContainer.addEventListener('touchstart', function(e) {
            isDown = true;
            startX = e.touches[0].pageX - filtersContainer.offsetLeft;
            scrollLeft = filtersContainer.scrollLeft;
        });
        
        filtersContainer.addEventListener('touchmove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - filtersContainer.offsetLeft;
            const walk = (x - startX) * 2;
            filtersContainer.scrollLeft = scrollLeft - walk;
        });
        
        filtersContainer.addEventListener('touchend', function() {
            isDown = false;
        });
    });
}


(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

