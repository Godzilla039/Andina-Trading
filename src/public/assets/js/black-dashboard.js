/*!

=========================================================
* Black Dashboard - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)


* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

var transparent = true;
var transparentDemo = true;
var fixedTop = false;

var navbar_initialized = false;
var backgroundOrange = false;
var sidebar_mini_active = false;
var toggle_initialized = false;

var $html = $('html');
var $body = $('body');
var $navbar_minimize_fixed = $('.navbar-minimize-fixed');
var $collapse = $('.collapse');
var $navbar = $('.navbar');
var $tagsinput = $('.tagsinput');
var $selectpicker = $('.selectpicker');
var $navbar_color = $('.navbar[color-on-scroll]');
var $full_screen_map = $('.full-screen-map');
var $datetimepicker = $('.datetimepicker');
var $datepicker = $('.datepicker');
var $timepicker = $('.timepicker');

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;

(function() {
  var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    if ($('.main-panel').length != 0) {
      var ps = new PerfectScrollbar('.main-panel', {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
        suppressScrollX: true
      });
    }

    if ($('.sidebar .sidebar-wrapper').length != 0) {

      var ps1 = new PerfectScrollbar('.sidebar .sidebar-wrapper');
      $('.table-responsive').each(function() {
        var ps2 = new PerfectScrollbar($(this)[0]);
      });
    }



    $html.addClass('perfect-scrollbar-on');
  } else {
    $html.addClass('perfect-scrollbar-off');
  }
})();

$(document).ready(function() {

  var scroll_start = 0;
  var startchange = $('.row');
  var offset = startchange.offset();
  var scrollElement = navigator.platform.indexOf('Win') > -1 ? $(".ps") : $(window);
  scrollElement.scroll(function() {

    scroll_start = $(this).scrollTop();

    if (scroll_start > 50) {
      $(".navbar-minimize-fixed").css('opacity', '1');
    } else {
      $(".navbar-minimize-fixed").css('opacity', '0');
    }
  });


  $(document).scroll(function() {
    scroll_start = $(this).scrollTop();
    if (scroll_start > offset.top) {
      $(".navbar-minimize-fixed").css('opacity', '1');
    } else {
      $(".navbar-minimize-fixed").css('opacity', '0');
    }
  });

  if ($('.full-screen-map').length == 0 && $('.bd-docs').length == 0) {
    // On click navbar-collapse the menu will be white not transparent
    $('.collapse').on('show.bs.collapse', function() {
      $(this).closest('.navbar').removeClass('navbar-transparent').addClass('bg-white');
    }).on('hide.bs.collapse', function() {
      $(this).closest('.navbar').addClass('navbar-transparent').removeClass('bg-white');
    });
  }

  blackDashboard.initMinimizeSidebar();

  $navbar = $('.navbar[color-on-scroll]');
  scroll_distance = $navbar.attr('color-on-scroll') || 500;

  // Check if we have the class "navbar-color-on-scroll" then add the function to remove the class "navbar-transparent" so it will transform to a plain color.
  if ($('.navbar[color-on-scroll]').length != 0) {
    blackDashboard.checkScrollForTransparentNavbar();
    $(window).on('scroll', blackDashboard.checkScrollForTransparentNavbar)
  }

  $('.form-control').on("focus", function() {
    $(this).parent('.input-group').addClass("input-group-focus");
  }).on("blur", function() {
    $(this).parent(".input-group").removeClass("input-group-focus");
  });

  // Activate bootstrapSwitch
  $('.bootstrap-switch').each(function() {
    $this = $(this);
    data_on_label = $this.data('on-label') || '';
    data_off_label = $this.data('off-label') || '';

    $this.bootstrapSwitch({
      onText: data_on_label,
      offText: data_off_label
    });
  });
});

$(document).on('click', '.navbar-toggle', function() {
  var $toggle = $(this);

  if (blackDashboard.misc.navbar_menu_visible == 1) {
    $html.removeClass('nav-open');
    blackDashboard.misc.navbar_menu_visible = 0;
    setTimeout(function() {
      $toggle.removeClass('toggled');
      $('.bodyClick').remove();
    }, 550);

  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 580);

    var div = '<div class="bodyClick"></div>';
    $(div).appendTo('body').click(function() {
      $html.removeClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('.bodyClick').remove();
      }, 550);
    });

    $html.addClass('nav-open');
    blackDashboard.misc.navbar_menu_visible = 1;
  }
});

$(window).resize(function() {
  // reset the seq for charts drawing animations
  seq = seq2 = 0;

  if ($full_screen_map.length == 0 && $('.bd-docs').length == 0) {
    var isExpanded = $navbar.find('[data-toggle="collapse"]').attr("aria-expanded");
    if ($navbar.hasClass('bg-white') && $(window).width() > 991) {
      $navbar.removeClass('bg-white').addClass('navbar-transparent');
    } else if ($navbar.hasClass('navbar-transparent') && $(window).width() < 991 && isExpanded != "false") {
      $navbar.addClass('bg-white').removeClass('navbar-transparent');
    }
  }
});

blackDashboard = {
  misc: {
    navbar_menu_visible: 0
  },

  initMinimizeSidebar: function() {
    if ($('.sidebar-mini').length != 0) {
      sidebar_mini_active = true;
    }

    $('#minimizeSidebar').click(function() {
      var $btn = $(this);

      if (sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        sidebar_mini_active = false;
        blackDashboard.showSidebarMessage('Sidebar mini deactivated...');
      } else {
        $('body').addClass('sidebar-mini');
        sidebar_mini_active = true;
        blackDashboard.showSidebarMessage('Sidebar mini activated...');
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function() {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  },

  showSidebarMessage: function(message) {
    try {
      $.notify({
        icon: "tim-icons ui-1_bell-53",
        message: message
      }, {
        type: 'info',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'right'
        }
      });
    } catch (e) {
      console.log('Notify library is missing, please make sure you have the notifications library added.');
    }

  }

};

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

document.addEventListener('DOMContentLoaded', function () {

    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.sidebar .ath-nav-item');

    navItems.forEach(item => {
      const link = item.querySelector('a');
      const title = link?.querySelector('p')?.innerText;

      if (link && link.getAttribute('href') === currentPath) {
        item.classList.add('active');

        // Actualizar el título del navbar
        const navbarTitle = document.getElementById('navbar-title');
        if (navbarTitle && title) {
          navbarTitle.textContent = title;
        }

      } else {
        item.classList.remove('active');
      }
    });
});

// public/js/theme.js
document.addEventListener('DOMContentLoaded', function () {
  const switchButton = document.getElementById('darkModeSwitch');
  const body = document.body;

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('white-content');
      if (switchButton) switchButton.checked = true;
    } else {
      body.classList.remove('white-content');
      if (switchButton) switchButton.checked = false;
    }

    // Emitir evento personalizado
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (switchButton) {
    switchButton.addEventListener('click', function () {
      const isLight = body.classList.contains('white-content');
      const newTheme = isLight ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

  window.getCurrentTheme = () => localStorage.getItem('theme') || 'dark';
});

/* ARÉA DEL PORTAFOLIO DE VENTAS TRADE */

