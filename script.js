document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#data-table tbody');
    const paginationContainer = document.querySelector('#pagination');
    const searchBar = document.querySelector('#search-bar');
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
  
    const itemsPerPage = 10;
    let currentPage = 1;
    let data = [];
    const itemDataArray = [];
    let searchQuery = '';
  
    fetch('http://universities.hipolabs.com/search?country=United+States')
      .then(response => response.json())
      .then(responseData => {
        data = responseData;
        sortDataByName();
        renderTable();
        renderPagination();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    function sortDataByName() {
      data.sort((a, b) => a.name.localeCompare(b.name));
      data.forEach(item => {
        const itemData = {
          Country: item.country,
          Code: item.alpha_two_code,
          Name: item.name,
          StateProvince: item.state_province ? 'Yes' : 'No',
          Domains: item.domains,
          WebPages: item.web_pages
        };
        itemDataArray.push(itemData);
      });
    }
  
    function renderTable() {
      tableBody.innerHTML = '';
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
  
      let itemsToDisplay = itemDataArray;
  
      if (searchQuery) {
        itemsToDisplay = itemsToDisplay.filter(item => {
          const name = item.Name.toLowerCase();
          return name.includes(searchQuery.toLowerCase());
        });
      }
  
      itemsToDisplay = itemsToDisplay.slice(startIndex, endIndex);
  
      itemsToDisplay.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.Country}</td>
          <td>${item.Code}</td>
          <td>${item.Name}</td>
          <td>${item.StateProvince}</td>
          <td>${item.Domains}</td>
          <td>${item.WebPages ? `<a href="${item.WebPages}" target="_blank">Web_Sites</a>` : ''}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    function renderPagination() {
      paginationContainer.innerHTML = '';
  
      const totalPages = Math.ceil(itemDataArray.length / itemsPerPage);
      const maxDisplayedPages = 5; // Number of pages to display at a time
      const halfDisplayedPages = Math.floor(maxDisplayedPages / 2);
  
      let startPage = currentPage - halfDisplayedPages;
      let endPage = currentPage + halfDisplayedPages;
  
      if (startPage <= 0) {
        startPage = 1;
        endPage = Math.min(maxDisplayedPages, totalPages);
      }
  
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxDisplayedPages + 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
  
        if (i === currentPage) {
          pageLink.classList.add('active');
        }
  
        pageLink.addEventListener('click', function(event) {
          event.preventDefault();
          currentPage = i;
          renderTable();
          renderPagination();
        });
  
        paginationContainer.appendChild(pageLink);
      }
  
      if (currentPage > halfDisplayedPages + 1) {
        const previousEllipsis = document.createElement('span');
        previousEllipsis.textContent = '...';
        paginationContainer.insertBefore(previousEllipsis, paginationContainer.firstChild);
      }
  
      if (currentPage < totalPages - halfDisplayedPages) {
        const nextEllipsis = document.createElement('span');
        nextEllipsis.textContent = '...';
        paginationContainer.appendChild(nextEllipsis);
      }
    }
  
    function performSearch() {
      searchQuery = searchInput.value.trim();
      currentPage = 1;
      renderTable();
      renderPagination();
    }
  
    searchButton.addEventListener('click', performSearch);
    searchBar.addEventListener('submit', function(event) {
      event.preventDefault();
      performSearch();
    });
  });