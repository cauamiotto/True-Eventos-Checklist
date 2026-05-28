/*
 * script.js
 *
 * Este arquivo implementa a lógica do checklist de equipamentos. 
 * As categorias (tipos de evento) e itens são armazenados em localStorage 
 * para persistência. Cada item possui um status de "carregado" e "defeituoso". 
 * A interface permite adicionar/remover categorias e itens, além de marcar 
 * facilmente o status de cada equipamento.
 */

(function() {
  // Chave de armazenamento no localStorage
  const STORAGE_KEY = 'trueEventosData';

  /**
   * Carrega dados do localStorage ou cria dados padrão caso ainda não existam.
   * @returns {Object} dados com categorias e itens
   */
  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Erro ao analisar dados armazenados. Limpando armazenamento.', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Caso não existam dados, retornar estrutura padrão
    return getDefaultData();
  }

  /**
   * Retorna dados padrão baseados nos equipamentos fornecidos pelo usuário.
   */
  function getDefaultData() {
    return {
      categories: [
        {
          name: 'Painel de LED',
          items: [
            { name: 'Cases dos painéis de LED', loaded: false, defective: false },
            { name: 'Caixa com cabos do painel de LED', loaded: false, defective: false },
            { name: 'Estrutura metálica para pendurar o painel', loaded: false, defective: false },
            { name: 'Parafusadeira e parafusos', loaded: false, defective: false },
            { name: 'Tairaps (abraçadeiras plásticas)', loaded: false, defective: false }
          ]
        },
        {
          name: 'Som e Iluminação',
          items: [
            { name: '2 caixas de som', loaded: false, defective: false },
            { name: '2 subs', loaded: false, defective: false },
            { name: 'Tripés para caixas de som', loaded: false, defective: false },
            { name: 'Cabos XLR/DMX (mínimo 5 extras)', loaded: false, defective: false },
            { name: 'Extensões elétricas', loaded: false, defective: false },
            { name: 'Microfone', loaded: false, defective: false }
          ]
        },
        {
          name: 'Completo',
          items: [
            { name: 'Cases dos painéis de LED', loaded: false, defective: false },
            { name: 'Caixa com cabos do painel de LED', loaded: false, defective: false },
            { name: 'Estrutura metálica para pendurar o painel', loaded: false, defective: false },
            { name: 'Parafusadeira e parafusos', loaded: false, defective: false },
            { name: 'Tairaps (abraçadeiras plásticas)', loaded: false, defective: false },
            { name: 'Escada', loaded: false, defective: false },
            { name: '2 caixas de som', loaded: false, defective: false },
            { name: '2 subs', loaded: false, defective: false },
            { name: 'Tripés para caixas de som', loaded: false, defective: false },
            { name: 'Cabos XLR/DMX (mínimo 5 extras)', loaded: false, defective: false },
            { name: 'Extensões elétricas', loaded: false, defective: false },
            { name: 'Microfone', loaded: false, defective: false },
            { name: 'Mochila com computador', loaded: false, defective: false },
            { name: 'Panos para cobrir estrutura (1m)', loaded: false, defective: false },
            { name: 'Pano maior para mesa', loaded: false, defective: false },
            { name: 'Caixa de ferramentas', loaded: false, defective: false }
          ]
        },
        {
          name: 'Trote/Escola',
          items: [
            { name: 'Cases dos painéis de LED', loaded: false, defective: false },
            { name: 'Caixa com cabos do painel de LED', loaded: false, defective: false },
            { name: 'Estrutura metálica para pendurar o painel', loaded: false, defective: false },
            { name: 'Parafusadeira e parafusos', loaded: false, defective: false },
            { name: '2 caixas de som', loaded: false, defective: false },
            { name: 'Tripés para caixas de som', loaded: false, defective: false },
            { name: 'Cabos XLR/DMX (mínimo 5 extras)', loaded: false, defective: false },
            { name: 'Extensões elétricas', loaded: false, defective: false },
            { name: 'Microfone', loaded: false, defective: false },
            { name: 'Mochila com computador', loaded: false, defective: false }
          ]
        }
      ]
    };
  }

  /**
   * Salva os dados no localStorage
   * @param {Object} data dados a serem salvos
   */
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Estado atual
  let data = loadData();
  let currentCategoryIndex = 0;

  // Elementos do DOM
  const eventTypeSelect = document.getElementById('eventType');
  const addEventTypeBtn = document.getElementById('addEventTypeBtn');
  const itemsSection = document.getElementById('itemsSection');
  const currentEventTitle = document.getElementById('currentEventTitle');
  const itemsList = document.getElementById('itemsList');
  const newItemNameInput = document.getElementById('newItemName');
  const addItemBtn = document.getElementById('addItemBtn');
  const resetDataBtn = document.getElementById('resetDataBtn');

  // Instalação do PWA
  const installBanner = document.getElementById('installBanner');
  const installBannerBtn = document.getElementById('installBannerBtn');
  const closeBannerBtn = document.getElementById('closeBannerBtn');
  let deferredInstallPrompt = null;

  // Gerenciamento de categorias
  const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
  const categoriesModal = document.getElementById('categoriesModal');
  const categoriesListEl = document.getElementById('categoriesList');
  const newCategoryNameInput = document.getElementById('newCategoryName');
  const saveNewCategoryBtn = document.getElementById('saveNewCategoryBtn');
  const closeCategoriesModal = document.getElementById('closeCategoriesModal');

  // Personalização de tema
  const openThemeModalBtn = document.getElementById('openThemeModalBtn');
  const themeModal = document.getElementById('themeModal');
  const themeColorPicker = document.getElementById('themeColorPicker');
  const saveThemeBtn = document.getElementById('saveThemeBtn');
  const closeThemeModal = document.getElementById('closeThemeModal');
  const themeModeSelect = document.getElementById('themeModeSelect');

  /**
   * Aplica um tema claro ou escuro definindo o atributo data-theme na tag html
   * @param {string} mode 'light' ou 'dark'
   */
  function applyTheme(mode) {
    const rootEl = document.documentElement;
    if (mode === 'dark') {
      rootEl.setAttribute('data-theme', 'dark');
    } else {
      rootEl.setAttribute('data-theme', 'light');
    }
  }

  /**
   * Inicializa o modo de tema a partir do localStorage ou usa 'light' como padrão
   */
  function initTheme() {
    const storedMode = localStorage.getItem('themeMode');
    const mode = storedMode || 'light';
    applyTheme(mode);
    // Definir valor do seletor se existir
    if (themeModeSelect) {
      themeModeSelect.value = mode;
    }
  }

  initTheme();

  /**
   * Converte um valor hexadecimal de cor para um objeto RGB.
   * @param {string} hex cor no formato #rrggbb
   */
  function hexToRgb(hex) {
    const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return parsed ? {
      r: parseInt(parsed[1], 16),
      g: parseInt(parsed[2], 16),
      b: parseInt(parsed[3], 16)
    } : null;
  }

  /**
   * Converte um objeto RGB de volta para string hexadecimal.
   * @param {{r:number,g:number,b:number}} rgb 
   */
  function rgbToHex(rgb) {
    return '#' + [rgb.r, rgb.g, rgb.b].map(v => {
      const hex = v.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Retorna uma cor mais clara que a fornecida.
   * @param {string} color cor base em hex (#rrggbb)
   * @param {number} factor fator de 0 a 1 para clarear (0.2 = 20%)
   */
  function lighten(color, factor) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    const newRgb = {
      r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor)),
      g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor)),
      b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor))
    };
    return rgbToHex(newRgb);
  }

  /**
   * Retorna uma cor mais escura que a fornecida.
   * @param {string} color cor base em hex (#rrggbb)
   * @param {number} factor fator de 0 a 1 para escurecer (0.15 = 15%)
   */
  function darken(color, factor) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    const newRgb = {
      r: Math.max(0, Math.round(rgb.r * (1 - factor))),
      g: Math.max(0, Math.round(rgb.g * (1 - factor))),
      b: Math.max(0, Math.round(rgb.b * (1 - factor)))
    };
    return rgbToHex(newRgb);
  }

  /**
   * Aplica uma cor de destaque aos CSS variables.
   * @param {string} color cor base escolhida
   */
  function applyAccentColor(color) {
    const root = document.documentElement;
    // Variáveis principais
    const primary = color;
    const primaryHover = darken(primary, 0.15);
    const secondary = lighten(primary, 0.2);
    const secondaryHover = primary;
    const tertiary = lighten(primary, 0.4);
    const tertiaryHover = lighten(primary, 0.6);
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--primary-hover', primaryHover);
    root.style.setProperty('--secondary', secondary);
    root.style.setProperty('--secondary-hover', secondaryHover);
    root.style.setProperty('--tertiary', tertiary);
    root.style.setProperty('--tertiary-hover', tertiaryHover);
  }

  /**
   * Carrega a cor de destaque do localStorage e aplica.
   */
  function initAccentColor() {
    const stored = localStorage.getItem('accentColor');
    if (stored) {
      applyAccentColor(stored);
    }
  }

  initAccentColor();

  /**
   * Popula o dropdown de tipos de evento com as categorias disponíveis
   */
  function populateEventTypes() {
    // Limpar opções existentes
    eventTypeSelect.innerHTML = '';
    data.categories.forEach((cat, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = cat.name;
      eventTypeSelect.appendChild(option);
    });
    // Se não houver categorias, ocultar a seção de itens
    if (data.categories.length === 0) {
      itemsSection.classList.add('hidden');
    } else {
      itemsSection.classList.remove('hidden');
    }
  }

  /**
   * Renderiza a lista de itens para a categoria atualmente selecionada
   */
  function renderItems() {
    itemsList.innerHTML = '';
    const category = data.categories[currentCategoryIndex];
    if (!category) return;
    currentEventTitle.textContent = category.name;
    category.items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      if (item.defective) card.classList.add('item-card-defective');
      // Nome
      const nameDiv = document.createElement('div');
      nameDiv.className = 'name';
      nameDiv.textContent = item.name;
      card.appendChild(nameDiv);
      // Grupo de status (carregado e defeituoso)
      const statusGroup = document.createElement('div');
      statusGroup.className = 'status-group';
      // Carregado checkbox
      const loadedLabel = document.createElement('label');
      const loadedCheckbox = document.createElement('input');
      loadedCheckbox.type = 'checkbox';
      loadedCheckbox.checked = item.loaded;
      loadedCheckbox.addEventListener('change', () => {
        item.loaded = loadedCheckbox.checked;
        saveData(data);
      });
      loadedLabel.appendChild(loadedCheckbox);
      loadedLabel.appendChild(document.createTextNode('Carregado'));
      statusGroup.appendChild(loadedLabel);
      // Defeituoso checkbox
      const defectiveLabel = document.createElement('label');
      const defectiveCheckbox = document.createElement('input');
      defectiveCheckbox.type = 'checkbox';
      defectiveCheckbox.checked = item.defective;
      defectiveCheckbox.addEventListener('change', () => {
        item.defective = defectiveCheckbox.checked;
        if (item.defective) card.classList.add('item-card-defective');
        else card.classList.remove('item-card-defective');
        saveData(data);
      });
      defectiveLabel.appendChild(defectiveCheckbox);
      defectiveLabel.appendChild(document.createTextNode('Defeito'));
      statusGroup.appendChild(defectiveLabel);
      card.appendChild(statusGroup);
      // Ações
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';
      // Editar botão
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-secondary';
      editBtn.textContent = 'Editar';
      editBtn.addEventListener('click', () => {
        const newName = prompt('Editar nome do item:', item.name);
        if (newName && newName.trim()) {
          item.name = newName.trim();
          saveData(data);
          renderItems();
        }
      });
      actionsDiv.appendChild(editBtn);
      // Remover botão
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Remover';
      deleteBtn.className = 'btn-danger';
      deleteBtn.addEventListener('click', () => {
        // confirmação simplificada
        category.items.splice(idx, 1);
        saveData(data);
        renderItems();
      });
      actionsDiv.appendChild(deleteBtn);
      card.appendChild(actionsDiv);
      itemsList.appendChild(card);
    });
  }

  /**
   * Manipula mudança de categoria selecionada
   */
  eventTypeSelect.addEventListener('change', () => {
    currentCategoryIndex = parseInt(eventTypeSelect.value, 10);
    renderItems();
  });

  /**
   * Adiciona um novo tipo de evento (categoria)
   */
  addEventTypeBtn.addEventListener('click', () => {
    const name = prompt('Nome do novo tipo de evento:');
    if (name) {
      data.categories.push({ name: name.trim(), items: [] });
      saveData(data);
      populateEventTypes();
      // Selecionar a nova categoria
      currentCategoryIndex = data.categories.length - 1;
      eventTypeSelect.value = currentCategoryIndex;
      renderItems();
    }
  });

  /**
   * Adiciona um novo item à categoria atual
   */
  addItemBtn.addEventListener('click', () => {
    const itemName = newItemNameInput.value.trim();
    if (!itemName) return;
    const category = data.categories[currentCategoryIndex];
    if (!category) return;
    category.items.push({ name: itemName, loaded: false, defective: false });
    newItemNameInput.value = '';
    saveData(data);
    renderItems();
  });

  // Inicialização
  populateEventTypes();
  // Seleciona a primeira categoria por padrão
  if (data.categories.length > 0) {
    eventTypeSelect.value = 0;
    renderItems();
  }

  /**
   * Reseta dados para o estado padrão
   */
  resetDataBtn.addEventListener('click', () => {
    // Reseta sem confirmação explícita para simplificar no ambiente de execução
    data = getDefaultData();
    saveData(data);
    populateEventTypes();
    currentCategoryIndex = 0;
    eventTypeSelect.value = 0;
    renderItems();
  });

  /**
   * Mostrar/ocultar modal de categorias
   */
  function openCategoriesModal() {
    categoriesModal.classList.remove('hidden');
    categoriesModal.style.display = 'flex';
    renderCategoriesList();
  }
  function closeCategories() {
    categoriesModal.classList.add('hidden');
    categoriesModal.style.display = 'none';
  }

  manageCategoriesBtn.addEventListener('click', openCategoriesModal);
  closeCategoriesModal.addEventListener('click', closeCategories);

  saveNewCategoryBtn.addEventListener('click', () => {
    const name = newCategoryNameInput.value.trim();
    if (!name) return;
    data.categories.push({ name: name, items: [] });
    newCategoryNameInput.value = '';
    saveData(data);
    populateEventTypes();
    renderCategoriesList();
  });

  /**
   * Manipula a abertura e fechamento do modal de tema
   */
  function openThemeModal() {
    // definir cor atual no picker
    const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    themeColorPicker.value = currentColor;
    // definir modo atual no seletor
    const currentMode = document.documentElement.getAttribute('data-theme') || 'light';
    if (themeModeSelect) {
      themeModeSelect.value = currentMode;
    }
    themeModal.classList.remove('hidden');
    themeModal.style.display = 'flex';
  }

  function closeTheme() {
    themeModal.classList.add('hidden');
    themeModal.style.display = 'none';
  }

  openThemeModalBtn.addEventListener('click', openThemeModal);
  closeThemeModal.addEventListener('click', closeTheme);
  saveThemeBtn.addEventListener('click', () => {
    const color = themeColorPicker.value;
    if (color) {
      applyAccentColor(color);
      localStorage.setItem('accentColor', color);
    }
    // salvar e aplicar modo de tema
    const mode = themeModeSelect ? themeModeSelect.value : 'light';
    applyTheme(mode);
    localStorage.setItem('themeMode', mode);
    closeTheme();
  });

  /**
   * Renderiza a lista de categorias dentro do modal de gerenciamento
   */
  function renderCategoriesList() {
    categoriesListEl.innerHTML = '';
    data.categories.forEach((cat, idx) => {
      const row = document.createElement('div');
      row.className = 'category-row';
      // Nome da categoria
      const nameSpan = document.createElement('span');
      nameSpan.className = 'category-name';
      nameSpan.textContent = cat.name;
      row.appendChild(nameSpan);
      // Ações
      const actions = document.createElement('div');
      actions.className = 'cat-actions';
      // Editar categoria
      const editCatBtn = document.createElement('button');
      editCatBtn.className = 'btn-secondary';
      editCatBtn.textContent = 'Editar';
      editCatBtn.addEventListener('click', () => {
        const newName = prompt('Editar nome da categoria:', cat.name);
        if (newName && newName.trim()) {
          cat.name = newName.trim();
          saveData(data);
          populateEventTypes();
          renderCategoriesList();
          // Atualiza título se for categoria atual
          if (idx === currentCategoryIndex) {
            currentEventTitle.textContent = cat.name;
          }
        }
      });
      actions.appendChild(editCatBtn);
      // Remover categoria
      const deleteCatBtn = document.createElement('button');
      deleteCatBtn.className = 'btn-danger';
      deleteCatBtn.textContent = 'Excluir';
      deleteCatBtn.addEventListener('click', () => {
        // Remover categoria
        data.categories.splice(idx, 1);
        // Ajustar índice atual
        if (currentCategoryIndex >= data.categories.length) {
          currentCategoryIndex = data.categories.length - 1;
        }
        saveData(data);
        populateEventTypes();
        renderCategoriesList();
        if (data.categories.length > 0) {
          eventTypeSelect.value = currentCategoryIndex;
          renderItems();
        } else {
          itemsSection.classList.add('hidden');
        }
      });
      actions.appendChild(deleteCatBtn);
      row.appendChild(actions);
      categoriesListEl.appendChild(row);
    });
  }

  /**
   * Instalação: lidar com evento beforeinstallprompt para mostrar banner
   */
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    // Se já foi exibido ou instalado, não mostrar novamente
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed === 'true') {
      return;
    }
    deferredInstallPrompt = event;
    // mostrar banner
    installBanner.classList.remove('hidden');
  });

  // Botão de instalação acionado
  installBannerBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    installBannerBtn.disabled = true;
    const result = await deferredInstallPrompt.prompt();
    // Após interagir, ocultar banner
    deferredInstallPrompt = null;
    installBanner.classList.add('hidden');
    // Registrar que a pessoa interagiu para não mostrar novamente
    localStorage.setItem('installPromptDismissed', 'true');
  });

  // Botão de fechar banner (usuário opta por não instalar)
  closeBannerBtn.addEventListener('click', () => {
    installBanner.classList.add('hidden');
    deferredInstallPrompt = null;
    localStorage.setItem('installPromptDismissed', 'true');
  });

  // Quando o app for instalado, esconder o banner
  window.addEventListener('appinstalled', () => {
    installBanner.classList.add('hidden');
    localStorage.setItem('installPromptDismissed', 'true');
  });

  /**
   * Registro do service worker
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.error('Service worker registration failed', err);
      });
    });
  }
})();