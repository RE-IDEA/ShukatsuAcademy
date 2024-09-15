document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 767) {
    const serviceItems = document.querySelectorAll('#web-tests .service-item');
    
    serviceItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // メインボタンがクリックされた場合は展開しない
        if (e.target.closest('.main-button')) return;
        
        this.classList.toggle('expanded');
        
        // 展開時のアニメーション
        if (this.classList.contains('expanded')) {
          const content = this.querySelector('.main-content p');
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          const content = this.querySelector('.main-content p');
          content.style.maxHeight = null;
        }
      });
    });
  }
});