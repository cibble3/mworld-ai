// sidebar-fix.js
// Script to ensure sidebar is visible on desktop screens
(function() {
  function fixSidebar() {
    console.log('Sidebar fix script running');
    
    // Try to find the sidebar - first check class-based implementation
    const desktopSidebar = document.querySelector('.desktop-sidebar');
    
    if (desktopSidebar) {
      console.log('Found desktop sidebar');
      
      // Only apply these styles on desktop screens
      if (window.innerWidth >= 1024) {
        // Make sure sidebar is visible
        desktopSidebar.style.display = 'block';
        
        // Ensure main content has proper margin
        const main = document.querySelector('main');
        if (main) {
          main.style.marginLeft = '16rem';
        }
      }
    } else {
      // Check for data-attribute implementation as fallback
      const oldSidebar = document.querySelector('[data-mw-module="sidebar"]');
      
      if (oldSidebar) {
        console.log('Found old sidebar implementation');
        
        if (window.innerWidth >= 1024) {
          oldSidebar.style.display = 'block';
          oldSidebar.style.visibility = 'visible';
          
          const main = document.querySelector('main');
          if (main) {
            main.style.marginLeft = '16rem';
          }
        }
      } else {
        console.log('No sidebar found - this may be a page without a sidebar');
      }
    }
  }
  
  // Run on load
  window.addEventListener('load', fixSidebar);
  
  // Also run after a short delay
  setTimeout(fixSidebar, 500);
})(); 