window.jspdf = window.jspdf;

let myPortfolio = [];
let transactionHistory = [];
let totalInvestedAmount = 0;

document.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Si es la pestaña de comprar, cargar acciones si no están cargadas
            if (tabId === 'buy' && allStocks.length === 0) {
                fetchStocksFromTwelveData();
            }
        });
    });

    // Configuración de stocks
    const API_URL = 'https://api.twelvedata.com/stocks?source=docs&exchange=NASDAQ';
    let currentPage = 1;
    const stocksPerPage = 10;
    let allStocks = [];
    let filteredStocks = [];

    // Elementos del DOM
    const stocksTableBody = document.getElementById('stocksTableBody');
    const loadingStocks = document.getElementById('loadingStocks');
    const searchBtn = document.getElementById('searchBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const stockSearch = document.getElementById('stockSearch');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const exportPdfBtn = document.getElementById('exportPdfBtn');

    // Modal
    const buyModal = document.getElementById('buyModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBuy = document.getElementById('cancelBuy');
    const confirmBuy = document.getElementById('confirmBuy');
    const sharesAmount = document.getElementById('sharesAmount');
    const orderType = document.getElementById('orderType');
    const limitPriceGroup = document.getElementById('limitPriceGroup');
    const limitPrice = document.getElementById('limitPrice');
    const estimatedTotal = document.getElementById('estimatedTotal');
    const modalStockInfo = document.getElementById('modalStockInfo');
    let currentStock = null;

    // Listeners
    searchBtn.addEventListener('click', searchStocks);
    refreshBtn.addEventListener('click', fetchStocksFromTwelveData);
    stockSearch.addEventListener('keyup', e => {
        if (e.key === 'Enter') searchStocks();
    });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderStocks();
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage * stocksPerPage < filteredStocks.length) {
            currentPage++;
            renderStocks();
        }
    });

    orderType.addEventListener('change', (e) => {
        limitPriceGroup.style.display = e.target.value === 'limit' ? 'block' : 'none';
        updateEstimatedTotal();
    });

    sharesAmount.addEventListener('input', updateEstimatedTotal);
    limitPrice.addEventListener('input', updateEstimatedTotal);

    closeModal.addEventListener('click', () => buyModal.style.display = 'none');
    cancelBuy.addEventListener('click', () => buyModal.style.display = 'none');

     exportPdfBtn.addEventListener('click', exportToPDF);

