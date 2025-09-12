import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.stubEnv('VITE_API_TOKEN', 'token');
vi.stubEnv('VITE_API_BASE_URL', 'http://api');

vi.mock('@/repositories/ContactRepository', () => ({ contactRepository: {} }));

import { useContactsStore } from '@/stores/contacts';

describe('contacts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates sort field and resets page', () => {
    const store = useContactsStore();
    store.currentPage = 2 as any;
    store.updateSortField('createdAt');
    expect(store.sortField).toBe('createdAt');
    expect(store.currentPage).toBe(1);
  });

  it('toggles sort direction', () => {
    const store = useContactsStore();
    store.toggleSortDirection();
    expect(store.sortDirection).toBe('desc');
  });

  it('changes tab and resets page', () => {
    const store = useContactsStore();
    store.currentPage = 2 as any;
    store.setActiveTab('archived');
    expect(store.activeTab).toBe('archived');
    expect(store.currentPage).toBe(1);
  });

  it('pagination controls work', () => {
    const store = useContactsStore();
    store.totalPages = 5 as any;
    store.nextPage();
    expect(store.currentPage).toBe(2);
    store.previousPage();
    expect(store.currentPage).toBe(1);
    store.goToPage(3);
    expect(store.currentPage).toBe(3);
  });
});
