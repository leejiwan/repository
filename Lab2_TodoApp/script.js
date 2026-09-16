/**
 * My Tasks - 스마트 Todo 대시보드 애플리케이션 스크립트
 * Step 2 ~ Step 5 전체 기능 구현 완료본
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. 상수 정의 및 DOM 요소 캐싱
  // =========================================================================
  const STORAGE_KEY = 'MY_TASKS_TODO_DATA';
  const THEME_KEY = 'MY_TASKS_THEME';
  const SORT_KEY = 'MY_TASKS_SORT';

  // DOM 요소들
  const themeToggle = document.getElementById('theme-toggle');
  const currentDateEl = document.getElementById('current-date');
  
  // 대시보드 요소
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressText = document.getElementById('progress-text');
  const todayCountBadge = document.getElementById('today-count-badge');
  const remainingBadge = document.getElementById('remaining-badge');
  const statWorkText = document.getElementById('stat-work-text');
  const barWorkFill = document.getElementById('bar-work-fill');
  const statPersonalText = document.getElementById('stat-personal-text');
  const barPersonalFill = document.getElementById('bar-personal-fill');
  const statStudyText = document.getElementById('stat-study-text');
  const barStudyFill = document.getElementById('bar-study-fill');

  // 필터 카운트 뱃지
  const countAll = document.getElementById('count-all');
  const countWork = document.getElementById('count-work');
  const countPersonal = document.getElementById('count-personal');
  const countStudy = document.getElementById('count-study');

  // 툴바 요소
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFileInput = document.getElementById('import-file-input');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  // 필터 및 입력 폼 요소
  const filterBtns = document.querySelectorAll('.filter-btn');
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoCategory = document.getElementById('todo-category');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const emptyMessage = document.getElementById('empty-message');

  // =========================================================================
  // 2. 애플리케이션 상태 (State)
  // =========================================================================
  let state = {
    todos: [],
    currentFilter: 'all', // 'all' | 'work' | 'personal' | 'study'
    searchQuery: '',
    sortBy: localStorage.getItem(SORT_KEY) || 'created-desc',
    editingId: null // 현재 인라인 수정 중인 Todo의 ID
  };

  // =========================================================================
  // 3. 오늘 날짜 및 상대 시간 포맷팅 함수
  // =========================================================================
  const updateCurrentDateDisplay = () => {
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = days[now.getDay()];
    currentDateEl.textContent = `${year}. ${month}. ${date} (${day})`;
  };

  // "방금 전", "5분 전", "2시간 전", "N일 전" 상대 시간 계산
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diffSeconds = Math.floor((now - timestamp) / 1000);

    if (diffSeconds < 60) return '방금 전';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // =========================================================================
  // 4. LocalStorage 데이터 영구 저장 및 복원
  // =========================================================================
  const loadTodos = () => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const parsed = JSON.parse(rawData);
      // 기존 v1 데이터 호환성 보장 (category 없을 경우 fallback)
      return Array.isArray(parsed)
        ? parsed.map((item, index) => ({
            id: item.id || Date.now().toString() + index,
            text: item.text || '',
            category: item.category || 'personal',
            completed: Boolean(item.completed),
            createdAt: item.createdAt || Date.now(),
            order: item.order !== undefined ? item.order : index
          }))
        : [];
    } catch (error) {
      console.error('LocalStorage 파싱 오류:', error);
      return [];
    }
  };

  const saveTodos = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    } catch (error) {
      console.error('LocalStorage 저장 실패:', error);
    }
  };

  // =========================================================================
  // 5. 다크 모드 테마 관리
  // =========================================================================
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.checked = false;
    }
  };

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem(THEME_KEY, 'light');
    }
  });

  // =========================================================================
  // 6. 대시보드 통계 & 진행률 바 실시간 업데이트
  // =========================================================================
  const updateDashboard = () => {
    const total = state.todos.length;
    const completed = state.todos.filter((t) => t.completed).length;
    const remaining = total - completed;

    // 전체 진행률 계산
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBarFill.style.width = `${percent}%`;
    progressText.textContent = `${completed}/${total} 완료 (${percent}%)`;

    // 오늘 00:00:00 타임스탬프 계산
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = state.todos.filter((t) => t.createdAt >= todayStart.getTime()).length;

    // 뱃지 업데이트
    todayCountBadge.textContent = `오늘 추가: ${todayCount}개`;
    remainingBadge.textContent = `미완료: ${remaining}개`;

    // 카테고리별 통계 계산
    const getCatStats = (cat) => {
      const catItems = state.todos.filter((t) => t.category === cat);
      const catTotal = catItems.length;
      const catCompleted = catItems.filter((t) => t.completed).length;
      const catPercent = catTotal === 0 ? 0 : Math.round((catCompleted / catTotal) * 100);
      return { total: catTotal, completed: catCompleted, percent: catPercent };
    };

    const workStats = getCatStats('work');
    const personalStats = getCatStats('personal');
    const studyStats = getCatStats('study');

    // 카테고리 미니 바 & 텍스트 갱신
    statWorkText.textContent = `${workStats.completed}/${workStats.total}`;
    barWorkFill.style.width = `${workStats.percent}%`;

    statPersonalText.textContent = `${personalStats.completed}/${personalStats.total}`;
    barPersonalFill.style.width = `${personalStats.percent}%`;

    statStudyText.textContent = `${studyStats.completed}/${studyStats.total}`;
    barStudyFill.style.width = `${studyStats.percent}%`;

    // 필터 탭 카운트 갱신
    countAll.textContent = total;
    countWork.textContent = workStats.total;
    countPersonal.textContent = personalStats.total;
    countStudy.textContent = studyStats.total;
  };

  // =========================================================================
  // 7. 정렬 및 필터링 유틸리티
  // =========================================================================
  const getProcessedTodos = () => {
    // 1단계: 카테고리 필터링
    let filtered = state.todos.filter((todo) => {
      if (state.currentFilter === 'all') return true;
      return todo.category === state.currentFilter;
    });

    // 2단계: 검색어 필터링
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((todo) => todo.text.toLowerCase().includes(query));
    }

    // 3단계: 정렬 적용
    const sorted = [...filtered];
    switch (state.sortBy) {
      case 'created-asc':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'created-desc':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'status':
        // 미완료(completed: false)가 상단에 먼저 오도록 정렬
        sorted.sort((a, b) => (a.completed === b.completed ? b.createdAt - a.createdAt : a.completed ? 1 : -1));
        break;
      case 'manual':
      default:
        // 수동 드래그 정렬 순서 유지
        sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
        break;
    }

    return sorted;
  };

  // =========================================================================
  // 8. 렌더링 함수 (DOM 갱신 및 이벤트 바인딩)
  // =========================================================================
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'work': return '업무';
      case 'personal': return '개인';
      case 'study': return '공부';
      default: return '기타';
    }
  };

  const render = () => {
    // 대시보드 통계 동기화
    updateDashboard();

    const displayTodos = getProcessedTodos();
    todoList.innerHTML = '';

    // 빈 상태 처리
    if (displayTodos.length === 0) {
      emptyState.classList.add('visible');
      if (state.searchQuery.trim()) {
        emptyMessage.textContent = '검색 결과와 일치하는 할 일이 없습니다.';
      } else if (state.currentFilter !== 'all') {
        emptyMessage.textContent = `선택한 카테고리에 할 일이 없습니다.`;
      } else {
        emptyMessage.textContent = '할 일이 없습니다. 추가해보세요!';
      }
    } else {
      emptyState.classList.remove('visible');
    }

    // 할 일 리스트 생성
    displayTodos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;
      li.setAttribute('draggable', state.sortBy === 'manual' || state.sortBy === 'created-desc' ? 'true' : 'false');

      // 인라인 수정 모드인지 확인
      if (state.editingId === todo.id) {
        li.innerHTML = `
          <form class="inline-edit-form" id="edit-form-${todo.id}">
            <select class="edit-category-select">
              <option value="work" ${todo.category === 'work' ? 'selected' : ''}>💼 업무</option>
              <option value="personal" ${todo.category === 'personal' ? 'selected' : ''}>🌱 개인</option>
              <option value="study" ${todo.category === 'study' ? 'selected' : ''}>📚 공부</option>
            </select>
            <input type="text" class="edit-input" value="${escapeHtml(todo.text)}" maxlength="100" required>
            <div class="edit-actions">
              <button type="submit" class="edit-btn-save">저장</button>
              <button type="button" class="edit-btn-cancel">취소</button>
            </div>
          </form>
        `;

        // 폼 제출 이벤트 바인딩
        setTimeout(() => {
          const editForm = li.querySelector('.inline-edit-form');
          const editInput = li.querySelector('.edit-input');
          const editCat = li.querySelector('.edit-category-select');
          const cancelBtn = li.querySelector('.edit-btn-cancel');

          editInput.focus();
          editInput.setSelectionRange(editInput.value.length, editInput.value.length);

          const saveEdit = () => {
            const newText = editInput.value.trim();
            if (newText) {
              todo.text = newText;
              todo.category = editCat.value;
              saveTodos();
            }
            state.editingId = null;
            render();
          };

          const cancelEdit = () => {
            state.editingId = null;
            render();
          };

          editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEdit();
          });

          cancelBtn.addEventListener('click', cancelEdit);

          editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              cancelEdit();
            }
          });
        }, 0);
      } else {
        // 일반 조회 모드
        li.innerHTML = `
          <div class="todo-left-content">
            <span class="drag-handle" title="드래그하여 순서 변경">⋮⋮</span>
            <input 
              type="checkbox" 
              class="todo-checkbox" 
              ${todo.completed ? 'checked' : ''} 
              aria-label="${escapeHtml(todo.text)} 완료 여부"
            >
            <span class="category-tag tag-${todo.category}">
              ${getCategoryLabel(todo.category)}
            </span>
            <div class="todo-body">
              <span class="todo-text" title="더블클릭하여 내용 수정">${escapeHtml(todo.text)}</span>
              <span class="todo-meta">${getRelativeTime(todo.createdAt)}</span>
            </div>
          </div>
          <div class="item-actions">
            <button type="button" class="action-btn edit-btn" title="수정 (더블클릭 가능)">✏️</button>
            <button type="button" class="action-btn delete-btn" title="삭제">×</button>
          </div>
        `;
      }

      todoList.appendChild(li);
    });

    // 드래그 앤 드롭 이벤트 설정
    initDragAndDrop();
  };

  // HTML XSS 방지 유틸
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // =========================================================================
  // 9. 할 일 추가, 토글, 삭제 로직
  // =========================================================================
  const handleAddTodo = (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    if (!text) {
      todoInput.focus();
      return;
    }

    const category = todoCategory.value || 'personal';
    const newTodo = {
      id: Date.now().toString(),
      text: text,
      category: category,
      completed: false,
      createdAt: Date.now(),
      order: state.todos.length
    };

    // 새 할 일을 배열 맨 앞에 추가
    state.todos.unshift(newTodo);
    saveTodos();
    render();

    todoInput.value = '';
    todoInput.focus();
  };

  // 목록 클릭 & 더블클릭 이벤트 (이벤트 위임)
  todoList.addEventListener('click', (e) => {
    const target = e.target;
    const item = target.closest('.todo-item');
    if (!item) return;

    const todoId = item.dataset.id;
    const todo = state.todos.find((t) => t.id === todoId);
    if (!todo) return;

    // 1. 체크박스 클릭 (완료/미완료 토글)
    if (target.classList.contains('todo-checkbox')) {
      todo.completed = target.checked;
      saveTodos();
      render();
      return;
    }

    // 2. 삭제 버튼 클릭 (페이드아웃 애니메이션 적용)
    if (target.classList.contains('delete-btn')) {
      item.classList.add('fade-out');
      setTimeout(() => {
        state.todos = state.todos.filter((t) => t.id !== todoId);
        saveTodos();
        render();
      }, 200);
      return;
    }

    // 3. 수정 버튼 클릭
    if (target.classList.contains('edit-btn')) {
      state.editingId = todoId;
      render();
      return;
    }
  });

  // 더블 클릭 시 인라인 수정 진입
  todoList.addEventListener('dblclick', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    const todoId = item.dataset.id;
    if (todoId) {
      state.editingId = todoId;
      render();
    }
  });

  // =========================================================================
  // 10. 필터 탭 & 검색 & 정렬 기능
  // =========================================================================
  // 필터 탭 전환
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      render();
    });
  });

  // 실시간 검색
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
  });

  // 정렬 선택
  sortSelect.value = state.sortBy;
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    localStorage.setItem(SORT_KEY, state.sortBy);
    render();
  });

  // 완료된 항목 일괄 삭제
  clearCompletedBtn.addEventListener('click', () => {
    const completedCount = state.todos.filter((t) => t.completed).length;
    if (completedCount === 0) {
      alert('완료된 할 일이 없습니다.');
      return;
    }

    if (confirm(`완료된 할 일 ${completedCount}개를 모두 삭제하시겠습니까?`)) {
      state.todos = state.todos.filter((t) => !t.completed);
      saveTodos();
      render();
    }
  });

  // =========================================================================
  // 11. 데이터 백업 (JSON 내보내기 & 가져오기)
  // =========================================================================
  // JSON 파일 내보내기
  exportBtn.addEventListener('click', () => {
    if (state.todos.length === 0) {
      alert('내보낼 할 일 데이터가 없습니다.');
      return;
    }

    const dataStr = JSON.stringify(state.todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    link.href = url;
    link.download = `my_tasks_backup_${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  // JSON 파일 가져오기
  importBtn.addEventListener('click', () => {
    importFileInput.value = '';
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('기존 데이터를 덮어쓰고 파일의 할 일 데이터를 불러오시겠습니까?')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 유효성 정규화
        state.todos = importedData.map((item, idx) => ({
          id: item.id || Date.now().toString() + idx,
          text: String(item.text || '제목 없음'),
          category: ['work', 'personal', 'study'].includes(item.category) ? item.category : 'personal',
          completed: Boolean(item.completed),
          createdAt: item.createdAt || Date.now(),
          order: idx
        }));

        saveTodos();
        render();
        alert(`성공적으로 ${state.todos.length}개의 할 일을 가져왔습니다!`);
      } catch (err) {
        alert('JSON 파일을 파싱하는 데 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  });

  // =========================================================================
  // 12. 키보드 단축키 지원 (Alt+N, Alt+1~4)
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    // Alt + N: 새 할 일 입력창 포커스
    if (e.altKey && (e.key === 'n' || e.key === 'N' || e.code === 'KeyN')) {
      e.preventDefault();
      todoInput.focus();
      return;
    }

    // Alt + 1, 2, 3, 4: 카테고리 필터 전환
    if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      const filterMap = {
        '1': 'all',
        '2': 'work',
        '3': 'personal',
        '4': 'study'
      };
      const targetFilter = filterMap[e.key];
      const targetBtn = Array.from(filterBtns).find((b) => b.dataset.filter === targetFilter);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  });

  // =========================================================================
  // 13. HTML5 드래그 앤 드롭 (Sortable)
  // =========================================================================
  let draggedItem = null;

  const initDragAndDrop = () => {
    const items = todoList.querySelectorAll('.todo-item');

    items.forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.id);
      });

      item.addEventListener('dragend', () => {
        if (draggedItem) {
          draggedItem.classList.remove('dragging');
          draggedItem = null;
        }
        items.forEach((i) => i.classList.remove('drag-over'));
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (item !== draggedItem) {
          item.classList.add('drag-over');
        }
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');

        if (!draggedItem || draggedItem === item) return;

        const draggedId = draggedItem.dataset.id;
        const targetId = item.dataset.id;

        const draggedIdx = state.todos.findIndex((t) => t.id === draggedId);
        const targetIdx = state.todos.findIndex((t) => t.id === targetId);

        if (draggedIdx > -1 && targetIdx > -1) {
          // 배열 순서 스왑 및 order 재할당
          const [movedItem] = state.todos.splice(draggedIdx, 1);
          state.todos.splice(targetIdx, 0, movedItem);

          state.todos.forEach((t, index) => {
            t.order = index;
          });

          // 정렬 기준을 수동 정렬로 전환
          state.sortBy = 'manual';
          sortSelect.value = 'manual';
          localStorage.setItem(SORT_KEY, 'manual');

          saveTodos();
          render();
        }
      });
    });
  };

  // =========================================================================
  // 14. 초기화 실행
  // =========================================================================
  updateCurrentDateDisplay();
  initTheme();
  state.todos = loadTodos();
  render();
  todoForm.addEventListener('submit', handleAddTodo);

  // 1분마다 상대 시간 및 날짜 자동 리프레시
  setInterval(() => {
    updateCurrentDateDisplay();
    // 현재 인라인 수정 중이 아닐 때만 주기적 가벼운 리렌더링
    if (!state.editingId) {
      render();
    }
  }, 60000);
});