function exportToPDF() {
    if (transactionHistory.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = new Date();
    
    // Configuración del documento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Reporte de Transacciones', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generado el: ${now.toLocaleDateString()} a las ${now.toLocaleTimeString()}`, 105, 30, { align: 'center' });
    
    // Datos de la tabla
    const headers = [["Acción", "Cantidad", "Tipo", "Precio Compra", "Precio Venta", "Ganancia/Pérdida", "Fecha"]];
    const data = transactionHistory.map(trans => [
        trans.symbol,
        trans.quantity,
        trans.type,
        trans.type === 'Compra' ? `$${trans.price.toFixed(2)}` : '-',
        trans.type === 'Venta' ? `$${trans.price.toFixed(2)}` : '-',
        trans.type === 'Venta' ? `${trans.profit >= 0 ? '+' : ''}$${Math.abs(trans.profit).toFixed(2)} (${trans.profitPercent}%)` : '-',
        trans.date
    ]);
    
    // Generar tabla
    doc.autoTable({
        head: headers,
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Nombre del archivo
    const filename = `Reporte_${now.toISOString().slice(0,10)}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.pdf`;
    doc.save(filename);
}

// Función para actualizar el resumen
function updatePortfolioSummary() {
    const totalValue = myPortfolio.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
    const totalInvestment = myPortfolio.reduce((sum, stock) => sum + (stock.buyPrice * stock.quantity), 0);
    const totalProfit = totalValue - totalInvestment;
    const profitPercentage = (totalProfit / totalInvestment * 100).toFixed(1);
    
    document.querySelector('.portfolio-summary .summary-item:nth-child(1) p').textContent = `$${totalValue.toFixed(2)}`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(2) p').textContent = 
        `${totalProfit >= 0 ? '+' : ''}$${Math.abs(totalProfit).toFixed(2)} (${profitPercentage}%)`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(3) p').textContent = `$${totalInvestment.toFixed(2)}`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(4) p').textContent = myPortfolio.length;
}

    // Modifica la función confirmBuy para agregar al portafolio
    confirmBuy.addEventListener('click', () => {
    if (currentStock) {
        const amount = parseInt(sharesAmount.value);
        const price = orderType.value === 'limit' ? parseFloat(limitPrice.value) : currentStock.price;
        const now = new Date();
        const totalCost = amount * price;
        totalInvestedAmount += totalCost;
        
        // Formatear fecha y hora
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        
        // Buscar si ya existe en el portafolio
        const existingStock = myPortfolio.find(stock => stock.symbol === currentStock.symbol);
        
        if (existingStock) {
            // Actualizar cantidad y precio promedio si ya existe
            const totalQuantity = existingStock.quantity + amount;
            existingStock.buyPrice = ((existingStock.buyPrice * existingStock.quantity) + (price * amount)) / totalQuantity;
            existingStock.quantity = totalQuantity;
        } else {
            // Agregar nueva acción al portafolio
            myPortfolio.push({
                symbol: currentStock.symbol,
                name: currentStock.name,
                quantity: amount,
                buyPrice: price,
                currentPrice: price
            });
        }
        
        // Agregar al historial de transacciones
        transactionHistory.push({
            symbol: currentStock.symbol,
            name: currentStock.name,
            quantity: amount,
            type: 'Compra',
            price: price,
            date: `${formattedDate} ${formattedTime}`
        });
        
        // Mostrar confirmación
        alert(`Orden de compra realizada: ${amount} acciones de ${currentStock.symbol} a $${price.toFixed(2)} cada una. Total: $${(amount * price).toFixed(2)}`);
        
        // Actualizar las tablas y cerrar modal
        renderPortfolio();
        renderTransactionHistory();
        buyModal.style.display = 'none';
    }
    });

    function updateEstimatedTotal() {
        const amount = parseInt(sharesAmount.value);
        const price = orderType.value === 'limit' ? parseFloat(limitPrice.value) : (currentStock?.price || 0);
        if (!isNaN(amount) && !isNaN(price)) {
            estimatedTotal.textContent = '$' + (amount * price).toFixed(2);
        } else {
            estimatedTotal.textContent = '$0.00';
        }
    }

    function renderStocks() {
        stocksTableBody.innerHTML = '';
        if (filteredStocks.length === 0) {
            stocksTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No se encontraron acciones que coincidan con la búsqueda.</td></tr>';
            return;
        }

        const start = (currentPage - 1) * stocksPerPage;
        const end = start + stocksPerPage;
        const stocksToShow = filteredStocks.slice(start, end);

        stocksToShow.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </td>
                <td>$${stock.price.toFixed(2)}</td>
                <td class="${stock.change > 0 ? 'positive' : 'negative'}">
                    ${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent})
                </td>
                <td>${stock.marketCap}</td>
                <td>${stock.volume}</td>
                <td><button class="buy-btn" data-symbol="${stock.symbol}" data-price="${stock.price}">Comprar</button></td>
            `;
            row.querySelector('.buy-btn').addEventListener('click', () => {
                currentStock = stock;
                modalStockInfo.textContent = `${stock.symbol} - ${stock.name} ($${stock.price.toFixed(2)})`;
                sharesAmount.value = 1;
                orderType.value = 'market';
                limitPrice.value = '';
                limitPriceGroup.style.display = 'none';
                updateEstimatedTotal();
                buyModal.style.display = 'block';
            });
            stocksTableBody.appendChild(row);
        });

        // Actualizar info de página
        const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        
        // Habilitar/deshabilitar botones de paginación
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage >= totalPages;
    }

    function searchStocks() {
        const searchTerm = stockSearch.value.toLowerCase();
        if (searchTerm.trim() === '') {
            filteredStocks = [...allStocks];
        } else {
            filteredStocks = allStocks.filter(stock => 
                stock.symbol.toLowerCase().includes(searchTerm) || 
                stock.name.toLowerCase().includes(searchTerm)
            );
        }
        currentPage = 1;
        renderStocks();
    }

    async function fetchStocksFromTwelveData() {
        loadingStocks.style.display = 'block';
        stocksTableBody.innerHTML = '';
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los datos');
            
            const data = await response.json();
            
            // Procesar los datos de la API
            allStocks = data.data.map(stock => ({
                symbol: stock.symbol,
                name: stock.name,
                price: Math.random() * 500 + 10, // Precio aleatorio ya que la API no lo proporciona
                change: (Math.random() * 20 - 10), // Cambio aleatorio (-10 a +10)
                changePercent: (Math.random() * 10).toFixed(2) + '%', // % cambio aleatorio
                volume: Math.floor(Math.random() * 10000000).toLocaleString(), // Volumen aleatorio
                marketCap: '$' + (Math.random() * 200 + 50).toFixed(2) + 'B', // Capitalización aleatoria
                isGainer: Math.random() > 0.5 // Aleatorio si es ganadora o perdedora
            }));
            
            filteredStocks = [...allStocks];
            currentPage = 1;
            renderStocks();
            
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            stocksTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar los datos. Intente nuevamente.</td></tr>';
        } finally {
            loadingStocks.style.display = 'none';
        }
    }
function renderPortfolio() {
    const portfolioTable = document.querySelector('#owned tbody');
    portfolioTable.innerHTML = '';
    
    myPortfolio.forEach((stock, index) => {
        const profit = (stock.currentPrice - stock.buyPrice) * stock.quantity;
        const profitPercent = (profit / (stock.buyPrice * stock.quantity) * 100).toFixed(1);
        const totalValue = (stock.currentPrice * stock.quantity).toFixed(2);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="stock-symbol">${stock.symbol}</div>
                <div class="stock-name">${stock.name}</div>
            </td>
            <td>${stock.quantity}</td>
            <td>$${stock.buyPrice.toFixed(2)}</td>
            <td>$${stock.currentPrice.toFixed(2)}</td>
            <td class="${profit >= 0 ? 'positive' : 'negative'}">
                ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent}%)
            </td>
            <td>$${totalValue}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn sell-btn" data-index="${index}">Vender</button>
                </div>
            </td>
        `;
        
        // Agregar event listener al botón de vender
        const sellBtn = row.querySelector('.sell-btn');
        sellBtn.addEventListener('click', () => {
            const stockToSell = myPortfolio[index];
            sellStock(stockToSell, index);
        });
        
        portfolioTable.appendChild(row);
    });
    
    updatePortfolioSummary();
}

// Función para actualizar el resumen
function updatePortfolioSummary() {
    const totalValue = myPortfolio.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
    const currentInvestment = myPortfolio.reduce((sum, stock) => sum + (stock.buyPrice * stock.quantity), 0);
    const totalProfit = totalValue - currentInvestment;
    const profitPercentage = totalInvestedAmount > 0 ? (totalProfit / totalInvestedAmount * 100).toFixed(1) : "0.0";
    
    document.querySelector('.portfolio-summary .summary-item:nth-child(1) p').textContent = `$${totalValue.toFixed(2)}`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(2) p').textContent = 
        `${totalProfit >= 0 ? '+' : ''}$${Math.abs(totalProfit).toFixed(2)} (${profitPercentage}%)`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(3) p').textContent = `$${totalInvestedAmount.toFixed(2)}`;
    document.querySelector('.portfolio-summary .summary-item:nth-child(4) p').textContent = myPortfolio.length;
}

    // Función para renderizar el historial de transacciones
function renderTransactionHistory() {
    const historyTable = document.querySelector('#sold tbody');
    historyTable.innerHTML = '';
    
    transactionHistory.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="stock-symbol">${transaction.symbol}</div>
                <div class="stock-name">${transaction.name}</div>
            </td>
            <td>${transaction.quantity}</td>
            <td>${transaction.type}</td>
            <td>${transaction.type === 'Compra' ? `$${transaction.price.toFixed(2)}` : '-'}</td>
            <td>${transaction.type === 'Venta' ? `$${transaction.price.toFixed(2)}` : '-'}</td>
            <td>${transaction.type === 'Venta' ? 
                `<span class="${transaction.profit >= 0 ? 'positive' : 'negative'}">
                    ${transaction.profit >= 0 ? '+' : ''}$${Math.abs(transaction.profit).toFixed(2)} (${transaction.profitPercent}%)
                </span>` : '-'}
            </td>
            <td>${transaction.date}</td>
        `;
        historyTable.appendChild(row);
    });
}

// Función para manejar la venta de acciones
function sellStock(stock, index) {
    const sellQuantity = prompt(`¿Cuántas acciones de ${stock.symbol} deseas vender? (Disponibles: ${stock.quantity})`, stock.quantity);
    
    if (!sellQuantity || isNaN(sellQuantity)) { 
        return; 
    }
    
    const quantity = parseInt(sellQuantity);
    if (quantity <= 0 || quantity > stock.quantity) {
        alert('Cantidad inválida');
        return;
    }
    
    const confirmSale = confirm(`¿Estás seguro de vender ${quantity} acciones de ${stock.symbol} a $${stock.currentPrice.toFixed(2)} cada una? Total: $${(quantity * stock.currentPrice).toFixed(2)}`);
    
    if (confirmSale) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        
        // Calcular ganancia/pérdida
        const profit = (stock.currentPrice - stock.buyPrice) * quantity;
        const profitPercent = (profit / (stock.buyPrice * quantity) * 100).toFixed(1);
        
        // Registrar en el historial
        transactionHistory.push({
            symbol: stock.symbol,
            name: stock.name,
            quantity: quantity,
            type: 'Venta',
            price: stock.currentPrice,
            buyPrice: stock.buyPrice,
            profit: profit,
            profitPercent: profitPercent,
            date: `${formattedDate} ${formattedTime}`
        });
        
        // Actualizar el portafolio
        if (quantity === stock.quantity) {
            myPortfolio.splice(index, 1); // Eliminar si se venden todas
        } else {
            stock.quantity -= quantity; // Reducir cantidad
        }
        
        // Actualizar las tablas
        renderPortfolio();
        renderTransactionHistory();
        
        alert(`Venta realizada: ${quantity} acciones de ${stock.symbol} a $${stock.currentPrice.toFixed(2)} cada una. Total: $${(quantity * stock.currentPrice).toFixed(2)}`);
    }
}

renderTransactionHistory();
renderPortfolio();
});





